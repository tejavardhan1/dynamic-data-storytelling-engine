document.body.classList.add("js-enhanced");

const SAMPLE_JSON = `[
  {
    "Ticket ID": "T-1001",
    "Created At": "2026-02-01",
    "Team": "Support",
    "Priority": "High",
    "Resolution Hours": "4.5",
    "CSAT": "92",
    "Region": "North America",
    "Channel": "Email",
    "Owner": { "name": "Leah", "shift": "AM" }
  },
  {
    "Ticket ID": "T-1002",
    "Created At": "2026/02/02",
    "Team": "support ",
    "Priority": "high",
    "Resolution Hours": "5.2",
    "CSAT": "N/A",
    "Region": "North America",
    "Channel": "Chat",
    "Owner": { "name": "Leah", "shift": "AM" }
  },
  {
    "Ticket ID": "T-1003",
    "Created At": "02-03-2026",
    "Team": "Success",
    "Priority": "Medium",
    "Resolution Hours": "",
    "CSAT": "89",
    "Region": "EMEA",
    "Channel": "Phone",
    "Owner": { "name": "Arjun", "shift": "PM" }
  },
  {
    "Ticket ID": "T-1004",
    "Created At": "2026-02-05",
    "Team": "Success",
    "Priority": "Medium",
    "Resolution Hours": "48",
    "CSAT": "47",
    "Region": "EMEA",
    "Channel": "Phone",
    "Owner": { "name": "Arjun", "shift": "PM" }
  },
  {
    "Ticket ID": "T-1005",
    "Created At": "unknown",
    "Team": "Sales",
    "Priority": "Low",
    "Resolution Hours": "7.1",
    "CSAT": "91",
    "Region": "APAC",
    "Channel": "Email",
    "Owner": { "name": "Mina", "shift": "AM" }
  },
  {
    "Ticket ID": "T-1006",
    "Created At": "2026-02-08",
    "Team": "Sales",
    "Priority": "",
    "Resolution Hours": "6.8 hrs",
    "CSAT": "88",
    "Region": "APAC",
    "Channel": "Email",
    "Owner": { "name": "Mina", "shift": "AM" }
  },
  {
    "Ticket ID": "T-1006",
    "Created At": "2026-02-08",
    "Team": "Sales",
    "Priority": "",
    "Resolution Hours": "6.8 hrs",
    "CSAT": "88",
    "Region": "APAC",
    "Channel": "Email",
    "Owner": { "name": "Mina", "shift": "AM" }
  },
  {
    "Ticket ID": "T-1008",
    "Created At": "2026-02-09",
    "Team": "Support",
    "Priority": "urgent",
    "Resolution Hours": "5,5",
    "CSAT": "93",
    "Region": "North America",
    "Channel": "Chat",
    "Owner": { "name": "Leah", "shift": "PM" }
  },
  {
    "Ticket ID": "T-1009",
    "Created At": "2026-02-10",
    "Team": "Support",
    "Priority": "High",
    "Resolution Hours": "500",
    "CSAT": "95",
    "Region": "North America",
    "Channel": "Chat",
    "Owner": { "name": "Leah", "shift": "PM" }
  },
  {
    "Ticket ID": "T-1010",
    "Created At": "2026-02-11",
    "Team": null,
    "Priority": "Medium",
    "Resolution Hours": "4.8",
    "CSAT": "90",
    "Region": "EMEA",
    "Channel": "Chat",
    "Owner": { "name": "Iris", "shift": "PM" }
  }
]`;

const PDF_WORKER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const MISSING_MARKERS = new Set(["", "na", "n/a", "null", "none", "nil", "-", "--"]);
const PLACEHOLDER_MARKERS = new Set(["unknown", "tbd", "pending", "?", "not provided"]);
const BOOLEAN_TRUE = new Set(["true", "yes", "y"]);
const BOOLEAN_FALSE = new Set(["false", "no", "n"]);
const MONTH_ORDER = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tif", ".tiff"];
const WORD_EXTENSIONS = [".docx", ".doc"];
const numberFormatter = new Intl.NumberFormat("en-US");

const elements = {
  uploadTrigger: document.querySelector("#uploadTrigger"),
  loadSample: document.querySelector("#loadSample"),
  datasetFile: document.querySelector("#datasetFile"),
  dropzone: document.querySelector("#dropzone"),
  fileName: document.querySelector("#fileName"),
  uploadHint: document.querySelector("#uploadHint"),
  rawRowsChip: document.querySelector("#rawRowsChip"),
  rawColumnsChip: document.querySelector("#rawColumnsChip"),
  formatChip: document.querySelector("#formatChip"),
  previewCleaning: document.querySelector("#previewCleaning"),
  applyCleaning: document.querySelector("#applyCleaning"),
  revertOriginal: document.querySelector("#revertOriginal"),
  quickClean: document.querySelector("#quickClean"),
  downloadCleaned: document.querySelector("#downloadCleaned"),
  cleanModeBadge: document.querySelector("#cleanModeBadge"),
  cleanPromptCopy: document.querySelector("#cleanPromptCopy"),
  cleaningSummary: document.querySelector("#cleaningSummary"),
  cleaningActionList: document.querySelector("#cleaningActionList"),
  cleaningDelta: document.querySelector("#cleaningDelta"),
  metricRows: document.querySelector("#metricRows"),
  metricColumns: document.querySelector("#metricColumns"),
  metricCompleteness: document.querySelector("#metricCompleteness"),
  metricHealth: document.querySelector("#metricHealth"),
  statFormat: document.querySelector("#statFormat"),
  statFormatDetail: document.querySelector("#statFormatDetail"),
  statDuplicates: document.querySelector("#statDuplicates"),
  statDuplicatesDetail: document.querySelector("#statDuplicatesDetail"),
  statMissing: document.querySelector("#statMissing"),
  statMissingDetail: document.querySelector("#statMissingDetail"),
  statProblemRows: document.querySelector("#statProblemRows"),
  statProblemRowsDetail: document.querySelector("#statProblemRowsDetail"),
  columnHealthChip: document.querySelector("#columnHealthChip"),
  completenessChart: document.querySelector("#completenessChart"),
  qualityHeadline: document.querySelector("#qualityHeadline"),
  qualityLead: document.querySelector("#qualityLead"),
  recommendationList: document.querySelector("#recommendationList"),
  issueChip: document.querySelector("#issueChip"),
  issueList: document.querySelector("#issueList"),
  issueActionHint: document.querySelector("#issueActionHint"),
  problemRowChip: document.querySelector("#problemRowChip"),
  problemRowList: document.querySelector("#problemRowList"),
  schemaChip: document.querySelector("#schemaChip"),
  columnGrid: document.querySelector("#columnGrid"),
  dataPreviewChip: document.querySelector("#dataPreviewChip"),
  dataPreviewSummary: document.querySelector("#dataPreviewSummary"),
  dataTableHead: document.querySelector("#dataTableHead"),
  dataTableBody: document.querySelector("#dataTableBody"),
  datasetTag: document.querySelector("#datasetTag"),
  monitorState: document.querySelector("#monitorState"),
  heroPrompt: document.querySelector("#heroPrompt"),
  heroStatus: document.querySelector("#heroStatus"),
  heroRows: document.querySelector("#heroRows"),
  heroColumns: document.querySelector("#heroColumns"),
  heroIssues: document.querySelector("#heroIssues"),
  heroHealth: document.querySelector("#heroHealth"),
  revealables: document.querySelectorAll("[data-reveal]")
};

