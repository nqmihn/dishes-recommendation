import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { validateDateFormat } from '../helpers/date-helper';

export function IsDateFormat(format: string, validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      name: 'IsDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [format],
      options: ((validationOptions, propertyName, format) => {
        const validationOptionsDefault: ValidationOptions = {
          message: `${propertyName} doesn't match format ${format}`,
        };

        return Object.assign(validationOptionsDefault, validationOptions ?? {});
      })(validationOptions, propertyName, format),
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [format] = args.constraints;

          return validateDateFormat(value, format);
        },
      },
    });
  };
}
