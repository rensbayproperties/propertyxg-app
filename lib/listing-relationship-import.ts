import type { LeadImportColumnOption } from "@/types";

export const splitSheetCellTokens = (cell: string): string[] =>
  cell
    .split(/[,;|]+/)
    .map((v) => v.trim())
    .filter(Boolean);

export function getDistinctSheetValuesForTarget(
  rows: Record<string, string>[],
  mapping: Record<string, string>,
  targetKey: string
): string[] {
  const sourceHeader = Object.entries(mapping).find(
    ([, t]) => t === targetKey
  )?.[0];
  if (!sourceHeader) return [];
  const allValues = rows.flatMap((row) =>
    splitSheetCellTokens(row[sourceHeader] ?? "")
  );
  return Array.from(new Set(allValues)).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export function relationshipColumnsForMapping(
  mapping: Record<string, string>,
  propertyColumns: LeadImportColumnOption[]
): LeadImportColumnOption[] {
  const mappedTargets = new Set(Object.values(mapping).filter(Boolean));
  return propertyColumns.filter(
    (col) =>
      col.hasRelationship === true &&
      Array.isArray(col.data) &&
      col.data.length > 0 &&
      mappedTargets.has(col.key)
  );
}

export function getStableRelationshipOptionValue(
  row: Record<string, unknown>,
  index: number
): string {
  if (row.value != null) return `value:${String(row.value)}`;
  if (row.id != null) return `id:${String(row.id)}`;
  if (row.label != null) return `label:${String(row.label)}`;
  if (row.name != null) return `name:${String(row.name)}`;
  return `i:${index}`;
}

export function getRelationshipApiTargetId(
  row: Record<string, unknown>,
  _columnKey: string
): string {
  // Latest API uses { label, value } for relationship options.
  if (row.value != null) return String(row.value);
  if (row.id != null) return String(row.id);
  if (typeof row.label === "string") return row.label;
  if (typeof row.name === "string") return row.name;
  return "";
}

export function relationshipOptionLabel(row: Record<string, unknown>): string {
  if (typeof row.label === "string") return row.label;
  if (typeof row.name === "string") return row.name;
  if (typeof row.description === "string") {
    const d = row.description;
    return d.length > 90 ? `${d.slice(0, 90)}…` : d;
  }
  return getRelationshipApiTargetId(row, "");
}

export function findRelationshipRowByStableValue(
  data: Record<string, unknown>[],
  stableValue: string
): Record<string, unknown> | undefined {
  return data.find(
    (row, index) => getStableRelationshipOptionValue(row, index) === stableValue
  );
}

/** Stable select value for a stored API id, or `"__skip"` when empty / not found. */
export function findStableValueForApiId(
  data: Record<string, unknown>[],
  columnKey: string,
  apiId: string
): string {
  if (!apiId) return "__skip";
  const idx = data.findIndex(
    (row) => getRelationshipApiTargetId(row, columnKey) === apiId
  );
  if (idx < 0) return "__skip";
  return getStableRelationshipOptionValue(data[idx], idx);
}

const normalizeForMatch = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function autoMapRelationshipValues(
  distinctSheetValues: string[],
  columnKey: string,
  data: Record<string, unknown>[]
): Record<string, string> {
  const out: Record<string, string> = {};
  distinctSheetValues.forEach((sheetValue) => {
    const n = normalizeForMatch(sheetValue);
    const match = data.find((row) => {
      const apiId = getRelationshipApiTargetId(row, columnKey);
      if (apiId && normalizeForMatch(apiId) === n) return true;
      if (typeof row.label === "string" && normalizeForMatch(row.label) === n)
        return true;
      if (typeof row.name === "string" && normalizeForMatch(row.name) === n)
        return true;
      if (
        typeof row.description === "string" &&
        normalizeForMatch(row.description) === n
      )
        return true;
      if (
        row.id != null &&
        normalizeForMatch(String(row.id)) === n
      )
        return true;
      return false;
    });
    if (match) {
      const id = getRelationshipApiTargetId(match, columnKey);
      if (id) out[sheetValue] = id;
    }
  });
  return out;
}
