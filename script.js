/* All displayed metrics are derived from the fractions, never from PDF totals. */
'use strict';

const LANGUAGES = ['KZ', 'EN', 'Mix'];
const MODELS = ['5.6-Sol', 'Sonnet-5.5'];
const EPSILON = 1e-9;

function parseFraction(value) {
  const text = String(value ?? '').trim();
  const match = /^(\d+)\s*\/\s*(\d+|\?)$/.exec(text);
  if (!match) return { valid: false, reason: text ? 'Invalid fraction format' : 'Empty cell' };
  const passed = Number(match[1]);
  if (!Number.isSafeInteger(passed)) return { valid: false, reason: 'Number exceeds the safe integer range' };
  if (match[2] === '?') return { valid: false, unknown: true, passed, reason: 'Unknown denominator' };
  const total = Number(match[2]);
  if (!Number.isSafeInteger(total) || total <= 0 || passed > total) return { valid: false, reason: 'Expected 0 ≤ passed ≤ total and total > 0' };
  return { valid: true, passed, total, rate: passed / total };
}

function parsedTask(task) { return task.results.map(cell => parseFraction(cell.value)); }
function isComplete(task) { return task.results.length === 6 && parsedTask(task).every(cell => cell.valid); }
function mean(values) { return values.length ? values.reduce((sum, n) => sum + n, 0) / values.length : null; }
function taskRate(task, model, languages = [0, 1, 2]) {
  const cells = parsedTask(task);
  const values = languages.map(language => cells[model * 3 + language]);
  return values.every(c => c?.valid) ? mean(values.map(c => c.rate)) * 100 : null;
}

function metrics(tasks, languages = [0, 1, 2], aggregation = 'macro') {
  // Complete cases preserve the same paired cohort across models and languages.
  const included = tasks.filter(isComplete);
  const excluded = tasks.filter(task => !isComplete(task));
  const models = MODELS.map((name, model) => {
    const rows = included.map(task => languages.map(language => parseFraction(task.results[model * 3 + language].value)));
    const cells = rows.flat();
    const passed = cells.reduce((sum, cell) => sum + cell.passed, 0);
    const total = cells.reduce((sum, cell) => sum + cell.total, 0);
    const rate = !cells.length ? null : aggregation === 'micro' ? passed / total * 100 : mean(rows.map(row => mean(row.map(cell => cell.rate)))) * 100;
    const full = cells.filter(cell => cell.passed === cell.total).length;
    const zero = cells.filter(cell => cell.passed === 0).length;
    const partial = cells.length - full - zero;
    return { name, rate, passed, total, cells: cells.length, full, zero, partial,
      partialRate: cells.length ? partial / cells.length * 100 : null,
      fullTasks: rows.filter(row => row.every(cell => cell.passed === cell.total)).length,
      anyFullTasks: rows.filter(row => row.some(cell => cell.passed === cell.total)).length };
  });
  const wins = { sonnet: 0, equal: 0, sol: 0 };
  for (const task of included) {
    const delta = taskRate(task, 1, languages) - taskRate(task, 0, languages);
    wins[Math.abs(delta) < EPSILON ? 'equal' : delta > 0 ? 'sonnet' : 'sol']++;
  }
  return { included, excluded, n: included.length, models, wins,
    delta: included.length ? models[1].rate - models[0].rate : null };
}

function mixGap(task) {
  if (!isComplete(task)) return null;
  return mean([0, 1].map(model => taskRate(task, model, [2]) - taskRate(task, model, [0, 1])));
}