const appState = {
  datasetName: "sample-ops.json",
  format: "json",
  parseMeta: null,
  sourceRows: [],
  originalProfile: null,
  cleanedRows: [],
  cleanedProfile: null,
  cleaningPlan: null,
  viewMode: "original",
  monitorTimer: null
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function formatCount(value) {
  return numberFormatter.format(Math.round(value));
}

function getCurrentRows() {
  return appState.viewMode === "original" ? appState.sourceRows : appState.cleanedRows;
}

function normalizeHeaderKey(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function humanizeKey(value) {
  return String(value)
    .replace(/[_\.]+/g, " ")
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function sanitizeFilenameBase(value) {
  return String(value || "dataset")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "dataset";
}

function titleCase(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function safeStringify(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeCellValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
}

function classifyValue(value) {
  const normalized = normalizeCellValue(value);

  if (normalized === null) {
    return { kind: "missing", normalized: null };
  }

  const text = String(normalized).trim();
  const lower = text.toLowerCase();

  if (MISSING_MARKERS.has(lower)) {
    return { kind: "missing", normalized: null };
  }

  if (PLACEHOLDER_MARKERS.has(lower)) {
    return { kind: "placeholder", normalized: text };
  }

  return { kind: "usable", normalized };
}

function parseNumeric(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  let text = value.trim().toLowerCase();

  if (!text) {
    return null;
  }

  text = text.replace(/[%$£€]/g, "");
  text = text.replace(/\s+/g, "");
  text = text.replace(/[a-z]+$/g, "");

  if (!text) {
    return null;
  }

  if (text.includes(",") && text.includes(".")) {
    text = text.replace(/,/g, "");
  } else if ((text.match(/,/g) || []).length === 1 && !text.includes(".")) {
    const [left, right] = text.split(",");

    if (right.length > 0 && right.length <= 2) {
      text = `${left}.${right}`;
    } else {
      text = text.replace(/,/g, "");
    }
  } else {
    text = text.replace(/,/g, "");
  }

  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : null;
}

function parseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();

    if (BOOLEAN_TRUE.has(lower)) {
      return true;
    }

    if (BOOLEAN_FALSE.has(lower)) {
      return false;
    }
  }

  return null;
}

function parseDateValue(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed) {
    return null;
  }

  const dateLike =
    /[-/]/.test(trimmed) ||
    MONTH_ORDER.some((month) => lower.includes(month)) ||
    /\d{4}-\d{2}-\d{2}/.test(trimmed);

  if (!dateLike) {
    return null;
  }

  const timestamp = Date.parse(trimmed);

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return new Date(timestamp).toISOString().slice(0, 10);
}

function countDelimiter(line, delimiter) {
  let count = 0;
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];

    if (character === '"') {
      if (inQuotes && next === '"') {
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === delimiter && !inQuotes) {
      count += 1;
    }
  }

  return count;
}

function detectDelimiter(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  const delimiters = [",", "\t", ";", "|"];
  let bestDelimiter = ",";
  let bestScore = -1;

  delimiters.forEach((delimiter) => {
    const counts = lines.map((line) => countDelimiter(line, delimiter)).filter((count) => count > 0);

    if (!counts.length) {
      return;
    }

    const average = counts.reduce((sum, count) => sum + count, 0) / counts.length;
    const spread = Math.max(...counts) - Math.min(...counts);
    const score = average - spread * 0.35 + counts.length * 0.2;

    if (score > bestScore) {
      bestScore = score;
      bestDelimiter = delimiter;
    }
  });

  return bestDelimiter;
}

function splitDelimitedRows(text, delimiter) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];

    if (character === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === delimiter && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && next === "\n") {
        index += 1;
      }

      row.push(value);
      value = "";

      if (row.some((cell) => String(cell).trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    value += character;
  }

  if (value !== "" || row.length > 0) {
    row.push(value);
    if (row.some((cell) => String(cell).trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function rowLooksLikeHeader(cells) {
  const normalized = cells.map((cell) => String(cell).trim()).filter(Boolean);

  if (normalized.length < 2) {
    return false;
  }

  const numericLike = normalized.filter((value) => parseNumeric(value) !== null).length;
  const unique = new Set(normalized.map((value) => normalizeHeaderKey(value)));

  return numericLike <= normalized.length * 0.3 && unique.size === normalized.length;
}

function dedupeHeaders(headers) {
  const counts = new Map();
  let duplicateCount = 0;

  return {
    headers: headers.map((header, index) => {
      const base = normalizeHeaderKey(header) || `column_${index + 1}`;
      const nextCount = (counts.get(base) ?? 0) + 1;
      counts.set(base, nextCount);

      if (nextCount > 1) {
        duplicateCount += 1;
        return `${base}_${nextCount}`;
      }

      return base;
    }),
    duplicateCount
  };
}

function flattenObject(value, prefix = "", output = {}) {
  if (Array.isArray(value)) {
    output[prefix || "value"] = value.map((item) => safeStringify(item)).join(" | ");
    return output;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => {
      const nextKey = prefix ? `${prefix}.${normalizeHeaderKey(key)}` : normalizeHeaderKey(key);
      flattenObject(child, nextKey, output);
    });
    return output;
  }

  output[prefix || "value"] = value;
  return output;
}

function parseDelimitedDataset(text) {
  let source = text.replace(/^\uFEFF/, "");
  const separatorMatch = source.match(/^\s*sep=(.)\s*(?:\r?\n)/i);
  let delimiter = null;

  if (separatorMatch) {
    delimiter = separatorMatch[1];
    source = source.replace(/^\s*sep=(.)\s*(?:\r?\n)/i, "");
  }

  const resolvedDelimiter = delimiter ?? detectDelimiter(source);
  const rows = splitDelimitedRows(source, resolvedDelimiter);

  if (!rows.length) {
    throw new Error("The data file does not contain any rows.");
  }

  const headerDetected = rowLooksLikeHeader(rows[0]);
  const rawHeaders = headerDetected ? rows[0] : rows[0].map((_, index) => `column_${index + 1}`);
  const { headers, duplicateCount } = dedupeHeaders(rawHeaders);
  const dataRows = headerDetected ? rows.slice(1) : rows;

  if (!dataRows.length) {
    throw new Error("The data file needs at least one data row.");
  }

  return {
    rows: dataRows.map((cells) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = cells[index] ?? "";
      });
      return record;
    }),
    meta: {
      format:
        resolvedDelimiter === ","
          ? "csv"
          : resolvedDelimiter === "\t"
            ? "tsv"
            : resolvedDelimiter === "|"
              ? "psv"
              : resolvedDelimiter === ";"
                ? "semicolon"
                : "delimited",
      headerDetected,
      duplicateHeaders: duplicateCount,
      inputKind: "tabular",
      extractionMethod: "direct"
    }
  };
}

function parseJsonLines(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows = lines.map((line) => JSON.parse(line));
  return rows.map((row) => flattenObject(row));
}

function parseJsonDataset(text) {
  const trimmed = text.trim();

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      if (!parsed.length) {
        throw new Error("The JSON array is empty.");
      }

      if (Array.isArray(parsed[0])) {
        const rows = parsed.map((row) => row.map((cell) => safeStringify(cell)));
        const headerDetected = rowLooksLikeHeader(rows[0]);
        const rawHeaders = headerDetected ? rows[0] : rows[0].map((_, index) => `column_${index + 1}`);
        const { headers, duplicateCount } = dedupeHeaders(rawHeaders);
        const dataRows = headerDetected ? rows.slice(1) : rows;

        return {
          rows: dataRows.map((cells) => {
            const record = {};
            headers.forEach((header, index) => {
              record[header] = cells[index] ?? "";
            });
            return record;
          }),
          meta: {
            format: "json",
            headerDetected,
            duplicateHeaders: duplicateCount,
            inputKind: "tabular",
            extractionMethod: "direct"
          }
        };
      }

      return {
        rows: parsed.map((row) => flattenObject(row)),
        meta: {
          format: "json",
          headerDetected: true,
          duplicateHeaders: 0,
          inputKind: "tabular",
          extractionMethod: "direct"
        }
      };
    }

    return {
      rows: [flattenObject(parsed)],
      meta: {
        format: "json",
        headerDetected: true,
        duplicateHeaders: 0,
        inputKind: "tabular",
        extractionMethod: "direct"
      }
    };
  } catch (error) {
    try {
      return {
        rows: parseJsonLines(trimmed),
        meta: {
          format: "jsonl",
          headerDetected: true,
          duplicateHeaders: 0,
          inputKind: "tabular",
          extractionMethod: "direct"
        }
      };
    } catch {
      throw new Error(error.message === "Unexpected end of JSON input" ? "The JSON file could not be parsed." : error.message);
    }
  }
}

