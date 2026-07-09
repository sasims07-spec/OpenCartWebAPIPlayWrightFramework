# Screenshots

Drop your report screenshots into this folder using these exact filenames so the main [README](../../README.md) picks them up:

| File | What to capture | How to capture |
| --- | --- | --- |
| `playwright-report.png` | Playwright HTML report — overview page | `npm test` then `npx playwright show-report reports/my-html-report` |
| `allure-report.png` | Allure report — dashboard/overview page | `npm run allure:report` |
| `allure-trends.png` | Allure trend graph (pass/fail history) | Open the live GitHub Pages URL after at least 2 pipeline runs |

**Tips:**

- Use PNG (transparent background preferred for the trend graph).
- Recommended width: **1200–1600 px** — big enough to read text, small enough to load fast on GitHub.
- Crop to just the useful content (no browser chrome, no OS taskbar).
- Windows: `Win + Shift + S` → save as PNG. macOS: `Cmd + Shift + 4`.
