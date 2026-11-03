# Prompt / Lens

A local research dashboard for Research Methods & Tools. Open `index.html` in a modern browser. No server, package installation or internet connection is required.

## Files

- `index.html`, `style.css`, `script.js` — interface and metric calculations.
- `data.js` — a snapshot of all 80 tasks from `chosen_tasks(1).xlsx`; keep it alongside the other application files.
- `tools/extract_data.py` — regenerates the Excel snapshot using the Python standard library.
- `tests/metrics.test.cjs` — checks calculations, PDF reference values and incomplete data handling.
- `tests/browser-smoke.cjs` — browser checks for imports, editing, exports and responsive layouts.

## Working with data

**Import Excel** reads `.xlsx` files directly in the browser. It supports the original chosen_tasks column layout: A — Difficulty, B — Task Name, C — Link, D–F — Sol results (KZ, EN, Mix), G–I — Sonnet results, J — Task ID. Result column headers must match the original spreadsheet. Import does not execute formulas or send data anywhere. Password-protected workbooks are not supported. Limits: 25 MB per file and 100 MB after decompression.

In the **Data** tab, select a task to inspect or edit its fractions. Edits stay in page memory until reload. CSV export contains selection settings, calculated metrics and current results; it is a report rather than a reimport format. In the Data tab, export follows search and status filters. In other sections, export includes the entire selection by platform and difficulty. Use the print button to save the current section as a PDF.

Original worksheet names are preserved as source metadata, including the name `Лист1` in the supplied workbook.

If the Excel file changes on disk, import it using the button or update the built-in snapshot:

```bash
python tools/extract_data.py
```

## Method

The default mode calculates `100 × mean(passed / total)` across tasks and selected languages. The alternative Micro mode calculates `100 × sum(passed) / sum(total)`. A complete task has six valid results; incomplete tasks are excluded from both models regardless of the selected language. `0/25` is a valid zero result; `5/?` is an unknown observation.

Excel stored 296 fractions as date serials using the `d/m` format. These are restored as day/month: `46084 → 3/3`, `46361 → 5/12`. This interprets displayed spreadsheet values; it does not guarantee the original input before Excel date conversion. Raw values and cell coordinates are available in task details. Arbitrary numeric cells are not automatically treated as percentages.

Restoration yields 78 complete tasks (T070 and T078 are excluded): **83.6868808% / 95.2001093%**, with a difference of **11.5132285 percentage points**. The main values and counts reproduce the supplied PDF. PDF reference values appear only in the comparison section and do not enter the calculations. Statistical significance, causal effects, pass@k and success probabilities for new tasks are not estimated.

Checks:

```bash
node --test tests/metrics.test.cjs
node --check script.js
```

For browser integration checks, start headless Chrome with `--remote-debugging-port=9222` and a temporary profile, then run:

```bash
node tests/browser-smoke.cjs
```
