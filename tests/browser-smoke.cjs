// Browser integration check using an already running headless Chrome on port 9222.
// Start Chrome with --headless --remote-debugging-port=9222 and a temporary profile.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');

async function run() {
  const tabs = await (await fetch('http://127.0.0.1:9222/json')).json();
  const tab = tabs.find(t => t.type === 'page');
  if (!tab) throw new Error('No Chrome page found');
  const socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let sequence = 0;
  const pending = new Map(), errors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) { const promise = pending.get(message.id); if (promise) { pending.delete(message.id); message.error ? promise.reject(new Error(JSON.stringify(message.error))) : promise.resolve(message.result); } }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expression => { const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails)); return result.result.value; };
  const waitFor = async expression => { const deadline = Date.now() + 10000; while (Date.now() < deadline) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 100)); } throw new Error(`Timed out: ${expression}`); };
  try {
    await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: pathToFileURL(path.join(root, 'index.html')).href });
    await waitFor("document.querySelectorAll('.kpi').length === 4");
    const numbers = await evaluate("[...document.querySelectorAll('.kpi-number')].map(n=>n.textContent)");
    assert.deepEqual(numbers, ['83.7%', '95.2%', '+11.5pp', '78']);
    console.log('PASS: direct file:// opening and PDF baseline');
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync('/tmp/rmt-metrics-desktop.png', Buffer.from(shot.data, 'base64'));

    const workbook = fs.readFileSync(path.join(root, 'chosen_tasks(1).xlsx')).toString('base64');
    const parity = await evaluate(`(async()=>{ const bytes=Uint8Array.from(atob(${JSON.stringify(workbook)}),c=>c.charCodeAt(0));const imported=await readWorkbook(new File([bytes],'chosen_tasks(1).xlsx'));return {n:imported.tasks.length,recovered:imported.recoveredCells,hash:imported.sha256,snapshotHash:window.STUDY_DATA.sha256,match:JSON.stringify(imported.tasks)===JSON.stringify(window.STUDY_DATA.tasks)};})()`);
    assert.equal(parity.n, 80); assert.equal(parity.recovered, 296); assert.equal(parity.hash, parity.snapshotHash);
    // Key order differs between Python and JS, so compare normalized records too.
    const mismatch = await evaluate(`(async()=>{const b=Uint8Array.from(atob(${JSON.stringify(workbook)}),c=>c.charCodeAt(0));const d=await readWorkbook(new File([b],'study.xlsx'));return d.tasks.filter((t,i)=>{const o=window.STUDY_DATA.tasks[i];return ['id','name','difficulty','platform','rating','url','row'].some(k=>t[k]!==o[k])||t.results.some((c,j)=>['value','raw','recovered','address'].some(k=>c[k]!==o.results[j][k]));}).map(t=>t.id);})()`);
    assert.deepEqual(mismatch, []);
    console.log('PASS: browser XLSX parser matches all 480 source cells and SHA-256');

    await evaluate("document.getElementById('difficulty').value='Hard';document.getElementById('difficulty').dispatchEvent(new Event('change'));document.querySelector('[data-language=\"1\"]').click()");
    assert.match(await evaluate("document.getElementById('cohort-info').textContent"), /38 of 40/);
    await evaluate("document.getElementById('aggregation').value='micro';document.getElementById('aggregation').dispatchEvent(new Event('change'))");
    assert.match(await evaluate("document.getElementById('cohort-info').textContent"), /weighted by test count/);
    await evaluate("document.getElementById('reset-filters').click();location.hash='data'");
    await waitFor("!document.getElementById('view-data').hidden");
    await evaluate("document.getElementById('search').value='T070';document.getElementById('search').dispatchEvent(new Event('input'))");
    assert.equal(await evaluate("document.querySelectorAll('#tasks-body tr').length"), 1);
    await evaluate("document.querySelector('#tasks-body [data-task]').click();document.querySelector('[name=result0]').value='99/1';document.getElementById('edit-form').requestSubmit()");
    assert.equal(await evaluate("document.getElementById('task-dialog').open && !!document.getElementById('edit-error').textContent"), true);
    await evaluate("document.querySelectorAll('#task-fields input').forEach(i=>i.value='1/1');document.getElementById('edit-form').requestSubmit()");
    assert.match(await evaluate("document.getElementById('cohort-info').textContent"), /79 of 80/);
    assert.equal(await evaluate("document.getElementById('task-dialog').open"), false);
    await evaluate("document.getElementById('reset-data').click();document.querySelector('[data-sort=delta]').click()");
    assert.equal(await evaluate("document.querySelector('#tasks-body tr td').textContent"), 'T003');
    console.log('PASS: language/difficulty/micro filters, search, sorting, validation, editing, reset');

    const { root: doc } = await send('DOM.getDocument');
    const { nodeId } = await send('DOM.querySelector', { nodeId: doc.nodeId, selector: '#file-input' });
    await send('DOM.setFileInputFiles', { nodeId, files: [path.join(root, 'chosen_tasks(1).xlsx')] });
    await waitFor("!document.getElementById('import-button').disabled && document.getElementById('toast').textContent.includes('Imported 80')");
    await evaluate("location.hash='method'");
    await waitFor("!document.getElementById('view-method').hidden");
    assert.equal(await evaluate("document.querySelectorAll('#report-check .check-diff').length"), 0);
    assert.equal(await evaluate("document.querySelectorAll('#report-check .check-ok').length"), 15);
    const rejected = await evaluate("readWorkbook(new File(['invalid'],'bad.xlsx')).then(()=>false,()=>true)");
    assert.equal(rejected, true);
    console.log('PASS: file input import, malformed XLSX rejection and all PDF cross-checks');

    const downloadPath = fs.mkdtempSync('/tmp/rmt-metrics-downloads-');
    await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath });
    await evaluate("document.getElementById('export').click()");
    const csvPath = path.join(downloadPath, 'llm-metrics-macro-all.csv');
    const deadline = Date.now() + 6000;
    while (!fs.existsSync(csvPath) && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 100));
    assert.ok(fs.existsSync(csvPath), 'CSV download');
    const csv = fs.readFileSync(csvPath, 'utf8');
    const rate = Number(/"5.6-Sol";"([\d.]+)"/.exec(csv)?.[1]);
    assert.ok(Math.abs(rate - 83.68688081264581) < 1e-8); assert.ok(csv.includes('T080')); assert.ok(csv.includes('5/?'));
    console.log('PASS: CSV download contains calculated metrics and all source tasks');

    for (const width of [320, 390, 768, 1024, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
      for (const view of ['overview', 'data', 'method']) {
        await evaluate(`location.hash='${view}'`);
        await waitFor(`!document.getElementById('view-${view}').hidden`);
        assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, `${view}: page overflow at ${width}px`);
      }
    }
    await evaluate("location.hash='overview';document.getElementById('toast').hidden=true");
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await waitFor("!document.getElementById('view-overview').hidden");
    assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true);
    const mobile = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync('/tmp/rmt-metrics-mobile.png', Buffer.from(mobile.data, 'base64'));
    console.log('PASS: all three sections fit 320, 390, 768, 1024 and 1440px widths');
    assert.deepEqual(errors, []);
    console.log('PASS: no runtime exceptions');
  } finally { socket.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
