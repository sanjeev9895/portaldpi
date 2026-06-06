export function getUniqueEmployees(data: any[]): string[] {
  const set = new Set<string>();
  data.forEach(item => {
    if (item.entered_by) set.add(item.entered_by);
  });
  return Array.from(set);
}

export function filterByEmployee(data: any[], employee: string): any[] {
  if (!employee || employee === 'All') return data;
  return data.filter(item => item.entered_by === employee);
}

export function exportToCsv(filename: string, rows: any[]) {
  if (!rows.length) return;
  const header = Object.keys(rows[0]);
  const csvContent = [header.join(','), ...rows.map(row => header.map(h => {
    const val = row[h];
    const escaped = ('' + val).replace(/"/g, '""');
    return `"${escaped}"`;
  }).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