function parseTextDataset(text, datasetName = "") {
  const trimmed = text.trim();
  const lowerName = datasetName.toLowerCase();

  if (!trimmed) {
    throw new Error("The selected file is empty.");
  }

  if (
    lowerName.endsWith(".json") ||
    lowerName.endsWith(".jsonl") ||
    lowerName.endsWith(".ndjson") ||
    trimmed.startsWith("[") ||
    trimmed.startsWith("{")
  ) {
    return parseJsonDataset(trimmed);
  }

  return parseDelimitedDataset(trimmed);
}

function countWords(text) {
  return String(text)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function guessTextLooksStructured(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);

  if (lines.length < 2) {
    return false;
  }

  const delimiter = detectDelimiter(lines.join("\n"));
  const delimiterRich = lines.filter((line) => countDelimiter(line, delimiter) >= 1).length;
  const keyValueRich = lines.filter((line) => /^[^:]{1,60}:\s*.+$/.test(line)).length;

  return delimiterRich >= Math.max(3, Math.floor(lines.length * 0.45)) || keyValueRich >= Math.max(3, Math.floor(lines.length * 0.5));
}

function parseKeyValueBlocks(text) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const records = blocks
    .map((block) => {
      const record = {};
      let matches = 0;

      block.split(/\r?\n/).forEach((line) => {
        const result = line.match(/^([^:]{1,60}):\s*(.+)$/);
        if (!result) {
          return;
        }

        matches += 1;
        record[normalizeHeaderKey(result[1])] = result[2].trim();
      });

      return matches >= 2 ? record : null;
    })
    .filter(Boolean);

  return records.length >= 2 ? records : null;
}

function buildTextBlockRecords(text) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const sourceBlocks = blocks.length >= 2 ? blocks : text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  return sourceBlocks.map((block) => ({
    content: block,
    word_count: countWords(block),
    char_count: block.length,
    contains_number: /\d/.test(block) ? "yes" : "no",
    contains_date_like: parseDateValue(block) ? "yes" : "no"
  }));
}

function buildRecordsFromDocumentText(text, baseMeta) {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error("No usable text could be extracted from this file.");
  }

  if (guessTextLooksStructured(trimmed)) {
    try {
      const parsed = parseTextDataset(trimmed, "");
      return {
        rows: parsed.rows,
        meta: {
          ...parsed.meta,
          inputKind: "document",
          sourceType: baseMeta.sourceType,
          extractionMethod: baseMeta.extractionMethod,
          ocrConfidence: baseMeta.ocrConfidence ?? null,
          sourcePages: baseMeta.sourcePages ?? null,
          structuredGuess: true
        }
      };
    } catch {
      const keyValueRows = parseKeyValueBlocks(trimmed);
      if (keyValueRows) {
        return {
          rows: keyValueRows,
          meta: {
            format: `${baseMeta.format}-keyvalue`,
            headerDetected: true,
            duplicateHeaders: 0,
            inputKind: "document",
            sourceType: baseMeta.sourceType,
            extractionMethod: baseMeta.extractionMethod,
            ocrConfidence: baseMeta.ocrConfidence ?? null,
            sourcePages: baseMeta.sourcePages ?? null,
            structuredGuess: true
          }
        };
      }
    }
  }

  return {
    rows: buildTextBlockRecords(trimmed),
    meta: {
      format: baseMeta.format,
      headerDetected: true,
      duplicateHeaders: 0,
      inputKind: "document",
      sourceType: baseMeta.sourceType,
      extractionMethod: baseMeta.extractionMethod,
      ocrConfidence: baseMeta.ocrConfidence ?? null,
      sourcePages: baseMeta.sourcePages ?? null,
      structuredGuess: false
    }
  };
}

function normalizeRows(records) {
  const flattened = records.map((record) => flattenObject(record));
  const columns = Array.from(
    flattened.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  return {
    columns,
    rows: flattened.map((row, index) => ({
      rowNumber: index + 1,
      values: columns.reduce((accumulator, column) => {
        accumulator[column] = row[column] ?? null;
        return accumulator;
      }, {})
    }))
  };
}

function median(values) {
  const numbers = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);

  if (!numbers.length) {
    return 0;
  }

  const middle = Math.floor(numbers.length / 2);
  return numbers.length % 2 === 0 ? (numbers[middle - 1] + numbers[middle]) / 2 : numbers[middle];
}

