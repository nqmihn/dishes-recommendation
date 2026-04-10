import { registerAs } from '@nestjs/config';

export default registerAs('localization', () => ({
  fallback_locale: process.env.APP_FALLBACK_LOCALE,
}));
