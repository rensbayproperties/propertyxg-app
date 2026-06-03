import * as XLSX from "xlsx";
import {
  LeadImportColumnOption,
  LeadImportFilePreview,
  LeadImportMappingPair,
  LeadImportPayload,
  LeadImportSheetPreview,
} from "@/types";

const PREVIEW_ROW_LIMIT = 20;

const normalizeColumnName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

/** Matches logical import keys across snake_case, camelCase, and separators (API vs UI). */
const comparableImportKey = (key: string) =>
  String(key).toLowerCase().replace(/[^a-z0-9]/g, "");

const keysMatch = (a: string, b: string) => comparableImportKey(a) === comparableImportKey(b);

/** Parse a strict boolean; unknown strings → undefined (caller defaults to optional). */
const parseStrictBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
    return undefined;
  }
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "true" || s === "1" || s === "yes") return true;
    if (s === "false" || s === "0" || s === "no" || s === "") return false;
  }
  return undefined;
};

const readTriStateRequired = (r: Record<string, unknown>): boolean | undefined => {
  const candidates = [r.required, r.is_required, r.isRequired, r.mandatory, r.Required, r.Mandatory];
  for (const v of candidates) {
    const parsed = parseStrictBoolean(v);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
};

const readTriStateOptional = (r: Record<string, unknown>): boolean | undefined => {
  const candidates = [r.optional, r.is_optional, r.isOptional, r.Optional];
  for (const v of candidates) {
    const parsed = parseStrictBoolean(v);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
};

/**
 * Resolves whether a column is required for import (not DB nullability).
 * Precedence: explicit optional → meta required list → explicit required flags → optional=false → default optional.
 */
const resolveColumnRequired = (
  raw: Record<string, unknown>,
  key: string,
  metaRequiredKeys: string[] | undefined
): boolean => {
  const optional = readTriStateOptional(raw);
  if (optional === true) return false;

  if (metaRequiredKeys?.length) {
    const inMeta = metaRequiredKeys.some((k) => keysMatch(k, key));
    if (inMeta) return true;
  }

  const required = readTriStateRequired(raw);
  if (required === true) return true;
  if (required === false) return false;

  if (optional === false) return true;

  return false;
};

const leadImportColumnArrays = (obj: Record<string, unknown>): unknown[] | null => {
  const candidates = [obj.columns, obj.data, obj.fields, obj.items, obj.payload];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return null;
};

const extractMetaRequiredKeys = (obj: Record<string, unknown>): string[] => {
  const candidates = [
    obj.required_fields,
    obj.requiredFields,
    obj.requiredKeys,
    obj.required_columns,
    obj.requiredColumns,
    obj.mandatory_fields,
    obj.mandatoryFields,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c.map(String);
  }
  return [];
};

const firstNonEmptyString = (...values: unknown[]): string => {
  for (const v of values) {
    if (v === undefined || v === null) continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return "";
};

/**
 * Normalize a single API column shape into a canonical `LeadImportColumnOption` with explicit `required`.
 */
export const normalizeLeadImportColumn = (
  raw: unknown,
  meta?: { requiredKeys?: string[] }
): LeadImportColumnOption | null => {
  if (raw == null || typeof raw !== "object") return null;

  const r = raw as Record<string, unknown>;
  const key = firstNonEmptyString(
    r.key,
    r.field,
    r.name,
    r.field_key,
    r.fieldKey,
    r.column_key,
    r.columnKey
  );
  if (!key) return null;

  const label = firstNonEmptyString(
    r.label,
    r.title,
    r.display_name,
    r.displayName,
    r.name,
    key
);

  const required = resolveColumnRequired(r, key, meta?.requiredKeys);

  const column: LeadImportColumnOption = {
    key,
    label,
    required,
  };

  if (typeof r.type === "string" && ["string", "number", "email", "phone", "date", "array"].includes(r.type)) {
    column.type = r.type as LeadImportColumnOption["type"];
  }
  if (typeof r.description === "string") column.description = r.description;
  if (typeof r.example === "string") column.example = r.example;
  if (typeof r.hasRelationship === "boolean") column.hasRelationship = r.hasRelationship;
  if (Array.isArray(r.data)) column.data = r.data as Record<string, unknown>[];

  return column;
};

/**
 * Parse GET /lead-import/columns (or similar) payloads: arrays, `{ columns, required_fields }`, etc.
 */
export const parseLeadImportColumnsApiResponse = (root: unknown): LeadImportColumnOption[] => {
  if (root == null) return [];

  if (Array.isArray(root)) {
    return root
      .map((item) => normalizeLeadImportColumn(item))
      .filter((c): c is LeadImportColumnOption => c != null);
  }

  if (typeof root !== "object") return [];

  const o = root as Record<string, unknown>;
  const requiredKeys = extractMetaRequiredKeys(o);
  const list = leadImportColumnArrays(o);

  if (!list) return [];

  return list
    .map((item) => normalizeLeadImportColumn(item, { requiredKeys }))
    .filter((c): c is LeadImportColumnOption => c != null);
};

const ensureUniqueHeaders = (headers: string[]) => {
  const seen = new Map<string, number>();

  return headers.map((header, index) => {
    const safeHeader = header?.trim() || `column_${index + 1}`;
    const current = seen.get(safeHeader) ?? 0;
    seen.set(safeHeader, current + 1);

    if (current === 0) return safeHeader;
    return `${safeHeader}_${current + 1}`;
  });
};

const parseSheet = (sheetName: string, worksheet?: XLSX.WorkSheet): LeadImportSheetPreview => {
  if (!worksheet) {
    return {
      sheetName,
      headers: [],
      rows: [],
    };
  }

  const matrix = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(worksheet, {
    header: 1,
    defval: "",
    blankrows: false,
    raw: false,
  });

  if (matrix.length === 0) {
    return {
      sheetName,
      headers: [],
      rows: [],
    };
  }

  const rawHeaders = (matrix[0] ?? []).map((column) => String(column ?? "").trim());
  const headers = ensureUniqueHeaders(rawHeaders);

  const previewRows = matrix
    .slice(1, PREVIEW_ROW_LIMIT + 1)
    .filter((row) => row.some((cell) => String(cell ?? "").trim().length > 0))
    .map((row) => {
      const record: Record<string, string> = {};
      headers.forEach((header, headerIndex) => {
        record[header] = String(row?.[headerIndex] ?? "").trim();
      });
      return record;
    });

  return {
    sheetName,
    headers,
    rows: previewRows,
  };
};

export const parseLeadImportFile = async (file: File): Promise<LeadImportFilePreview> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetNames = workbook.SheetNames ?? [];

  const sheets = sheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    return parseSheet(sheetName, worksheet);
  });

  return {
    fileName: file.name,
    fileSize: file.size,
    sheetNames,
    sheets,
  };
};