function computeIqrOutlierCount(values) {
  const numbers = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);

  if (numbers.length < 4) {
    return { count: 0, bounds: null };
  }

  const q1 = numbers[Math.floor(numbers.length * 0.25)];
  const q3 = numbers[Math.floor(numbers.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - iqr * 1.5;
  const upper = q3 + iqr * 1.5;

  return {
    count: numbers.filter((value) => value < lower || value > upper).length,
    bounds: { lower, upper }
  };
}

function inferColumnType(usableValues) {
  if (!usableValues.length) {
    return "empty";
  }

  const numericHits = usableValues.filter((value) => parseNumeric(value) !== null).length;
  const dateHits = usableValues.filter((value) => parseDateValue(value) !== null).length;
  const booleanHits = usableValues.filter((value) => parseBoolean(value) !== null).length;

  const numericRatio = numericHits / usableValues.length;
  const dateRatio = dateHits / usableValues.length;
  const booleanRatio = booleanHits / usableValues.length;
  const bestRatio = Math.max(numericRatio, dateRatio, booleanRatio);

  if (numericRatio >= 0.85) {
    return "numeric";
  }

  if (dateRatio >= 0.85) {
    return "date";
  }

  if (booleanRatio >= 0.9) {
    return "boolean";
  }

  if (bestRatio >= 0.35) {
    return "mixed";
  }

  return "text";
}

function makeIssue(severity, title, body) {
  return { severity, title, body };
}

function buildColumnProfiles(normalizedRows, columns) {
  const columnProfiles = [];

  columns.forEach((column) => {
    const rawValues = normalizedRows.map((row) => row.values[column]);
    const usableValues = [];
    const uniqueValues = new Set();
    const lowerCaseValues = new Set();
    const samples = [];
    let missingCount = 0;
    let placeholderCount = 0;
    let whitespaceIssues = 0;

    rawValues.forEach((value) => {
      if (typeof value === "string" && value !== value.trim()) {
        whitespaceIssues += 1;
      }

      const classification = classifyValue(value);

      if (classification.kind === "missing") {
        missingCount += 1;
        return;
      }

      if (classification.kind === "placeholder") {
        placeholderCount += 1;
        return;
      }

      usableValues.push(classification.normalized);
      uniqueValues.add(safeStringify(classification.normalized));

      if (typeof classification.normalized === "string") {
        lowerCaseValues.add(classification.normalized.toLowerCase());
      }

      if (samples.length < 3) {
        samples.push(safeStringify(classification.normalized));
      }
    });

    const inferredType = inferColumnType(usableValues);
    const numericValues = usableValues.map((value) => parseNumeric(value)).filter((value) => value !== null);
    const dateValues = usableValues.map((value) => parseDateValue(value)).filter((value) => value !== null);
    const booleanValues = usableValues.map((value) => parseBoolean(value)).filter((value) => value !== null);

    const invalidCount =
      inferredType === "numeric"
        ? usableValues.length - numericValues.length
        : inferredType === "date"
          ? usableValues.length - dateValues.length
          : inferredType === "boolean"
            ? usableValues.length - booleanValues.length
            : 0;

    const caseInconsistency =
      inferredType === "text" &&
      usableValues.length > 0 &&
      uniqueValues.size <= 20 &&
      lowerCaseValues.size < uniqueValues.size;

    const outlierInfo = inferredType === "numeric" ? computeIqrOutlierCount(numericValues) : { count: 0, bounds: null };
    const completeness = usableValues.length / Math.max(rawValues.length, 1);
    const issues = [];

    if (missingCount / Math.max(rawValues.length, 1) >= 0.4) {
      issues.push(
        makeIssue(
          "high",
          `${humanizeKey(column)} is heavily missing`,
          `${formatPercent((missingCount / rawValues.length) * 100)} of rows do not have a usable value in this column.`
        )
      );
    } else if (missingCount > 0) {
      issues.push(
        makeIssue(
          "medium",
          `${humanizeKey(column)} has gaps`,
          `${missingCount} rows are missing a usable value in this column.`
        )
      );
    }

    if (placeholderCount > 0) {
      issues.push(
        makeIssue(
          "medium",
          `${humanizeKey(column)} contains placeholders`,
          `${placeholderCount} values use low-information placeholders like unknown or TBD.`
        )
      );
    }

    if (inferredType === "mixed") {
      issues.push(
        makeIssue(
          "high",
          `${humanizeKey(column)} mixes data types`,
          "This column looks like a blend of numbers, dates, or text, which makes analysis less reliable."
        )
      );
    }

    if (invalidCount > 0) {
      issues.push(
        makeIssue(
          "high",
          `${humanizeKey(column)} has invalid ${inferredType} values`,
          `${invalidCount} entries do not match the inferred ${inferredType} format.`
        )
      );
    }

    if (whitespaceIssues > 0) {
      issues.push(
        makeIssue(
          "low",
          `${humanizeKey(column)} has whitespace inconsistencies`,
          `${whitespaceIssues} values have leading or trailing whitespace.`
        )
      );
    }

    if (caseInconsistency) {
      issues.push(
        makeIssue(
          "medium",
          `${humanizeKey(column)} has inconsistent capitalization`,
          "Similar category values appear with different letter casing, which can split aggregations."
        )
      );
    }

    if (outlierInfo.count > 0) {
      issues.push(
        makeIssue(
          outlierInfo.count >= 2 ? "high" : "medium",
          `${humanizeKey(column)} has suspicious outliers`,
          `${outlierInfo.count} value${outlierInfo.count === 1 ? "" : "s"} fall outside the usual numeric range.`
        )
      );
    }

    columnProfiles.push({
      key: column,
      label: humanizeKey(column),
      inferredType,
      rowCount: rawValues.length,
      usableCount: usableValues.length,
      missingCount,
      placeholderCount,
      completeness,
      uniqueCount: uniqueValues.size,
      whitespaceIssues,
      caseInconsistency,
      invalidCount,
      outlierCount: outlierInfo.count,
      numericMedian: numericValues.length ? median(numericValues) : null,
      numericMin: numericValues.length ? Math.min(...numericValues) : null,
      numericMax: numericValues.length ? Math.max(...numericValues) : null,
      samples,
      issues
    });
  });

  return columnProfiles;
}

function buildDuplicateMap(normalizedRows, columns) {
  const signatures = new Map();
  const duplicateRowNumbers = new Set();

  normalizedRows.forEach((row) => {
    const signature = JSON.stringify(
      columns.map((column) => {
        const classified = classifyValue(row.values[column]);
        return classified.kind === "usable"
          ? safeStringify(classified.normalized).toLowerCase()
          : classified.kind;
      })
    );

    const existing = signatures.get(signature);

    if (existing) {
      duplicateRowNumbers.add(existing);
      duplicateRowNumbers.add(row.rowNumber);
    } else {
      signatures.set(signature, row.rowNumber);
    }
  });

  return duplicateRowNumbers;
}

function buildProblemRows(normalizedRows, columnProfiles, duplicateRowNumbers) {
  const problemRows = [];

  normalizedRows.forEach((row) => {
    const reasons = [];
    let score = 0;

    if (duplicateRowNumbers.has(row.rowNumber)) {
      reasons.push("duplicate row");
      score += 3;
    }

    columnProfiles.forEach((profile) => {
      const classified = classifyValue(row.values[profile.key]);

      if (classified.kind === "missing") {
        reasons.push(`missing ${profile.label}`);
        score += 1.2;
        return;
      }

      if (classified.kind === "placeholder") {
        reasons.push(`placeholder in ${profile.label}`);
        score += 1;
        return;
      }

      if (profile.inferredType === "numeric" && parseNumeric(classified.normalized) === null) {
        reasons.push(`invalid number in ${profile.label}`);
        score += 2;
      }

      if (profile.inferredType === "date" && parseDateValue(classified.normalized) === null) {
        reasons.push(`invalid date in ${profile.label}`);
        score += 2;
      }

      if (profile.inferredType === "boolean" && parseBoolean(classified.normalized) === null) {
        reasons.push(`invalid boolean in ${profile.label}`);
        score += 1.5;
      }

      if (profile.inferredType === "numeric" && profile.outlierCount > 0) {
        const value = parseNumeric(classified.normalized);

        if (
          value !== null &&
          profile.numericMin !== null &&
          profile.numericMax !== null &&
          (value === profile.numericMin || value === profile.numericMax) &&
          Math.abs(profile.numericMax - profile.numericMin) > 0
        ) {
          reasons.push(`extreme value in ${profile.label}`);
          score += 1.5;
        }
      }
    });

    if (!reasons.length) {
      return;
    }

    const preview = Object.entries(row.values)
      .filter(([, value]) => classifyValue(value).kind === "usable")
      .slice(0, 3)
      .map(([key, value]) => `${humanizeKey(key)}: ${safeStringify(normalizeCellValue(value))}`)
      .join(" • ");

    problemRows.push({
      rowNumber: row.rowNumber,
      score,
      reasons: Array.from(new Set(reasons)).slice(0, 4),
      preview
    });
  });

  return problemRows.sort((left, right) => right.score - left.score).slice(0, 6);
}

function buildRecommendations(profile) {
  const recommendations = [];
  const highlyMissing = profile.columns
    .filter((column) => column.missingCount / Math.max(profile.rowsCount, 1) >= 0.25)
    .slice(0, 3);
  const mixedColumns = profile.columns.filter((column) => column.inferredType === "mixed");
  const invalidColumns = profile.columns.filter((column) => column.invalidCount > 0).slice(0, 3);
  const placeholderColumns = profile.columns.filter((column) => column.placeholderCount > 0).slice(0, 3);
  const hasUniqueId = profile.columns.some(
    (column) => column.usableCount > 0 && column.uniqueCount / Math.max(column.usableCount, 1) >= 0.95
  );
  const hasDateColumn = profile.columns.some((column) => column.inferredType === "date");

  if (profile.parseMeta.inputKind === "document") {
    if (!profile.parseMeta.structuredGuess) {
      recommendations.push(
        "If you want stronger accuracy, export this document as a machine-readable table or add more consistent headings and labels before analysis."
      );
    }

    if (profile.parseMeta.extractionMethod === "ocr") {
      recommendations.push(
        "Improve scan clarity, contrast, and resolution if OCR errors matter. Cleaner images lead to more reliable extraction."
      );
    }

    if (profile.parseMeta.sourceType === "word") {
      recommendations.push("Use .docx instead of legacy .doc when possible. Modern Word files preserve structure more reliably.");
    }
  }

  if (highlyMissing.length) {
    recommendations.push(
      `Add or recover values for ${highlyMissing.map((column) => column.label).join(", ")}. Those fields are sparse enough to weaken accuracy.`
    );
  }

  if (mixedColumns.length) {
    recommendations.push(
      `Standardize ${mixedColumns.map((column) => column.label).join(", ")} to a single data type before relying on automation or reporting.`
    );
  }

  if (invalidColumns.length) {
    recommendations.push(
      `Fix malformed entries in ${invalidColumns.map((column) => column.label).join(", ")} so those values can be trusted downstream.`
    );
  }

  if (placeholderColumns.length) {
    recommendations.push(
      `Replace low-information placeholders in ${placeholderColumns.map((column) => column.label).join(", ")} with real values where possible.`
    );
  }

  if (!hasUniqueId && profile.parseMeta.inputKind !== "document") {
    recommendations.push("Add a stable unique identifier column so duplicates and row-level changes can be tracked accurately.");
  }

  if (!hasDateColumn) {
    recommendations.push("Add a date or timestamp field if you want reliable trend analysis, freshness checks, or time-based monitoring.");
  }

  if (profile.rowsCount < 20) {
    recommendations.push("Collect more rows before drawing strong conclusions. Small samples make gaps and outliers look more important than they may be.");
  }

  if (!recommendations.length) {
    recommendations.push("The dataset is already in relatively strong shape. The biggest next step is adding a data dictionary or clearer business context.");
  }

  return Array.from(new Set(recommendations)).slice(0, 5);
}

function buildNarrative(profile, modeLabel) {
  const mostMissing = [...profile.columns].sort((left, right) => right.missingCount - left.missingCount)[0];
  const noisiest = [...profile.columns].sort((left, right) => right.issues.length - left.issues.length)[0];
  let headline = `${modeLabel} data still needs attention before it is fully trustworthy.`;
  let lead = `The engine profiled ${profile.rowsCount} rows across ${profile.columns.length} columns and found ${profile.issueCount} quality issues affecting completeness, consistency, or validity.`;

  if (profile.parseMeta.inputKind === "document") {
    headline = `${modeLabel} extracted content is readable, but structure quality still matters.`;
    lead =
      "The app extracted text from a document-style input, converted it into analyzable records, and then measured gaps, duplicates, and consistency risks in the extracted content.";

    if (!profile.parseMeta.structuredGuess) {
      lead += " Because the source was not strongly tabular, some recommendations focus on adding clearer structure before deeper analysis.";
    }

    if (profile.parseMeta.extractionMethod === "ocr" && profile.parseMeta.ocrConfidence !== null) {
      lead += ` OCR confidence is approximately ${Math.round(profile.parseMeta.ocrConfidence)}%.`;
    }
  }

  if (profile.healthScore >= 85) {
    headline = `${modeLabel} data looks strong enough for exploratory analysis.`;
    lead = `Most fields are usable, issue volume is controlled, and the remaining weak spots are concentrated in a small number of columns.`;
  } else if (profile.healthScore <= 55) {
    headline = `${modeLabel} data is at risk of producing unreliable analysis.`;
    lead = `Missing values, duplicates, or type inconsistencies are significant enough that the dataset should be reviewed before it drives decisions.`;
  }

  if (mostMissing && mostMissing.missingCount > 0 && noisiest) {
    lead += ` ${mostMissing.label} is the most incomplete field, while ${noisiest.label} shows the highest concentration of quality signals.`;
  }

  return { headline, lead };
}

function profileDataset(records, parseMeta) {
  const { rows: normalizedRows, columns } = normalizeRows(records);

  if (!normalizedRows.length || !columns.length) {
    throw new Error("The file was parsed, but no usable tabular structure was found.");
  }

  const columnProfiles = buildColumnProfiles(normalizedRows, columns);
  const duplicateRowNumbers = buildDuplicateMap(normalizedRows, columns);
  const problemRows = buildProblemRows(normalizedRows, columnProfiles, duplicateRowNumbers);
  const issues = [];

  if (!parseMeta.headerDetected) {
    issues.push(
      makeIssue(
        "medium",
        "No header row was detected",
        "The app generated or inferred field names because the first row looked like data rather than column labels."
      )
    );
  }

  if (parseMeta.duplicateHeaders > 0) {
    issues.push(
      makeIssue(
        "medium",
        "Duplicate header names were detected",
        `${parseMeta.duplicateHeaders} duplicate header name${parseMeta.duplicateHeaders === 1 ? " was" : "s were"} renamed during parsing.`
      )
    );
  }

  if (duplicateRowNumbers.size > 0) {
    issues.push(
      makeIssue(
        duplicateRowNumbers.size >= 3 ? "high" : "medium",
        "Duplicate rows were found",
        `${duplicateRowNumbers.size} row${duplicateRowNumbers.size === 1 ? "" : "s"} appear to be exact duplicates after normalization.`
      )
    );
  }

  if (parseMeta.inputKind === "document") {
    if (!parseMeta.structuredGuess) {
      issues.push(
        makeIssue(
          "medium",
          "The input is document-like rather than strongly tabular",
          "The content was extracted successfully, but clearer headings or a machine-readable export would improve profiling accuracy."
        )
      );
    }

    if (parseMeta.extractionMethod === "ocr") {
      if (parseMeta.ocrConfidence !== null && parseMeta.ocrConfidence < 80) {
        issues.push(
          makeIssue(
            "high",
            "OCR confidence is low",
            `Text was extracted from an image with approximately ${Math.round(parseMeta.ocrConfidence)}% confidence, so misread characters are likely.`
          )
        );
      } else if (parseMeta.ocrConfidence !== null) {
        issues.push(
          makeIssue(
            "low",
            "OCR was used for this input",
            `Image text extraction completed at approximately ${Math.round(parseMeta.ocrConfidence)}% confidence.`
          )
        );
      }
    }

    if (parseMeta.extractionMethod === "pdf-text" && parseMeta.sourcePages) {
      issues.push(
        makeIssue(
          "low",
          "PDF content was extracted as text",
          `${parseMeta.sourcePages} page${parseMeta.sourcePages === 1 ? "" : "s"} were processed. Table formatting may not map perfectly into rows and columns.`
        )
      );
    }

    if (parseMeta.extractionMethod === "docx-text") {
      issues.push(
        makeIssue(
          "low",
          "Word document formatting was flattened",
          "The raw text was extracted successfully, but some layout information from the original document may be lost."
        )
      );
    }
  }

  columnProfiles.forEach((profile) => {
    issues.push(...profile.issues);
  });

  const severityWeight = { high: 3, medium: 2, low: 1 };
  const usableCells = columnProfiles.reduce((sum, column) => sum + column.usableCount, 0);
  const missingCells = columnProfiles.reduce((sum, column) => sum + column.missingCount, 0);
  const placeholderCells = columnProfiles.reduce((sum, column) => sum + column.placeholderCount, 0);
  const invalidCells = columnProfiles.reduce((sum, column) => sum + column.invalidCount, 0);
  const totalCells = normalizedRows.length * columns.length;
  const completenessPct = (usableCells / Math.max(totalCells, 1)) * 100;
  const qualityPenalty =
    (missingCells / Math.max(totalCells, 1)) * 35 +
    (placeholderCells / Math.max(totalCells, 1)) * 18 +
    (invalidCells / Math.max(totalCells, 1)) * 28 +
    (duplicateRowNumbers.size / Math.max(normalizedRows.length, 1)) * 22 +
    issues.reduce((sum, issue) => sum + severityWeight[issue.severity], 0) * 0.9;
  const healthScore = clamp(Math.round(100 - qualityPenalty), 18, 99);
  const profile = {
    rowsCount: normalizedRows.length,
    columnsCount: columns.length,
    columns: columnProfiles,
    completenessPct,
    healthScore,
    issues: issues.sort((left, right) => severityWeight[right.severity] - severityWeight[left.severity]),
    issueCount: issues.length,
    missingCells,
    placeholderCells,
    invalidCells,
    duplicateRows: duplicateRowNumbers.size,
    problemRows,
    parseMeta,
    normalizedRows
  };

  profile.recommendations = buildRecommendations(profile);
  profile.narrative = buildNarrative(profile, "This");
  return profile;
}

function canonicalCase(value) {
  const text = String(value).trim();

  if (!text) {
    return text;
  }

  if (/\d/.test(text) || text.length <= 2) {
    return text.toUpperCase();
  }

  return titleCase(text);
}

function buildCleaningPlan(records, profile) {
  const columnMap = new Map(profile.columns.map((column) => [column.key, column]));
  const standardizedCaseColumns = new Set(
    profile.columns
      .filter(
        (column) =>
          column.inferredType === "text" &&
          column.caseInconsistency &&
          column.uniqueCount <= 20 &&
          column.invalidCount === 0
      )
      .map((column) => column.key)
  );

  let trimmedCount = 0;
  let normalizedMissingCount = 0;
  let standardizedCaseCount = 0;
  let parsedTypeCount = 0;

  const cleaned = records.map((record) => {
    const nextRecord = {};

    Object.entries(record).forEach(([key, rawValue]) => {
      const column = columnMap.get(key);
      let value = rawValue;

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed !== value) {
          trimmedCount += 1;
        }
        value = trimmed;
      }

      const classified = classifyValue(value);

      if (classified.kind === "missing") {
        if (value !== null && value !== undefined && String(value).trim() !== "") {
          normalizedMissingCount += 1;
        }
        nextRecord[key] = null;
        return;
      }

      if (classified.kind === "placeholder") {
        nextRecord[key] = classified.normalized;
        return;
      }

      let cleanedValue = classified.normalized;

      if (standardizedCaseColumns.has(key) && typeof cleanedValue === "string") {
        const normalizedCase = canonicalCase(cleanedValue);
        if (normalizedCase !== cleanedValue) {
          standardizedCaseCount += 1;
        }
        cleanedValue = normalizedCase;
      }

      if (column?.inferredType === "numeric") {
        const parsed = parseNumeric(cleanedValue);
        if (parsed !== null && parsed !== cleanedValue) {
          parsedTypeCount += 1;
          cleanedValue = parsed;
        }
      } else if (column?.inferredType === "date") {
        const parsed = parseDateValue(cleanedValue);
        if (parsed !== null && parsed !== cleanedValue) {
          parsedTypeCount += 1;
          cleanedValue = parsed;
        }
      } else if (column?.inferredType === "boolean") {
        const parsed = parseBoolean(cleanedValue);
        if (parsed !== null && parsed !== cleanedValue) {
          parsedTypeCount += 1;
          cleanedValue = parsed;
        }
      }

      nextRecord[key] = cleanedValue;
    });

    return nextRecord;
  });

  const signatures = new Set();
  let duplicatesRemoved = 0;
  const deduped = cleaned.filter((record) => {
    const signature = JSON.stringify(Object.entries(record).sort(([left], [right]) => left.localeCompare(right)));
    if (signatures.has(signature)) {
      duplicatesRemoved += 1;
      return false;
    }
    signatures.add(signature);
    return true;
  });

  return {
    cleanedRows: deduped,
    actionCounts: {
      trimmedCount,
      normalizedMissingCount,
      standardizedCaseCount,
      parsedTypeCount,
      duplicatesRemoved
    }
  };
}