// Small, offline XLSX reader: ZIP + XML; no CDN, formulas, or executable content.
async function unzipWorkbook(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const decoder = new TextDecoder();
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { end = i; break; }
  }
  if (end < 0) throw new Error('The file is not a standard XLSX workbook.');
  const count = view.getUint16(end + 10, true);
  let cursor = view.getUint32(end + 16, true);
  if (count > 2000 || view.getUint16(end + 4, true) !== 0) throw new Error('This ZIP structure is not supported.');
  let uncompressed = 0;
  const entries = new Map();
  for (let i = 0; i < count; i++) {
    if (view.getUint32(cursor, true) !== 0x02014b50) throw new Error('The XLSX archive is damaged.');
    const flags = view.getUint16(cursor + 8, true);
    const method = view.getUint16(cursor + 10, true);
    const size = view.getUint32(cursor + 20, true);
    const plainSize = view.getUint32(cursor + 24, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const offset = view.getUint32(cursor + 42, true);
    const name = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + nameLength));
    if (flags & 1) throw new Error('Password-protected workbooks are not supported.');
    uncompressed += plainSize;
    if (uncompressed > 100 * 1024 * 1024) throw new Error('The uncompressed workbook exceeds 100 MB.');
    if (/^xl\/.+\.xml$/.test(name) && !name.includes('/media/')) entries.set(name, { method, size, plainSize, offset });
    if (name === 'xl/_rels/workbook.xml.rels') entries.set(name, { method, size, plainSize, offset });
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return async name => {
    const entry = entries.get(name);
    if (!entry) return null;
    const { offset, size, method, plainSize } = entry;
    if (view.getUint32(offset, true) !== 0x04034b50) throw new Error('The XLSX header is damaged.');
    const start = offset + 30 + view.getUint16(offset + 26, true) + view.getUint16(offset + 28, true);
    let content = bytes.slice(start, start + size);
    if (method === 8) {
      if (typeof DecompressionStream === 'undefined') throw new Error('Import requires a current version of Chrome, Edge or Firefox. The built-in dataset is already available.');
      const stream = new Blob([content]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      const reader = stream.getReader();
      const chunks = []; let length = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.length;
        if (length > plainSize || length > 100 * 1024 * 1024) { await reader.cancel(); throw new Error('Invalid ZIP entry size.'); }
        chunks.push(value);
      }
      content = new Uint8Array(length); let position = 0;
      chunks.forEach(chunk => { content.set(chunk, position); position += chunk.length; });
    } else if (method !== 0) throw new Error('Unsupported XLSX compression.');
    if (content.length !== plainSize) throw new Error('The XLSX entry size does not match its header.');
    const xml = new DOMParser().parseFromString(decoder.decode(content), 'application/xml');
    if (xml.getElementsByTagName('parsererror').length) throw new Error('Unable to read the workbook XML.');
    return xml;
  };
}

