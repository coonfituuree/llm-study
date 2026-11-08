# Prompt / Lens

A React + TypeScript research dashboard built with Vite, Material UI and MUI X Charts. The interface is in English and uses the standard Material UI light palette: blue primary, purple secondary and the default semantic status colors. Roboto fonts are bundled locally.

## Run locally

From this directory:

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite. The application lives in `metrics/`; the HTML files in the repository root are the earlier static version.

Other commands:

```bash
pnpm build     # TypeScript compilation and production build
pnpm preview   # Serve the production build
pnpm format    # Format source files
```

## Architecture

```text
src/
  app/                # Application composition, lazy page loading and MUI theme
  components/
    common/           # Shared metric cards, panels, legends and comparison table
    layout/           # Responsive MUI navigation, header and page shell
  data/               # Typed initial dataset and the original 80-task JSON snapshot
  domain/study/       # Data types, fraction parsing, calculations and selectors
  features/study/     # Reducer, provider, context hook, filters and task editor
  hooks/              # Hash-based page navigation
  pages/              # Overview, Data and Methodology screens
  services/           # Browser-local XLSX import and CSV export
```

The domain calculations do not depend on React or Material UI. Shared study state is managed with a reducer and context. Search, sorting and pagination stay local to the Data page. Overview charts are loaded with their page rather than bundled into every screen. Views support direct links through `#overview`, `#data` and `#method`.

## Data and features

The initial snapshot contains all 80 tasks from `chosen_tasks(1).xlsx`. Use **Import Excel** to recalculate from an updated workbook. The expected A–J layout is: Difficulty, Task Name, Link, six results (Sol KZ/EN/Mix and Sonnet KZ/EN/Mix), and Task ID. Original worksheet names and source cell coordinates are preserved.

The Overview page shows model pass rates, per-language and difficulty charts, task wins, outcome distributions, platform and rating breakdowns, largest differences, Mix gaps and a full metrics summary.

The Data page supports search, inclusion status, sorting and Material UI pagination. Select a task to inspect or edit its six result fractions. Edits last until reload. **Export selection** exports all tasks matching the platform and difficulty filters. **Export matching rows** in the Data page also applies its search and status filters, across every page.

The Methodology page documents calculations and data exclusions, and compares the current full dataset against the supplied PDF. The print action saves the current view through the browser print dialog.

XLSX import and CSV export run locally in the browser. There is no backend or CDN dependency. Password-protected workbooks are not supported. Import limits are 25 MB per file and 100 MB uncompressed.

## Calculation rules

- **Macro:** `100 × mean(passed / total)` with equal weight per task and selected language.
- **Micro:** `100 × sum(passed) / sum(total)`, weighted by test count.
- A task requires six valid fractions to enter the paired cohort, even when one language is selected.
- `0/25` is a valid zero; `5/?` is unknown and excludes the entire task from both models.
- Task wins compare per-task means across the selected languages in both aggregation modes.
- Differences are measured in percentage points. Rounding happens only for display.

The original Excel file stored 296 fractions as date serials with the `d/m` format. Import restores them as day/month (`46084 → 3/3`, `46361 → 5/12`) and preserves the raw values in task details. This recovers displayed values; the input before Excel date conversion is unknown.

The initial dataset has 78 complete tasks: T070 and T078 are excluded. Its Macro results round to **83.7%** for 5.6-Sol and **95.2%** for Sonnet-5.5, with **+11.5 pp** difference. PDF references do not enter the metric calculations. Statistical significance, causal language effects, pass@k and probabilities for new tasks are not estimated.
