// import numeral from 'numeral';

export function numberFormat(num?: number | string) {
  if (num !== undefined) return Number(num).toLocaleString();
  return '-';
}