async function readWorkbook(file) {
  if (!/\.xlsx$/i.test(file.name)) throw new Error('Choose an .xlsx file with the same column structure as chosen_tasks.');
  if (file.size > 25 * 1024 * 1024) throw new Error('The maximum file size is 25 MB.');
  const buffer = await file.arrayBuffer();
  const get = await unzipWorkbook(buffer);
  const [workbook, relations, stringsXml, styles] = await Promise.all(['xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/sharedStrings.xml', 'xl/styles.xml'].map(get));
  if (!workbook || !relations) throw new Error('The workbook has no sheet definitions.');
  const elements = (node, name) => Array.from(node?.getElementsByTagNameNS('*', name) || []);
  const richText = node => elements(node, 't').map(t => t.textContent).join('');
  const strings = elements(stringsXml, 'si').map(richText);
  const formats = new Map(elements(styles, 'numFmt').map(n => [n.getAttribute('numFmtId'), n.getAttribute('formatCode')]));
  const xfs = elements(styles, 'cellXfs')[0];
  const dateStyles = new Set(Array.from(xfs?.children || []).flatMap((xf, i) => {
    const format = (formats.get(xf.getAttribute('numFmtId')) || '').replace(/\[[^\]]*\]|"[^"]*"/g, '').toLowerCase();
    return /^d{1,2}\/m{1,2}$/.test(format) ? [String(i)] : [];
  }));
  const date1904 = ['1', 'true'].includes(elements(workbook, 'workbookPr')[0]?.getAttribute('date1904'));
  let sheetName = '', tasks = [], recovered = 0;
  const allSheets = elements(workbook, 'sheet');
  for (const sheet of allSheets) {
    const id = sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
    const target = elements(relations, 'Relationship').find(r => r.getAttribute('Id') === id)?.getAttribute('Target');
    if (!target) continue;
    const segments = (target.startsWith('/') ? target.slice(1) : `xl/${target}`).split('/');
    const normalized = []; segments.forEach(s => { if (s === '..') normalized.pop(); else if (s && s !== '.') normalized.push(s); });
    const xml = await get(normalized.join('/'));
    if (!xml) continue;
    const rows = elements(xml, 'row').map(row => {
      const cells = {};
      for (const c of elements(row, 'c')) {
        const type = c.getAttribute('t');
        const raw = elements(c, 'v')[0]?.textContent || '';
        let value = type === 's' ? strings[Number(raw)] ?? '' : type === 'inlineStr' ? richText(c) : raw;
        const restored = !['s', 'inlineStr'].includes(type) && dateStyles.has(c.getAttribute('s')) && raw !== '';
        if (restored) {
          if (!Number.isFinite(Number(raw)) || Number(raw) < 1 || Number(raw) > 2958465) throw new Error('Invalid date in a result cell.');
          const epoch = date1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, 30);
          const date = new Date(epoch + Number(raw) * 86400000);
          value = `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
        }
        const address = c.getAttribute('r') || '';
        cells[address.replace(/\d/g, '')] = { value: String(value).trim(), raw: restored ? raw : String(value).trim(), recovered: restored, address };
      }
      return { row: Number(row.getAttribute('r')), cells };
    });
    const header = rows.find(row => row.cells.J?.value === 'Task ID');
    const expected = ['Kazakh Version Test Case (5.6-Sol)', 'English Version Test Case (5.6-Sol)', 'Kazakh-Russian Version Test Case (5.6-Sol)', 'Kazakh Version Test Case (Sonnet-5.5)', 'English Version Test Case (Sonnet-5.5)', 'Kazakh-Russian Version Test Case (Sonnet-5.5)'];
    if (!header || !Array.from('DEFGHI').every((col, i) => header.cells[col]?.value === expected[i])) continue;
    sheetName = sheet.getAttribute('name');
    for (const { row, cells } of rows) {
      const getValue = col => cells[col]?.value || '';
      const id = getValue('J');
      if (!/^T\d{3}$/.test(id)) continue;
      if (tasks.some(t => t.id === id)) throw new Error(`Duplicate ID ${id}. Check the spreadsheet.`);
      const name = getValue('B'), difficulty = getValue('A'), url = getValue('C');
      if (!name || !['Easy', 'Medium', 'Hard'].includes(difficulty)) throw new Error(`Check the name and difficulty of task ${id}.`);
      const results = Array.from('DEFGHI').map(col => cells[col] || { value: '', raw: '', recovered: false, address: `${col}${row}` });
      const malformed = results.find(c => c.value && !parseFraction(c.value).valid && !parseFraction(c.value).unknown);
      if (malformed) throw new Error(`${id}, ${malformed.address}: “${malformed.value}”. Expected passed/total or passed/?. Numeric dates are restored only with the d/m format.`);
      recovered += results.filter(c => c.recovered).length;
      const rating = /,\s*(\d{3,4})\)/.exec(name);
      const platform = /codeforces/i.test(url + name) || rating ? 'Codeforces' : 'LeetCode';
      tasks.push({ id, name, difficulty, platform, rating: rating ? Number(rating[1]) : null, url: /^https?:\/\//i.test(url) ? url : '', row, results });
    }
    break;
  }
  if (!tasks.length) throw new Error('No sheet matches columns A–J of chosen_tasks: Difficulty, Task Name, Link, six results and Task ID.');
  const hash = globalThis.crypto?.subtle ? Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))).map(n => n.toString(16).padStart(2, '0')).join('') : '';
  return { source: file.name, sheet: sheetName, sha256: hash, recoveredCells: recovered, tasks };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { parseFraction, isComplete, taskRate, metrics, mixGap };

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const format = value => value === null || !Number.isFinite(value) ? '—' : new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(Math.abs(value) < .0000001 ? 0 : value);
  const pct = value => value === null ? '—' : `${format(value)}%`;
  const signed = value => value === null ? '—' : `${value > .0000001 ? '+' : ''}${format(value)}`;
  const tone = delta => delta === null ? 'muted' : delta < -EPSILON ? 'negative' : 'positive';
  const clone = value => JSON.parse(JSON.stringify(value));
  const original = clone(window.STUDY_DATA);
  let dataset = clone(original), changed = false;
  const state = { language: 'all', platform: 'all', difficulty: 'all', aggregation: 'macro', search: '', validity: 'all', sort: 'id', direction: 1, view: 'overview' };
  const selectedLanguages = () => state.language === 'all' ? [0, 1, 2] : [Number(state.language)];
  const filteredTasks = () => dataset.tasks.filter(t => (state.platform === 'all' || t.platform === state.platform) && (state.difficulty === 'all' || t.difficulty === state.difficulty));
  let toastTimer;
  function toast(message, error = false) { $('toast').textContent = message; $('toast').classList.toggle('error', error); $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, error ? 12000 : 4500); }

  function kpi(label, value, suffix, description, featured = false, dot = '') {
    return `<article class="kpi${featured ? ' kpi-featured' : ''}"><div class="kpi-label">${dot ? `<i class="${dot}-dot"></i>` : ''}${label}</div><div class="kpi-number">${value}<small>${suffix}</small></div><div class="kpi-description">${description}</div></article>`;
  }
  function renderOverview(result, tasks) {
    const languages = selectedLanguages();
    $('kpis').innerHTML = kpi('5.6-Sol', format(result.models[0].rate), result.n ? '%' : '', `${result.models[0].fullTasks} of ${result.n} tasks · 100% in selected languages`, false, 'sol')
      + kpi('Sonnet-5.5', format(result.models[1].rate), result.n ? '%' : '', `${result.models[1].fullTasks} of ${result.n} tasks · 100% in selected languages`, true, 'sonnet')
      + kpi('Model difference', signed(result.delta), result.n ? 'pp' : '', 'Sonnet-5.5 − 5.6-Sol')
      + kpi('Included tasks', String(result.n).padStart(2, '0'), '', `${result.n * languages.length * 2} cells · ${result.excluded.length} tasks excluded`);
    const languageMetrics = LANGUAGES.map((_, i) => metrics(tasks, [i], state.aggregation));
    $('language-chart').innerHTML = LANGUAGES.map((name, i) => `<div class="language-group ${!languages.includes(i) ? 'dimmed' : ''}"><div class="bar-pair">${languageMetrics[i].models.map((model, m) => `<div class="chart-bar ${m ? 'sonnet' : ''}" style="height:${model.rate ?? 0}%" role="img" aria-label="${model.name}, ${name}: ${pct(model.rate)}"><span class="bar-value">${format(model.rate)}</span></div>`).join('')}</div><div class="language-name">${name}<small>${['Kazakh', 'English', 'KZ + RU'][i]}</small></div></div>`).join('');
    const best = languageMetrics.map((m, i) => ({ i, value: mean(m.models.map(model => model.rate)) })).filter(v => v.value !== null).sort((a, b) => b.value - a.value);
    $('language-insight').innerHTML = !result.n ? 'No complete tasks to compare.' : `Best mean result: <strong>${best.filter(x => Math.abs(x.value - best[0].value) < EPSILON).map(x => LANGUAGES[x.i]).join(', ')} · ${pct(best[0].value)}</strong> across both models. All languages are shown for context.`;
    const difficulties = ['Easy', 'Medium', 'Hard'].map(name => ({ name, ...metrics(tasks.filter(t => t.difficulty === name), languages, state.aggregation) }));
    $('difficulty-chart').innerHTML = difficulties.map(group => `<div class="difficulty-row"><div class="difficulty-name">${group.name}<small>${group.n} tasks</small></div><div class="horizontal-pair">${group.models.map((m, i) => `<div class="horizontal-line ${i ? 'sonnet' : ''}"><div class="horizontal-track" role="img" aria-label="${m.name}, ${group.name}: ${pct(m.rate)}"><span style="width:${m.rate ?? 0}%"></span></div><span>${pct(m.rate)}</span></div>`).join('')}</div></div>`).join('');
    const largest = difficulties.filter(g => g.n).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
    $('difficulty-insight').innerHTML = largest ? `Largest difference: <strong>${largest.name}: ${signed(largest.delta)} pp</strong> This group contains ${largest.n} tasks.` : 'Try a different combination of filters.';
    const winGroups = [{ key: 'sonnet', label: 'Sonnet wins', cls: 'win-sonnet' }, { key: 'equal', label: 'Tied', cls: 'win-equal' }, { key: 'sol', label: 'Sol wins', cls: 'win-sol' }];
    $('wins').innerHTML = `<div class="win-bar" role="img" aria-label="Sonnet wins: ${result.wins.sonnet}; tied: ${result.wins.equal}; Sol wins: ${result.wins.sol}">${winGroups.map(g => `<span class="${g.cls}" style="width:${result.n ? result.wins[g.key] / result.n * 100 : 0}%"></span>`).join('')}</div><div class="win-numbers">${winGroups.map(g => `<div><strong>${result.wins[g.key]}</strong><span><i class="${g.cls}" style="display:inline-block;border-radius:1px"></i>${g.label}</span></div>`).join('')}</div><p class="small-note">Compares the mean across ${languages.length === 1 ? `${LANGUAGES[languages[0]]}` : 'all three languages'} for each task. The unit of analysis is a task.</p>`;
    $('outcomes').innerHTML = result.models.map(m => `<div class="outcome-row"><span>${m.name}</span><div class="outcome-stack" role="img" aria-label="${m.name}: full ${m.full}, partial ${m.partial}, zero ${m.zero}">${[['full', m.full], ['partial', m.partial], ['zero', m.zero]].map(([key, n]) => `<span class="outcome-${key}" style="width:${m.cells ? n / m.cells * 100 : 0}%"></span>`).join('')}</div><strong>${pct(m.partialRate)} partial</strong></div>`).join('') + '<div class="outcome-legend"><span><i class="outcome-full"></i>100% of tests</span><span><i class="outcome-partial"></i>Some tests</span><span><i class="outcome-zero"></i>0% of tests</span></div>' + `<p class="small-note">Cells per model: ${result.models[0].cells}. Full: ${result.models[0].full} / ${result.models[1].full}; zero: ${result.models[0].zero} / ${result.models[1].zero}.</p>`;
    const groups = [{ name: 'LeetCode', test: t => t.platform === 'LeetCode' }, { name: 'Codeforces', test: t => t.platform === 'Codeforces' }, { name: 'CF · 800', test: t => t.platform === 'Codeforces' && t.rating === 800, sub: true }, { name: 'CF · 1100–1500', test: t => t.platform === 'Codeforces' && t.rating >= 1100 && t.rating <= 1500, sub: true }, { name: 'CF · 1900+', test: t => t.platform === 'Codeforces' && t.rating >= 1900, sub: true }];
    $('breakdown').innerHTML = groups.map(g => { const m = metrics(tasks.filter(g.test), languages, state.aggregation); return `<tr class="${g.sub ? 'subgroup' : ''}"><td>${g.name}</td><td>${m.n}</td><td>${pct(m.models[0].rate)}</td><td>${pct(m.models[1].rate)}</td><td class="${tone(m.delta)}">${signed(m.delta)}</td></tr>`; }).join('');
    const ranks = result.included.map(task => ({ task, sol: taskRate(task, 0, languages), sonnet: taskRate(task, 1, languages) })).map(t => ({ ...t, delta: t.sonnet - t.sol })).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.task.id.localeCompare(b.task.id)).slice(0, 5);
    $('ranking').innerHTML = ranks.map((r, i) => rankRow(r.task, i, `${pct(r.sol)} → ${pct(r.sonnet)}`, r.delta)).join('') || '<p class="empty">No tasks in the selected group.</p>';
    const mix = result.included.map(task => ({ task, delta: mixGap(task) })).filter(r => r.delta < -EPSILON).sort((a, b) => a.delta - b.delta || a.task.id.localeCompare(b.task.id)).slice(0, 5);
    $('mix-ranking').innerHTML = mix.map((r, i) => rankRow(r.task, i, `${r.task.id} · ${r.task.difficulty}`, r.delta)).join('') || '<p class="empty">No tasks in this group have a lower Mix result.</p>';
    const summaryRows = [
      ['Mean pass rate', result.models.map(m => m.rate), 'percent'],
      ...LANGUAGES.map((lang, l) => [`Pass Rate · ${lang} (all-language context)`, languageMetrics[l].models.map(m => m.rate), 'percent']),
      ['100% in every selected language, tasks', result.models.map(m => m.fullTasks), 'count'],
      ['100% in at least one selected language, tasks', result.models.map(m => m.anyFullTasks), 'count'],
      ...LANGUAGES.map((lang, l) => [`Tasks at 100% · ${lang} (all-language context)`, languageMetrics[l].models.map(m => m.fullTasks), 'count']),
      ['Partial results, % of cells', result.models.map(m => m.partialRate), 'percent'],
      ['Partial results, cells', result.models.map(m => m.partial), 'count'],
      ['Results at 0%, cells', result.models.map(m => m.zero), 'count'],
      ['Results at 100%, cells', result.models.map(m => m.full), 'count'],
    ];
    $('summary').innerHTML = summaryRows.map(([label, values, type]) => { const delta = values.some(v => v === null) ? null : values[1] - values[0]; const display = v => type === 'percent' ? pct(v) : v; return `<tr><td>${label}</td><td>${display(values[0])}</td><td>${display(values[1])}</td><td>${delta === null ? '—' : type === 'percent' ? `${signed(delta)} pp` : `${delta > 0 ? '+' : ''}${delta}`}</td></tr>`; }).join('');
    const cellCount = result.models.reduce((n, m) => n + m.cells, 0), partialCount = result.models.reduce((n, m) => n + m.partial, 0);
    $('combined-partial').textContent = `Partial results across both models: ${cellCount ? pct(partialCount / cellCount * 100) : '—'} (${partialCount} of ${cellCount} cells). KZ / EN / Mix rows show all languages for the same task selection; other rows use the selected language filter.`;
  }
  function rankRow(task, i, detail, delta) {
    return `<div class="rank-row"><span class="rank-index">${String(i + 1).padStart(2, '0')}</span><div class="rank-task"><button data-task="${escape(task.id)}" title="${escape(task.name)}">${escape(task.name)}</button><small>${escape(detail)}</small></div><div class="rank-delta ${tone(delta)}">${signed(delta)} <small>pp</small></div></div>`;
  }

  function fractionCell(cell) {
    const parsed = parseFraction(cell.value);
    const cls = !parsed.valid ? 'unknown' : parsed.rate === 1 ? 'full' : parsed.rate === 0 ? 'zero' : 'partial';
    const label = `${cell.address}: ${cell.value}${cell.recovered ? `; restored from Excel date ${cell.raw}` : ''}${parsed.valid ? `; ${pct(parsed.rate * 100)}` : `; ${parsed.reason}`}`;
    return `<span class="fraction ${cls}" title="${escape(label)}">${escape(cell.value || '—')}</span>`;
  }
  function renderData(tasks) {
    const languages = selectedLanguages();
    let rows = tasks.filter(t => `${t.id} ${t.name}`.toLocaleLowerCase().includes(state.search.toLocaleLowerCase()) && (state.validity === 'all' || isComplete(t) === (state.validity === 'valid')));
    const sortValue = task => state.sort === 'id' ? task.id : state.sort === 'sol' ? taskRate(task, 0, languages) : state.sort === 'sonnet' ? taskRate(task, 1, languages) : isComplete(task) ? taskRate(task, 1, languages) - taskRate(task, 0, languages) : null;
    rows = rows.sort((a, b) => { const av = sortValue(a), bv = sortValue(b); return av === null ? bv === null ? 0 : 1 : bv === null ? -1 : state.direction * (typeof av === 'string' ? av.localeCompare(bv) : av - bv); });
    $('table-count').textContent = `${rows.length} of ${tasks.length} tasks`;
    $('tasks-body').innerHTML = rows.map(t => { const complete = isComplete(t), delta = complete ? taskRate(t, 1, languages) - taskRate(t, 0, languages) : null; return `<tr><td>${escape(t.id)}</td><td><button class="task-name-button" data-task="${escape(t.id)}">${escape(t.name)}</button><span class="task-platform">${escape(t.platform)}${t.rating ? ` · ${t.rating}` : ''}</span></td><td><span class="difficulty-tag difficulty-${escape(t.difficulty)}">${escape(t.difficulty)}</span></td><td><div class="fraction-group">${t.results.slice(0, 3).map(fractionCell).join('')}</div></td><td><div class="fraction-group">${t.results.slice(3).map(fractionCell).join('')}</div></td><td class="${tone(delta)}">${signed(delta)}</td><td><span class="status-tag ${complete ? '' : 'excluded'}">${complete ? '● Included' : '○ Excluded'}</span></td></tr>`; }).join('') || '<tr><td colspan="7" class="empty">No tasks match your search.</td></tr>';
    $('data-footnote').textContent = 'Fractions follow the KZ · EN · Mix order for each model. Δ compares means across selected languages. Hover over a fraction for its source and percentage. Search and status apply only to this table; export saves the visible rows.';
    document.querySelectorAll('[data-sort]').forEach(b => { const active = b.dataset.sort === state.sort; b.parentElement.setAttribute('aria-sort', active ? state.direction === 1 ? 'ascending' : 'descending' : 'none'); });
    return rows;
  }
  function renderMethod() {
    const all = metrics(dataset.tasks);
    const recovered = dataset.tasks.reduce((n, t) => n + t.results.filter(c => c.recovered).length, 0);
    $('quality').innerHTML = `<div class="quality-item"><strong>${recovered}</strong><div><h3>Fractions restored from Excel dates</h3><p>The d/m format converts a date serial back to day/month. For example, 46084 → 3/3; T059: 46361 → 5/12. This restores the displayed value; the original input before Excel conversion is unknown. Each cell source is available in the task details.</p></div></div><div class="quality-item"><strong>${all.excluded.length}</strong><div><h3>Incomplete tasks excluded</h3><p>${all.excluded.length ? all.excluded.map(t => `${escape(t.id)} (${t.results.map((c, i) => !parseFraction(c.value).valid ? escape(c.address) : '').filter(Boolean).join(', ')})`).join('; ') : 'All tasks contain six valid fractions.'} ${all.excluded.length ? 'At least one denominator or result is missing. Unknown values are not replaced with zero; the entire task is excluded from both models.' : ''}</p></div></div><div class="quality-item"><strong>${all.n}</strong><div><h3>Paired tasks in the full dataset</h3><p>${all.n} × 3 languages × 2 models = ${all.n * 6} observations. Filters update the sample size. The dataset contains no repeated runs or independent replications.</p></div></div>`;
    const checks = [
      ['Included tasks', 78, all.n, false],
      ['Mean pass rate · 5.6-Sol', 83.7, all.models[0].rate, true],
      ['Mean pass rate · Sonnet-5.5', 95.2, all.models[1].rate, true],
      ['Δ Sonnet − Sol, pp', 11.5, all.delta, false, true],
      ...[0, 1].flatMap(m => LANGUAGES.map((lang, i) => [`${MODELS[m]} · ${lang}`, [[83, 87.7, 80.4], [95.6, 98.3, 91.7]][m][i], metrics(dataset.tasks, [i]).models[m].rate, true])),
      ...[0, 1].map(m => [`100% in all languages · ${MODELS[m]}`, [53, 57][m], all.models[m].fullTasks, false]),
      ...[0, 1].map(m => [`Partial cells · ${MODELS[m]}`, [61, 38][m], all.models[m].partial, false]),
      ['Sonnet better / tied / worse', '23 / 53 / 2', `${all.wins.sonnet} / ${all.wins.equal} / ${all.wins.sol}`, false]
    ];
    $('report-check').innerHTML = checks.map(([label, expected, actual, percent, decimal]) => { const same = typeof expected === 'string' ? expected === actual : actual !== null && (percent || decimal ? Math.round(actual * 10) === Math.round(expected * 10) : expected === actual); const display = x => typeof x === 'string' ? escape(x) : percent ? pct(x) : decimal ? format(x) : x === null ? '—' : x; return `<tr><td>${escape(label)}</td><td>${display(expected)}</td><td>${display(actual)}</td><td class="${same ? 'check-ok' : 'check-diff'}">${same ? '✓ Matches' : '≠ Differs'}</td></tr>`; }).join('');
  }
  function render() {
    const tasks = filteredTasks(), result = metrics(tasks, selectedLanguages(), state.aggregation);
    $('source-name').textContent = dataset.source;
    $('source-info').textContent = `${dataset.sheet} · ${dataset.tasks.length} tasks`;
    $('source-state').textContent = changed ? 'Data edited' : dataset.source === original.source && dataset.sha256 === original.sha256 ? 'Source data' : 'Imported file';
    $('source-name').title = dataset.sha256 ? `SHA-256: ${dataset.sha256}` : dataset.source;
    $('reset-data').hidden = !changed && dataset.sha256 === original.sha256;
    $('nav-count').textContent = dataset.tasks.length;
    $('cohort-info').innerHTML = `<strong>${result.n} of ${tasks.length} tasks</strong> included · ${result.excluded.length} excluded${result.excluded.length ? ` (${result.excluded.map(t => escape(t.id)).join(', ')})` : ''} · ${state.aggregation === 'macro' ? 'equal task weights' : 'weighted by test count'}`;
    renderOverview(result, tasks); renderData(tasks); renderMethod();
  }
  function setView() {
    const name = location.hash.slice(1);
    state.view = ['overview', 'data', 'method'].includes(name) ? name : 'overview';
    ['overview', 'data', 'method'].forEach(view => { $(`view-${view}`).hidden = view !== state.view; });
    document.querySelectorAll('nav [data-view]').forEach(link => { if (link.dataset.view === state.view) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
    $('page-title').textContent = { overview: 'Explore the difference.', data: 'Explore the data.', method: 'Every number has a method.' }[state.view];
    $('page-subtitle').textContent = { overview: 'Two models, three languages, one set of algorithmic tasks.', data: 'Every test result, its source and its inclusion status.', method: 'Formulas, inclusion rules and comparison with the original report.' }[state.view];
  }
  function resetFilters() {
    Object.assign(state, { language: 'all', platform: 'all', difficulty: 'all', aggregation: 'macro', search: '', validity: 'all', sort: 'id', direction: 1 });
    ['platform', 'difficulty', 'aggregation', 'search', 'validity'].forEach(id => { $(id).value = state[id]; });
    document.querySelectorAll('[data-language]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.language === 'all')));
  }
  document.querySelectorAll('[data-language]').forEach(b => b.addEventListener('click', () => { state.language = b.dataset.language; document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button === b))); render(); }));
  ['platform', 'difficulty', 'aggregation'].forEach(id => $(id).addEventListener('change', () => { state[id] = $(id).value; render(); }));
  $('reset-filters').addEventListener('click', () => { resetFilters(); render(); });
  $('search').addEventListener('input', () => { state.search = $('search').value; renderData(filteredTasks()); });
  $('validity').addEventListener('change', () => { state.validity = $('validity').value; renderData(filteredTasks()); });
  document.querySelectorAll('[data-sort]').forEach(b => b.addEventListener('click', () => { const sort = b.dataset.sort; state.direction = state.sort === sort ? -state.direction : sort === 'id' ? 1 : -1; state.sort = sort; renderData(filteredTasks()); }));
  window.addEventListener('hashchange', setView);
  $('print').addEventListener('click', () => window.print());
  $('reset-data').addEventListener('click', () => { dataset = clone(original); changed = false; resetFilters(); render(); toast('Original spreadsheet restored.'); });
  $('import-button').addEventListener('click', () => $('file-input').click());
  $('file-input').addEventListener('change', async () => {
    const file = $('file-input').files[0]; if (!file) return;
    $('import-button').disabled = true;
    try { const next = await readWorkbook(file); dataset = next; changed = false; resetFilters(); render(); toast(`Imported ${next.tasks.length} tasks. Fractions restored: ${next.recoveredCells}.`); }
    catch (error) { toast(`Import failed: ${error.message}`, true); }
    finally { $('import-button').disabled = false; $('file-input').value = ''; }
  });

  let editingTask = null;
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-task]'); if (!button) return;
    editingTask = dataset.tasks.find(t => t.id === button.dataset.task); if (!editingTask) return;
    $('task-id').textContent = `${editingTask.id} / SOURCE ROW ${editingTask.row}`;
    $('task-title').textContent = editingTask.name;
    $('task-meta').textContent = `${editingTask.platform} · ${editingTask.difficulty}${editingTask.rating ? ` · ${editingTask.rating}` : ''} · ${dataset.sheet}`;
    $('task-fields').innerHTML = MODELS.map((model, m) => `<div class="edit-model"><i class="${m ? 'sonnet' : 'sol'}-dot"></i> ${model}</div><div class="edit-grid">${LANGUAGES.map((lang, l) => { const i = m * 3 + l, c = editingTask.results[i]; return `<label>${lang}<input name="result${i}" value="${escape(c.value)}" autocomplete="off" required aria-label="${model}, ${lang}"><small>${escape(c.address)}${c.recovered ? ` · Excel: ${escape(c.raw)} → ${escape(c.value)}` : c.edited ? ' · edited manually' : ' · source fraction'}</small></label>`; }).join('')}</div>`).join('');
    $('edit-error').textContent = '';
    $('task-link').hidden = !editingTask.url;
    $('task-link').href = editingTask.url || '#';
    $('task-dialog').showModal();
  });
  $('close-dialog').addEventListener('click', () => $('task-dialog').close());
  $('task-dialog').addEventListener('click', event => { if (event.target === $('task-dialog')) { const box = $('task-dialog').getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) $('task-dialog').close(); } });
  $('edit-form').addEventListener('submit', event => {
    event.preventDefault(); if (!editingTask) return;
    const form = new FormData(event.target);
    const values = Array.from({ length: 6 }, (_, i) => String(form.get(`result${i}`)).trim());
    const invalid = values.findIndex(v => !parseFraction(v).valid && !parseFraction(v).unknown);
    if (invalid >= 0) { $('edit-error').textContent = `${MODELS[Math.floor(invalid / 3)]} / ${LANGUAGES[invalid % 3]}: ${parseFraction(values[invalid]).reason}.`; return; }
    let edited = false;
    editingTask.results = editingTask.results.map((c, i) => { const normalized = values[i].replace(/\s/g, ''); if (c.value === normalized) return c; edited = true; return { ...c, value: normalized, recovered: false, edited: true }; });
    if (edited) changed = true;
    $('task-dialog').close(); render(); toast(edited ? 'Results updated. All metrics recalculated.' : 'No values were changed.');
  });

  // CSV values are quoted and spreadsheet formula prefixes are neutralized.
  function csvCell(value) { const text = String(value ?? ''); return `"${(typeof value === 'string' && /^\s*[=+@-]/.test(text) ? "'" : '') + text.replace(/"/g, '""')}"`; }
  $('export').addEventListener('click', () => {
    const tasks = filteredTasks();
    const rows = state.view === 'data' ? renderData(tasks) : tasks;
    const result = metrics(rows, selectedLanguages(), state.aggregation);
    const lines = [['Prompt / Lens — calculated study metrics'], ['Source', dataset.source], ['Sheet', dataset.sheet], ['Source SHA-256', dataset.sha256], ['Manual edits', changed], ['Platform filter', state.platform], ['Difficulty filter', state.difficulty], ['Languages', selectedLanguages().map(l => LANGUAGES[l]).join(', ')], ['Aggregation', state.aggregation], ['Included tasks', result.n], ['Excluded tasks', result.excluded.map(t => t.id).join(', ')], ['Model', 'Pass rate (%)', 'Full tasks', 'At least one full language', 'Partial cells', 'Zero cells', 'Full cells'], ...result.models.map(m => [m.name, m.rate, m.fullTasks, m.anyFullTasks, m.partial, m.zero, m.full]), ['Delta (pp)', result.delta], [], ['Task ID', 'Task Name', 'Platform', 'Difficulty', 'Rating', 'Sol KZ', 'Sol EN', 'Sol Mix', 'Sonnet KZ', 'Sonnet EN', 'Sonnet Mix', 'Included', 'Sol task mean (%)', 'Sonnet task mean (%)', 'Delta task means (pp)', 'Mix gap (pp)'], ...rows.map(t => [t.id, t.name, t.platform, t.difficulty, t.rating, ...t.results.map(c => c.value), isComplete(t), taskRate(t, 0, selectedLanguages()), taskRate(t, 1, selectedLanguages()), isComplete(t) ? taskRate(t, 1, selectedLanguages()) - taskRate(t, 0, selectedLanguages()) : null, mixGap(t)])];
    const blob = new Blob(['\ufeff' + lines.map(row => row.map(csvCell).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = `llm-metrics-${state.aggregation}-${state.language}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`Exported metrics and ${rows.length} tasks.`);
  });
  setView(); render();
}
