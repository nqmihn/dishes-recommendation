import { parse } from 'date-fns';
import { validateDateFormat } from '../helpers/date-helper';
import { throwError } from '../helpers/utils';

export function DateFormat(value: string, key: string, format: string): Date {
  if (!validateDateFormat(value, format)) {
    throwError(`The ${key} does not match format: ${format}.`);
  }

  return parse(value, format, new Date());
}
