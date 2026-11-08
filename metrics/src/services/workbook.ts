import { parseFraction } from '../domain/study/metrics'
import type { Difficulty, Platform, ResultCell, StudyDataset, Task } from '../domain/study/types'

// Small, offline XLSX reader: ZIP + XML; no CDN, formulas, or executable content.
async function unzipWorkbook(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  const view = new DataView(buffer)
  const decoder = new TextDecoder()
  let end = -1
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      end = i
      break
    }
  }
  if (end < 0) throw new Error('The file is not a standard XLSX workbook.')
  const count = view.getUint16(end + 10, true)
  let cursor = view.getUint32(end + 16, true)
  if (count > 2000 || view.getUint16(end + 4, true) !== 0)
    throw new Error('This ZIP structure is not supported.')
  let uncompressed = 0
  const entries = new Map<
    string,
    { method: number; size: number; plainSize: number; offset: number }
  >()
  for (let i = 0; i < count; i++) {
    if (view.getUint32(cursor, true) !== 0x02014b50) throw new Error('The XLSX archive is damaged.')
    const flags = view.getUint16(cursor + 8, true)
    const method = view.getUint16(cursor + 10, true)
    const size = view.getUint32(cursor + 20, true)
    const plainSize = view.getUint32(cursor + 24, true)
    const nameLength = view.getUint16(cursor + 28, true)
    const extraLength = view.getUint16(cursor + 30, true)
    const commentLength = view.getUint16(cursor + 32, true)
    const offset = view.getUint32(cursor + 42, true)
    const name = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + nameLength))
    if (flags & 1) throw new Error('Password-protected workbooks are not supported.')
    uncompressed += plainSize
    if (uncompressed > 100 * 1024 * 1024)
      throw new Error('The uncompressed workbook exceeds 100 MB.')
    if (/^xl\/.+\.xml$/.test(name) && !name.includes('/media/'))
      entries.set(name, { method, size, plainSize, offset })
    if (name === 'xl/_rels/workbook.xml.rels')
      entries.set(name, { method, size, plainSize, offset })
    cursor += 46 + nameLength + extraLength + commentLength
  }
  return async (name: string): Promise<Document | null> => {
    const entry = entries.get(name)
    if (!entry) return null
    const { offset, size, method, plainSize } = entry
    if (view.getUint32(offset, true) !== 0x04034b50) throw new Error('The XLSX header is damaged.')
    const start =
      offset + 30 + view.getUint16(offset + 26, true) + view.getUint16(offset + 28, true)
    let content = bytes.slice(start, start + size)
    if (method === 8) {
      if (typeof DecompressionStream === 'undefined')
        throw new Error(
          'Import requires a current version of Chrome, Edge or Firefox. The built-in dataset is already available.',
        )
      const stream = new Blob([content])
        .stream()
        .pipeThrough(new DecompressionStream('deflate-raw'))
      const reader = stream.getReader()
      const chunks: Uint8Array[] = []
      let length = 0
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        length += value.length
        if (length > plainSize || length > 100 * 1024 * 1024) {
          await reader.cancel()
          throw new Error('Invalid ZIP entry size.')
        }
        chunks.push(value)
      }
      content = new Uint8Array(length)
      let position = 0
      chunks.forEach((chunk) => {
        content.set(chunk, position)
        position += chunk.length
      })
    } else if (method !== 0) throw new Error('Unsupported XLSX compression.')
    if (content.length !== plainSize)
      throw new Error('The XLSX entry size does not match its header.')
    const xml = new DOMParser().parseFromString(decoder.decode(content), 'application/xml')
    if (xml.getElementsByTagName('parsererror').length)
      throw new Error('Unable to read the workbook XML.')
    return xml
  }
}

