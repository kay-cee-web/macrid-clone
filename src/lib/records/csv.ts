/** A column of a CSV export: its heading and how to read the cell from a row. */
export type CsvColumn<T> = { header: string; value: (row: T) => string | number | null | undefined };

/**
 * One cell, quoted when it holds a comma, quote or line break. A value that
 * starts like a formula (=, +, -, @) gets a leading apostrophe, so a scraped
 * business name can't run as a formula when the file opens in a spreadsheet.
 */
function cell(value: string | number | null | undefined) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]) {
  const lines = [columns.map((c) => cell(c.header)), ...rows.map((row) => columns.map((c) => cell(c.value(row))))];
  return lines.map((line) => line.join(",")).join("\r\n");
}

/** Hands the text to the browser as a download. The BOM makes Excel read it as UTF-8. */
export function downloadCsv(filename: string, csv: string) {
  const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** "Dexisphere Test — Dubai" → "dexisphere-test-dubai-2026-10-29.csv". */
export const csvName = (title: string) =>
  `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "export"}-${new Date().toISOString().slice(0, 10)}.csv`;
