// simple CSV exporter (no deps)
export function exportToCsv(items: any[], filename = "export.csv") {
  if (!items || !items.length) { alert("No data to export"); return; }
  const keys = Object.keys(items[0]);
  const csv = [keys.join(",")].concat(items.map(row => keys.map(k => JSON.stringify(row[k] ?? "")).join(","))).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