export async function readWorkbook(file: File): Promise<StudyDataset> {
  if (!/\.xlsx$/i.test(file.name))
    throw new Error('Choose an .xlsx file with the same column structure as chosen_tasks.')
  if (file.size > 25 * 1024 * 1024) throw new Error('The maximum file size is 25 MB.')
  const buffer = await file.arrayBuffer()
  const get = await unzipWorkbook(buffer)
  const [workbook, relations, stringsXml, styles] = await Promise.all(
    ['xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/sharedStrings.xml', 'xl/styles.xml'].map(
      get,
    ),
  )
  if (!workbook || !relations) throw new Error('The workbook has no sheet definitions.')
  const elements = (node: Document | Element | null | undefined, name: string): Element[] =>
    Array.from(node?.getElementsByTagNameNS('*', name) || [])
  const richText = (node: Element) =>
    elements(node, 't')
      .map((t) => t.textContent)
      .join('')
  const strings = elements(stringsXml, 'si').map(richText)
  const formats = new Map(
    elements(styles, 'numFmt').map((n) => [
      n.getAttribute('numFmtId'),
      n.getAttribute('formatCode'),
    ]),
  )
  const xfs = elements(styles, 'cellXfs')[0]
  const dateStyles = new Set(
    Array.from(xfs?.children || []).flatMap((xf, i) => {
      const format = (formats.get(xf.getAttribute('numFmtId') ?? '') || '')
        .replace(/\[[^\]]*\]|"[^"]*"/g, '')
        .toLowerCase()
      return /^d{1,2}\/m{1,2}$/.test(format) ? [String(i)] : []
    }),
  )
  const date1904 = ['1', 'true'].includes(
    elements(workbook, 'workbookPr')[0]?.getAttribute('date1904') ?? '',
  )
  let sheetName = '',
    recovered = 0
  const tasks: Task[] = []
  const allSheets = elements(workbook, 'sheet')
  for (const sheet of allSheets) {
    const id = sheet.getAttributeNS(
      'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'id',
    )
    const target = elements(relations, 'Relationship')
      .find((r) => r.getAttribute('Id') === id)
      ?.getAttribute('Target')
    if (!target) continue
    const segments = (target.startsWith('/') ? target.slice(1) : `xl/${target}`).split('/')
    const normalized: string[] = []
    segments.forEach((s) => {
      if (s === '..') normalized.pop()
      else if (s && s !== '.') normalized.push(s)
    })
    const xml = await get(normalized.join('/'))
    if (!xml) continue
    const rows = elements(xml, 'row').map((row) => {
      const cells: Record<string, ResultCell> = {}
      for (const c of elements(row, 'c')) {
        const type = c.getAttribute('t')
        const raw = elements(c, 'v')[0]?.textContent || ''
        let value =
          type === 's' ? (strings[Number(raw)] ?? '') : type === 'inlineStr' ? richText(c) : raw
        const restored =
          !['s', 'inlineStr'].includes(type ?? '') &&
          dateStyles.has(c.getAttribute('s') ?? '0') &&
          raw !== ''
        if (restored) {
          if (!Number.isFinite(Number(raw)) || Number(raw) < 1 || Number(raw) > 2958465)
            throw new Error('Invalid date in a result cell.')
          const epoch = date1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, 30)
          const date = new Date(epoch + Number(raw) * 86400000)
          value = `${date.getUTCDate()}/${date.getUTCMonth() + 1}`
        }
        const address = c.getAttribute('r') || ''
        cells[address.replace(/\d/g, '')] = {
          value: String(value).trim(),
          raw: restored ? raw : String(value).trim(),
          recovered: restored,
          address,
        }
      }
      return { row: Number(row.getAttribute('r')), cells }
    })
    const header = rows.find((row) => row.cells.J?.value === 'Task ID')
    const expected = [
      'Kazakh Version Test Case (5.6-Sol)',
      'English Version Test Case (5.6-Sol)',
      'Kazakh-Russian Version Test Case (5.6-Sol)',
      'Kazakh Version Test Case (Sonnet-5.5)',
      'English Version Test Case (Sonnet-5.5)',
      'Kazakh-Russian Version Test Case (Sonnet-5.5)',
    ]
    if (
      !header ||
      !Array.from('DEFGHI').every((col, i) => header.cells[col]?.value === expected[i])
    )
      continue
    sheetName = sheet.getAttribute('name') ?? ''
    for (const { row, cells } of rows) {
      const getValue = (col: string) => cells[col]?.value || ''
      const id = getValue('J')
      if (!/^T\d{3}$/.test(id)) continue
      if (tasks.some((t) => t.id === id))
        throw new Error(`Duplicate ID ${id}. Check the spreadsheet.`)
      const name = getValue('B'),
        difficulty = getValue('A'),
        url = getValue('C')
      if (!name || !['Easy', 'Medium', 'Hard'].includes(difficulty))
        throw new Error(`Check the name and difficulty of task ${id}.`)
      const results = Array.from('DEFGHI').map(
        (col) => cells[col] || { value: '', raw: '', recovered: false, address: `${col}${row}` },
      )
      const malformed = results.find((c) => {
        const parsed = parseFraction(c.value)
        return c.value && !parsed.valid && !parsed.unknown
      })
      if (malformed)
        throw new Error(
          `${id}, ${malformed.address}: “${malformed.value}”. Expected passed/total or passed/?. Numeric dates are restored only with the d/m format.`,
        )
      recovered += results.filter((c) => c.recovered).length
      const rating = /,\s*(\d{3,4})\)/.exec(name)
      const platform: Platform =
        /codeforces/i.test(url + name) || rating ? 'Codeforces' : 'LeetCode'
      tasks.push({
        id,
        name,
        difficulty: difficulty as Difficulty,
        platform,
        rating: rating ? Number(rating[1]) : null,
        url: /^https?:\/\//i.test(url) ? url : '',
        row,
        results,
      })
    }
    break
  }
  if (!tasks.length)
    throw new Error(
      'No sheet matches columns A–J of chosen_tasks: Difficulty, Task Name, Link, six results and Task ID.',
    )
  const hash = globalThis.crypto?.subtle
    ? Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buffer)))
        .map((n) => n.toString(16).padStart(2, '0'))
        .join('')
    : ''
  return { source: file.name, sheet: sheetName, sha256: hash, recoveredCells: recovered, tasks }
}