function renderMonitor(profile) {
  const stateLabel =
    appState.viewMode === "cleaned"
      ? "Cleaned view active"
      : appState.viewMode === "preview"
        ? "Previewing cleaned view"
        : appState.datasetName === "sample-ops.json"
          ? "Sample profile loaded"
          : "Custom profile loaded";

  elements.monitorState.textContent = stateLabel;
  elements.datasetTag.textContent = `dataset://${appState.datasetName}`;
  elements.heroRows.textContent = formatCount(profile.rowsCount);
  elements.heroColumns.textContent = formatCount(profile.columnsCount);
  elements.heroIssues.textContent = formatCount(profile.issueCount);
  elements.heroHealth.textContent = formatPercent(profile.healthScore);

  const messages = [
    {
      prompt: `Inspecting ${profile.rowsCount} rows across ${profile.columnsCount} inferred columns.`,
      status: `${profile.issueCount} quality issue${profile.issueCount === 1 ? "" : "s"} are active in the current view.`
    },
    {
      prompt: `Measuring missing values, placeholder values, duplicates, and type consistency.`,
      status: `${profile.missingCells} missing cells and ${profile.duplicateRows} duplicate row${profile.duplicateRows === 1 ? "" : "s"} detected.`
    },
    {
      prompt:
        profile.parseMeta.inputKind === "document"
          ? `Extracting text from a ${profile.parseMeta.sourceType} input before profiling accuracy risks.`
          : `Profiling machine-readable structure and identifying what would improve trust in the data.`
    ,
      status: `${profile.recommendations[0] ?? "Recommendations are ready for review."}`
    },
    {
      prompt: `Cleaning remains reversible and only runs when the user previews or applies it.`,
      status: `Current mode: ${stateLabel.toLowerCase()}.`
    }
  ];

  let messageIndex = 0;
  elements.heroPrompt.textContent = messages[0].prompt;
  elements.heroStatus.textContent = messages[0].status;

  if (appState.monitorTimer) {
    window.clearInterval(appState.monitorTimer);
  }

  appState.monitorTimer = window.setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length;
    elements.heroPrompt.textContent = messages[messageIndex].prompt;
    elements.heroStatus.textContent = messages[messageIndex].status;
  }, 3800);
}

