'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { parseFraction, metrics, taskRate, mixGap, isComplete } = require('../script.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../data.js'), 'utf8'), context);
const tasks = JSON.parse(JSON.stringify(context.window.STUDY_DATA.tasks));
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
const fixture = (id, values) => ({ id, results: values.map(value => ({ value })) });

test('workbook snapshot: 80 unique tasks, 296 restored fractions', () => {
  assert.equal(tasks.length, 80);
  assert.equal(new Set(tasks.map(t => t.id)).size, 80);
  assert.equal(tasks.flatMap(t => t.results).filter(c => c.recovered).length, 296);
  assert.deepEqual(tasks.find(t => t.id === 'T059').results.map(c => c.value), ['5/12', '8/12', '3/12', '11/12', '12/12', '10/12']);
  assert.deepEqual(tasks.find(t => t.id === 'T063').results.map(c => c.value), ['2/3', '3/3', '2/3', '3/3', '3/3', '3/3']);
});
test('PDF baseline reproduced without hardcoded calculation totals', () => {
  const result = metrics(tasks);
  assert.equal(result.n, 78);
  assert.deepEqual(result.excluded.map(t => t.id), ['T070', 'T078']);
  near(result.models[0].rate, 83.68688081264581);
  near(result.models[1].rate, 95.20010932220234);
  near(result.delta, 11.51322850955652);
  assert.deepEqual(result.wins, { sonnet: 23, equal: 53, sol: 2 });
  assert.deepEqual(result.models.map(m => [m.fullTasks, m.anyFullTasks, m.partial, m.zero, m.full, m.cells]), [[53, 56, 61, 10, 163, 234], [57, 71, 38, 6, 190, 234]]);
});
test('all six language means match source report', () => {
  const expected = [[82.9938835361112, 95.59605446233353], [87.69069662827313, 98.32905982905983], [80.37606227355309, 91.67521367521367]];
  expected.forEach((values, language) => metrics(tasks, [language]).models.forEach((model, i) => near(model.rate, values[i])));
});
test('difficulty and platform cohorts preserve report counts', () => {
  for (const [key, values] of [['difficulty', { Easy: 20, Medium: 20, Hard: 38 }], ['platform', { LeetCode: 40, Codeforces: 38 }]]) {
    for (const [value, n] of Object.entries(values)) assert.equal(metrics(tasks.filter(t => t[key] === value)).n, n);
  }
  assert.deepEqual(metrics(tasks.filter(t => t.difficulty === 'Medium')).models.map(m => m.rate), [100, 100]);
});
test('macro gives tasks equal weight; micro uses actual test counts', () => {
  const rows = [fixture('A', ['1/1', '1/1', '1/1', '1/1', '1/1', '1/1']), fixture('B', ['0/100', '0/100', '0/100', '0/100', '0/100', '0/100'])];
  near(metrics(rows).models[0].rate, 50);
  near(metrics(rows, [0, 1, 2], 'micro').models[0].rate, 100 / 101);
  near(metrics(rows, [1], 'micro').models[0].rate, 100 / 101);
});
test('valid zero is distinct from unknown denominator and malformed values', () => {
  assert.equal(parseFraction('0/25').rate, 0);
  assert.equal(parseFraction(' 18 / 20 ').rate, .9);
  assert.equal(parseFraction('5/?').unknown, true);
  for (const value of ['', '12/0', '4/3', '46084', '-1/20', '1.5/20', 'x/20', '9007199254740992/9007199254740992']) assert.equal(parseFraction(value).valid, false, value);
});
test('incomplete task excluded from both models even for other language filters', () => {
  const task = fixture('A', ['1/1', '1/1', '1/?', '1/1', '1/1', '1/1']);
  assert.equal(isComplete(task), false);
  const result = metrics([task], [0]);
  assert.equal(result.n, 0);
  assert.deepEqual(result.models.map(m => m.rate), [null, null]);
  assert.equal(result.delta, null);
});
test('empty filters return absent rates instead of fabricated zeros', () => {
  const result = metrics([]);
  assert.equal(result.n, 0);
  assert.equal(result.models[0].partialRate, null);
  assert.equal(result.models[0].fullTasks, 0);
});
test('manual update changes computed metrics and can restore incomplete tasks', () => {
  const updated = structuredClone(tasks);
  updated.find(t => t.id === 'T070').results = Array.from({ length: 6 }, () => ({ value: '1/1' }));
  assert.equal(metrics(updated).n, 79);
  assert.ok(metrics(updated).models[0].rate > metrics(tasks).models[0].rate);
});
test('mix gap and task deltas reproduce largest examples from PDF', () => {
  near(mixGap(tasks.find(t => t.id === 'T072')), -72);
  near(mixGap(tasks.find(t => t.id === 'T011')), -50);
  const task = tasks.find(t => t.id === 'T003');
  near(taskRate(task, 1) - taskRate(task, 0), 100);
  assert.equal(mixGap(tasks.find(t => t.id === 'T070')), null);
});
