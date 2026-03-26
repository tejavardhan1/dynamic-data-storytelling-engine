# Dynamic Data Storytelling Engine

A browser-based data quality copilot for profiling uploaded files, explaining what is missing or wrong, recommending what would improve accuracy, and asking before cleaning.

## What it does

- Accepts structured text, JSON-style data, PDFs, images, and Word documents
- Infers schema instead of expecting fixed column names
- Profiles missing values, placeholders, duplicates, type issues, and suspicious rows
- Explains what should be added or fixed to improve accuracy
- Offers previewable, reversible, consent-based cleaning
- Shows cleaned rows inside the prototype and lets the user download the cleaned JSON

## Supported formats

- `csv`
- `tsv`
- `txt`
- `json`
- `jsonl`
- `ndjson`
- `psv`
- `pdf`
- `docx`
- common image files such as `png`, `jpg`, `jpeg`, `webp`, `gif`, `bmp`, and `tiff`
- other delimited text formats using `,`, `;`, tab, or `|`

## Run locally

```bash
cd "/Users/tejavardhanreddygondi/Documents/New project"
npm run dev
```

Then open `http://localhost:4173`.

If port `4173` is busy, run:

```bash
PORT=4174 npm run dev
```

## Files

- `index.html`: app layout and UX flow
- `styles.css`: visual system and responsive design
- `script.js`: parsing, profiling, issue detection, document extraction, recommendations, and cleaning flow
- `package.json`: local dev server scripts

## Cleaning behavior

The cleaner is intentionally conservative. It can:

- trim whitespace
- normalize blank markers
- standardize low-cardinality text values
- parse values into cleaner numeric, date, or boolean types
- remove exact duplicate rows

It does not invent missing business values.

## Document inputs

For PDFs, images, and `.docx` files, the app extracts text in the browser and
then profiles the extracted content. This means quality findings may reflect
both the source data and the extraction process.

The browser uses:

- PDF.js for PDF text extraction
- Mammoth for `.docx` text extraction
- Tesseract.js for OCR on images
