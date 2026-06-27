export function formatNumber(num) {
  if (num === undefined || num === null) return '';
  return new Intl.NumberFormat('en-US').format(num);
}