function renderMetrics(profile) {
  elements.metricRows.textContent = formatCount(profile.rowsCount);
  elements.metricColumns.textContent = formatCount(profile.columnsCount);
  elements.metricCompleteness.textContent = formatPercent(profile.completenessPct);
  elements.metricHealth.textContent = formatPercent(profile.healthScore);

  elements.statFormat.textContent = profile.parseMeta.format.toUpperCase();
  elements.statFormatDetail.textContent =
    profile.parseMeta.inputKind === "document"
      ? `Extracted from ${profile.parseMeta.sourceType} input using ${profile.parseMeta.extractionMethod}.`
      : profile.parseMeta.headerDetected
        ? "Header row detected successfully."
        : "Header row was inferred from the data.";

  elements.statDuplicates.textContent = formatCount(profile.duplicateRows);
  elements.statDuplicatesDetail.textContent =
    profile.duplicateRows > 0
      ? "Exact duplicates should be removed or tracked with an ID."
      : "No exact duplicate rows were detected.";

  elements.statMissing.textContent = formatCount(profile.missingCells + profile.placeholderCells);
  elements.statMissingDetail.textContent =
    `${formatCount(profile.missingCells)} missing cells and ${formatCount(profile.placeholderCells)} low-information placeholders.`;

  elements.statProblemRows.textContent = formatCount(profile.problemRows.length);
  elements.statProblemRowsDetail.textContent =
    profile.problemRows.length > 0
      ? "These rows have the highest concentration of gaps, invalid values, or duplicate risk."
      : "No rows stand out as especially problematic.";
}

function renderCompletenessChart(profile) {
  elements.columnHealthChip.textContent = `${profile.columnsCount} columns profiled`;

  elements.completenessChart.innerHTML = profile.columns
    .slice()
    .sort((left, right) => left.completeness - right.completeness)
    .map((column) => {
      const usablePct = Math.round(column.completeness * 100);
      const missingPct = Math.round((column.missingCount / Math.max(column.rowCount, 1)) * 100);
      const placeholderPct = Math.round((column.placeholderCount / Math.max(column.rowCount, 1)) * 100);

      return `
        <article class="health-row">
          <div class="health-row-head">
            <div>
              <strong>${escapeHtml(column.label)}</strong>
              <p>${escapeHtml(column.inferredType)} • ${escapeHtml(String(column.uniqueCount))} unique</p>
            </div>
            <span>${escapeHtml(String(usablePct))}% usable</span>
          </div>
          <div class="health-bar">
            <div class="health-fill usable" style="width: ${usablePct}%"></div>
            <div class="health-fill placeholder" style="width: ${placeholderPct}%"></div>
          </div>
          <p class="health-caption">${escapeHtml(String(missingPct))}% missing, ${escapeHtml(String(placeholderPct))}% placeholder</p>
        </article>
      `;
    })
    .join("");
}

function renderNarrative(profile) {
  elements.qualityHeadline.textContent = profile.narrative.headline;
  elements.qualityLead.textContent = profile.narrative.lead;
  elements.recommendationList.replaceChildren(
    ...profile.recommendations.map((point) => {
      const item = document.createElement("li");
      item.textContent = point;
      return item;
    })
  );
}

function renderIssues(profile) {
  elements.issueChip.textContent = `${profile.issueCount} issue${profile.issueCount === 1 ? "" : "s"}`;

  if (!profile.issues.length) {
    elements.issueList.innerHTML = `
      <article class="issue-item">
        <div>
          <strong>No issues detected</strong>
          <p>The current profile does not expose major quality problems.</p>
        </div>
      </article>
    `;
    return;
  }

  elements.issueList.innerHTML = profile.issues
    .slice(0, 10)
    .map(
      (issue) => `
        <article class="issue-item">
          <div>
            <strong>${escapeHtml(issue.title)}</strong>
            <p>${escapeHtml(issue.body)}</p>
          </div>
          <span class="severity severity-${escapeHtml(issue.severity)}">${escapeHtml(issue.severity)}</span>
        </article>
      `
    )
    .join("");
}

