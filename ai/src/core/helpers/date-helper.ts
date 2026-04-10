import * as DateFns from 'date-fns';

export function toDDMMYYYFormat(date: Date): string {
  return DateFns.format(new Date(date.getTime() + 7 * 60 * 60 * 1000), 'dd/MM/yyyy');
}

export function validateDateFormat(value: string, format: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const date = DateFns.parse(value, format, new Date());
  return DateFns.isValid(date);
}