export const autoMapLeadImportColumns = (
  sourceHeaders: string[],
  targetColumns: LeadImportColumnOption[]
): Record<string, string> => {
  const normalizedTargetMap = new Map<string, string>();
  const manualAliases: Record<string, string[]> = {
    users: ["assigned", "assignee", "assigned_to", "assigned user", "assigned users"],
  };

  targetColumns.forEach((column) => {
    normalizedTargetMap.set(normalizeColumnName(column.key), column.key);
    normalizedTargetMap.set(normalizeColumnName(column.label), column.key);
    const aliases = manualAliases[column.key] ?? [];
    for (const alias of aliases) {
      normalizedTargetMap.set(normalizeColumnName(alias), column.key);
    }
  });

  const mapping: Record<string, string> = {};

  sourceHeaders.forEach((header) => {
    const matched = normalizedTargetMap.get(normalizeColumnName(header));
    if (matched) {
      mapping[header] = matched;
    }
  });

  return mapping;
};

export const getMappingValidation = (
  mapping: Record<string, string>,
  targetColumns: LeadImportColumnOption[]
) => {
  const columns = Array.isArray(targetColumns) ? targetColumns : [];

  const requiredTargets = columns
    .filter((column) => column.required === true)
    .map((column) => String(column.key).trim())
    .filter(Boolean);

  const selectedTargets = Object.values(mapping)
    .map((value) => String(value).trim())
    .filter(Boolean);

  const selectedComparable = new Set(selectedTargets.map(comparableImportKey));

  const missingRequired = requiredTargets.filter(
    (requiredKey) => !selectedComparable.has(comparableImportKey(requiredKey))
  );

  const comparableCounts = new Map<string, number>();
  for (const target of selectedTargets) {
    const k = comparableImportKey(target);
    comparableCounts.set(k, (comparableCounts.get(k) ?? 0) + 1);
  }

  const duplicateTargets = Array.from(
    new Set(
      selectedTargets.filter((target) => (comparableCounts.get(comparableImportKey(target)) ?? 0) > 1)
    )
  );

  return {
    missingRequired,
    duplicateTargets,
    isValid: missingRequired.length === 0 && duplicateTargets.length === 0,
  };
};

/**
 * Builds the `/lead-import` / `/listing-import` JSON body.
 *
 * **`rowsPreview` in the payload:** for production bulk import, pass **`uploadedMediaId`** — the string
 * `id` from `POST /media/upload/single` (same value as `data.id` in the upload response). That is what the
 * API expects in the `rowsPreview` field (name is historical).
 */
export const buildLeadImportPayload = (
  fileMeta: LeadImportFilePreview,
  sheetName: string,
  mapping: Record<string, string>,
  /** Bulk import: media file id string. Legacy: preview row objects. */
  uploadedMediaIdOrPreviewRows: string | Record<string, string>[]
): LeadImportPayload => {
  const mappings: LeadImportMappingPair[] = Object.entries(mapping)
    .filter(([, targetColumn]) => Boolean(targetColumn))
    .map(([sourceColumn, targetColumn]) => ({
      sourceColumn,
      targetColumn,
    }));

  return {
    fileMeta: {
      fileName: fileMeta.fileName,
      fileSize: fileMeta.fileSize,
    },
    sheetName,
    mappings,
    rowsPreview: uploadedMediaIdOrPreviewRows,
  };
};