function renderProblemRows(profile) {
  elements.problemRowChip.textContent = `${profile.problemRows.length} row${profile.problemRows.length === 1 ? "" : "s"}`;

  if (!profile.problemRows.length) {
    elements.problemRowList.innerHTML = `
      <article class="problem-row">
        <div>
          <strong>No rows flagged</strong>
          <p>The current view does not have standout problem rows.</p>
        </div>
      </article>
    `;
    return;
  }

  elements.problemRowList.innerHTML = profile.problemRows
    .map(
      (row) => `
        <article class="problem-row">
          <div>
            <strong>Row ${escapeHtml(String(row.rowNumber))}</strong>
            <p>${escapeHtml(row.reasons.join(", "))}.</p>
            <p class="problem-preview">${escapeHtml(row.preview)}</p>
          </div>
          <span class="severity severity-high">${escapeHtml(String(row.reasons.length))} checks</span>
        </article>
      `
    )
    .join("");
}

function renderColumnGrid(profile) {
  elements.schemaChip.textContent = `${profile.columnsCount} columns`;

  elements.columnGrid.innerHTML = profile.columns
    .map((column) => {
      const sampleText = column.samples.length ? column.samples.join(" • ") : "No usable examples yet";
      return `
        <article class="column-card">
          <div class="column-card-top">
            <div>
              <strong>${escapeHtml(column.label)}</strong>
              <p>${escapeHtml(column.inferredType)} • ${escapeHtml(String(Math.round(column.completeness * 100)))}% usable</p>
            </div>
            <span>${escapeHtml(String(column.issues.length))} signals</span>
          </div>
          <ul class="column-meta">
            <li>${escapeHtml(String(column.uniqueCount))} unique values</li>
            <li>${escapeHtml(String(column.missingCount))} missing</li>
            <li>${escapeHtml(String(column.placeholderCount))} placeholder</li>
            <li>${escapeHtml(String(column.invalidCount))} invalid</li>
          </ul>
          <p class="column-sample">${escapeHtml(sampleText)}</p>
        </article>
      `;
    })
    .join("");
}

function formatPreviewValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "string") {
    const normalized = value.replace(/\s+/g, " ").trim();
    return normalized.length > 72 ? `${normalized.slice(0, 69)}...` : normalized;
  }

  if (typeof value === "object") {
    const serialized = JSON.stringify(value);
    return serialized.length > 72 ? `${serialized.slice(0, 69)}...` : serialized;
  }

  return String(value);
}

function renderDataPreview(profile) {
  const activeRows = getCurrentRows();
  const visibleColumns = profile.columns.slice(0, 8);
  const hiddenColumnCount = Math.max(profile.columns.length - visibleColumns.length, 0);
  const rowLimit = 6;
  const visibleRows = activeRows.slice(0, rowLimit);

  elements.dataPreviewChip.textContent =
    appState.viewMode === "original" ? "Original rows" : "Cleaned rows";

  if (!visibleColumns.length || !visibleRows.length) {
    elements.dataPreviewSummary.textContent = "No rows are available for preview in the current view.";
    elements.dataTableHead.innerHTML = "";
    elements.dataTableBody.innerHTML = `
      <tr>
        <td class="table-empty">Load a file to inspect rows inside the prototype.</td>
      </tr>
    `;
    return;
  }

  elements.dataPreviewSummary.textContent =
    `Showing ${formatCount(visibleRows.length)} of ${formatCount(activeRows.length)} ${appState.viewMode === "original" ? "original" : "cleaned"} row${activeRows.length === 1 ? "" : "s"} and ${formatCount(visibleColumns.length)} of ${formatCount(profile.columns.length)} column${profile.columns.length === 1 ? "" : "s"}.`;

  elements.dataTableHead.innerHTML = `
    <tr>
      ${visibleColumns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}
      ${hiddenColumnCount ? `<th>More</th>` : ""}
    </tr>
  `;

  elements.dataTableBody.innerHTML = visibleRows
    .map((row) => {
      const cells = visibleColumns
        .map((column) => `<td>${escapeHtml(formatPreviewValue(row[column.key]))}</td>`)
        .join("");
      const extraCell = hiddenColumnCount ? `<td class="table-more-cell">+${hiddenColumnCount} more</td>` : "";
      return `<tr>${cells}${extraCell}</tr>`;
    })
    .join("");
}

function renderCleaningPlan() {
  if (!appState.cleaningPlan || !appState.originalProfile || !appState.cleanedProfile) {
    elements.cleaningSummary.textContent = "Load a dataset to generate a cleaning plan.";
    elements.cleaningActionList.innerHTML = "";
    elements.cleaningDelta.textContent = "Quality delta pending.";
    return;
  }

  const { actionCounts } = appState.cleaningPlan;
  const items = [
    `${actionCounts.trimmedCount} value${actionCounts.trimmedCount === 1 ? "" : "s"} would be trimmed`,
    `${actionCounts.normalizedMissingCount} missing marker${actionCounts.normalizedMissingCount === 1 ? "" : "s"} would be normalized`,
    `${actionCounts.standardizedCaseCount} categorical value${actionCounts.standardizedCaseCount === 1 ? "" : "s"} would be standardized`,
    `${actionCounts.parsedTypeCount} value${actionCounts.parsedTypeCount === 1 ? "" : "s"} would be converted to a cleaner type`,
    `${actionCounts.duplicatesRemoved} duplicate row${actionCounts.duplicatesRemoved === 1 ? "" : "s"} would be removed`
  ];

  elements.cleaningSummary.textContent =
    "Cleaning is conservative: it standardizes what is already present, but it does not fill in unknown business facts.";
  elements.cleaningActionList.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  elements.cleaningDelta.textContent =
    `Health score would move from ${formatPercent(appState.originalProfile.healthScore)} to ${formatPercent(appState.cleanedProfile.healthScore)} after safe cleaning.`;
}

function renderIssueActions() {
  const hasCleanedRows = Boolean(appState.cleanedRows.length);
  const cleanedDelta =
    appState.originalProfile && appState.cleanedProfile
      ? appState.originalProfile.issueCount - appState.cleanedProfile.issueCount
      : 0;

  elements.quickClean.disabled = !hasCleanedRows;
  elements.downloadCleaned.disabled = !hasCleanedRows;

  if (!appState.originalProfile) {
    elements.issueActionHint.textContent =
      "Review the issues, then clean the reversible fixes directly in the prototype.";
    return;
  }

  if (appState.viewMode === "cleaned") {
    elements.issueActionHint.textContent =
      "The cleaned view is active in the prototype. Download it or return to the original view to compare the difference.";
    return;
  }

  if (appState.viewMode === "preview") {
    elements.issueActionHint.textContent =
      "You are previewing the cleaned result now. Apply it in the prototype if this looks right, or switch back to the original.";
    return;
  }

  elements.issueActionHint.textContent =
    cleanedDelta > 0
      ? `Safe cleaning can resolve about ${formatCount(cleanedDelta)} of the currently detected issue${cleanedDelta === 1 ? "" : "s"} without inventing missing facts.`
      : "Safe cleaning mostly standardizes format and duplicates here, so review the before-and-after preview before keeping it.";
}

function renderCleanControls() {
  const modeText =
    appState.viewMode === "cleaned"
      ? "Cleaned view"
      : appState.viewMode === "preview"
        ? "Preview view"
        : "Original view";

  elements.cleanModeBadge.textContent = modeText;

  if (!appState.originalProfile) {
    return;
  }

  elements.cleanPromptCopy.textContent =
    appState.viewMode === "original"
      ? "Safe cleaning is available. The app can standardize formatting, normalize blanks, remove exact duplicates, and keep the original view intact unless you choose otherwise."
      : appState.viewMode === "preview"
        ? "You are previewing the cleaned result. Compare it with the original before deciding whether to keep it."
        : "The cleaned view is active. You can still return to the original data at any time.";
}

