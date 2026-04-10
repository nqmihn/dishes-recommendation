import { ErrorException } from 'src/exceptions/error-exception';
import { CountryCode, getCountryCodes } from '../enums/country';
import { isValidPhoneNumber, parsePhoneNumber, PhoneNumber } from 'libphonenumber-js';

export function formatPhoneNumber(phoneNumber: string, countryCodes: CountryCode[]): PhoneNumber | false {
  let formattedPhoneNumber: PhoneNumber | undefined = undefined;
  for (const countryCode of countryCodes) {
    if (isValidPhoneNumber(phoneNumber, countryCode)) {
      formattedPhoneNumber = parsePhoneNumber(phoneNumber, countryCode);
      if (!formattedPhoneNumber.country || !countryCodes.includes(<CountryCode>formattedPhoneNumber.country)) {
        return false;
      }
      break;
    }
  }

  return formattedPhoneNumber ?? false;
}

export function getFormattedPhoneNumberOrThrowError(phoneNumber: string, exception: ErrorException): PhoneNumber {
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber, getCountryCodes());
  if (!formattedPhoneNumber) {
    throw exception;
  }
  return formattedPhoneNumber;
}

export function getAllFormatPhoneNumber(phoneNumber: string): string {
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber, getCountryCodes());
  if (!formattedPhoneNumber) return phoneNumber;
  return [
    formattedPhoneNumber.number.toString().trim(),
    formattedPhoneNumber.nationalNumber.toString().trim(),
    formattedPhoneNumber.getURI().toString().trim(),
    formattedPhoneNumber.formatNational().toString().trim(),
    formattedPhoneNumber.formatInternational().toString().trim(),
  ].join(' ');
}