function render(profile) {
  elements.fileName.textContent = `Current dataset: ${appState.datasetName}`;
  elements.rawRowsChip.textContent = `${formatCount(appState.originalProfile.rowsCount)} raw rows`;
  elements.rawColumnsChip.textContent = `${formatCount(appState.originalProfile.columnsCount)} columns`;
  elements.formatChip.textContent = `${appState.format.toUpperCase()} format`;

  renderMonitor(profile);
  renderMetrics(profile);
  renderCompletenessChart(profile);
  renderNarrative(profile);
  renderIssues(profile);
  renderProblemRows(profile);
  renderColumnGrid(profile);
  renderDataPreview(profile);
  renderCleaningPlan();
  renderIssueActions();
  renderCleanControls();
}

function analyzeAndRender(records, datasetName, parseMeta) {
  const originalProfile = profileDataset(records, parseMeta);
  const cleaningPlan = buildCleaningPlan(records, originalProfile);
  const cleanedProfile = profileDataset(cleaningPlan.cleanedRows, parseMeta);

  appState.datasetName = datasetName;
  appState.format = parseMeta.format;
  appState.parseMeta = parseMeta;
  appState.sourceRows = records;
  appState.originalProfile = originalProfile;
  appState.cleanedRows = cleaningPlan.cleanedRows;
  appState.cleanedProfile = cleanedProfile;
  appState.cleaningPlan = cleaningPlan;
  appState.viewMode = "original";

  render(originalProfile);

  elements.uploadHint.textContent =
    `${originalProfile.issueCount} issue${originalProfile.issueCount === 1 ? "" : "s"} found. Review the recommendations, then choose whether you want to preview or apply cleaning.`;
  elements.uploadHint.classList.remove("is-error");
}

function setError(message) {
  elements.uploadHint.textContent = message;
  elements.uploadHint.classList.add("is-error");
}

function resetError() {
  elements.uploadHint.classList.remove("is-error");
}

function downloadCleanedRows() {
  if (!appState.cleanedRows.length) {
    return;
  }

  const payload = JSON.stringify(appState.cleanedRows, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFilenameBase(appState.datasetName)}-cleaned.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function processStructuredText(text, datasetName) {
  try {
    const parsed = parseTextDataset(text, datasetName);
    analyzeAndRender(parsed.rows, datasetName, parsed.meta);
  } catch (error) {
    setError(error.message);
  }
}

function detectFileType(file) {
  const lowerName = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();

  if (mime.startsWith("image/") || IMAGE_EXTENSIONS.some((extension) => lowerName.endsWith(extension))) {
    return "image";
  }

  if (lowerName.endsWith(".pdf") || mime === "application/pdf") {
    return "pdf";
  }

  if (lowerName.endsWith(".docx")) {
    return "docx";
  }

  if (lowerName.endsWith(".doc")) {
    return "doc";
  }

  return "structured";
}

async function extractTextFromImage(file) {
  if (!window.Tesseract?.createWorker) {
    throw new Error("Image OCR tools could not be loaded. Make sure you are online and try the image again.");
  }

  elements.uploadHint.textContent = "Running OCR on the image. This may take a few seconds.";
  resetError();

  const worker = await window.Tesseract.createWorker("eng");

  try {
    const result = await worker.recognize(file);
    const text = result?.data?.text?.trim() ?? "";
    const confidence = result?.data?.confidence ?? null;

    if (!text) {
      throw new Error("No usable text was found in the image. A clearer image or higher-resolution scan may help.");
    }

    return {
      text,
      meta: {
        format: "image",
        headerDetected: false,
        duplicateHeaders: 0,
        inputKind: "document",
        sourceType: "image",
        extractionMethod: "ocr",
        ocrConfidence: confidence,
        sourcePages: 1
      }
    };
  } finally {
    await worker.terminate();
  }
}

async function extractTextFromPdf(file) {
  if (!window.pdfjsLib?.getDocument) {
    throw new Error("PDF parsing tools could not be loaded. Make sure you are online and try the PDF again.");
  }

  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
  elements.uploadHint.textContent = "Extracting text from the PDF.";
  resetError();

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => item.str)
      .filter(Boolean)
      .join(" ")
      .trim();

    if (pageText) {
      pages.push(pageText);
    }
  }

  const text = pages.join("\n\n").trim();

  if (!text) {
    throw new Error("This PDF did not expose usable text. It may be image-only or scanned. Try a clearer PDF or upload page images for OCR.");
  }

  return {
    text,
    meta: {
      format: "pdf",
      headerDetected: false,
      duplicateHeaders: 0,
      inputKind: "document",
      sourceType: "pdf",
      extractionMethod: "pdf-text",
      sourcePages: pdf.numPages,
      ocrConfidence: null
    }
  };
}

async function extractTextFromDocx(file) {
  if (!window.mammoth?.extractRawText) {
    throw new Error("Word parsing tools could not be loaded. Make sure you are online and try the document again.");
  }

  elements.uploadHint.textContent = "Extracting text from the Word document.";
  resetError();

  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();

  if (!text) {
    throw new Error("No usable text was extracted from this Word document.");
  }

  return {
    text,
    meta: {
      format: "docx",
      headerDetected: false,
      duplicateHeaders: 0,
      inputKind: "document",
      sourceType: "word",
      extractionMethod: "docx-text",
      sourcePages: null,
      ocrConfidence: null,
      parserMessages: result.messages?.length ?? 0
    }
  };
}

async function processDocumentFile(file, type) {
  try {
    let extracted;

    if (type === "image") {
      extracted = await extractTextFromImage(file);
    } else if (type === "pdf") {
      extracted = await extractTextFromPdf(file);
    } else if (type === "docx") {
      extracted = await extractTextFromDocx(file);
    } else if (type === "doc") {
      throw new Error("Legacy .doc files are not supported in-browser yet. Save the file as .docx or PDF and try again.");
    } else {
      throw new Error("Unsupported document type.");
    }

    const parsed = buildRecordsFromDocumentText(extracted.text, extracted.meta);
    analyzeAndRender(parsed.rows, file.name, parsed.meta);
  } catch (error) {
    setError(error.message);
  }
}

async function handleFileSelection(file) {
  if (!file) {
    return;
  }

  const type = detectFileType(file);

  if (type === "structured") {
    try {
      const text = await file.text();
      processStructuredText(text, file.name);
    } catch {
      setError("The selected file could not be read. Try a structured text, JSON, PDF, image, or .docx file.");
    }
    return;
  }

  await processDocumentFile(file, type);
}

elements.uploadTrigger.addEventListener("click", () => {
  elements.datasetFile.click();
});

elements.loadSample.addEventListener("click", () => {
  processStructuredText(SAMPLE_JSON, "sample-ops.json");
});

elements.datasetFile.addEventListener("change", (event) => {
  handleFileSelection(event.target.files?.[0]);
});

elements.dropzone.addEventListener("click", () => {
  elements.datasetFile.click();
});

elements.dropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    elements.datasetFile.click();
  }
});

elements.dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  elements.dropzone.classList.add("is-dragging");
});

elements.dropzone.addEventListener("dragleave", () => {
  elements.dropzone.classList.remove("is-dragging");
});

elements.dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  elements.dropzone.classList.remove("is-dragging");
  handleFileSelection(event.dataTransfer?.files?.[0]);
});

elements.previewCleaning.addEventListener("click", () => {
  if (!appState.cleanedProfile) {
    return;
  }

  appState.viewMode = "preview";
  render(appState.cleanedProfile);
});

elements.applyCleaning.addEventListener("click", () => {
  if (!appState.cleanedProfile) {
    return;
  }

  appState.viewMode = "cleaned";
  render(appState.cleanedProfile);
});

elements.quickClean.addEventListener("click", () => {
  if (!appState.cleanedProfile) {
    return;
  }

  appState.viewMode = "cleaned";
  render(appState.cleanedProfile);
});

elements.downloadCleaned.addEventListener("click", () => {
  downloadCleanedRows();
});

elements.revertOriginal.addEventListener("click", () => {
  if (!appState.originalProfile) {
    return;
  }

  appState.viewMode = "original";
  render(appState.originalProfile);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.14 });

elements.revealables.forEach((node) => revealObserver.observe(node));

processStructuredText(SAMPLE_JSON, "sample-ops.json");
