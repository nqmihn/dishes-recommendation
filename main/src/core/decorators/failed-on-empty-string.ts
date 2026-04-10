import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function FailedOnEmptyString(strict: boolean, validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      name: 'FailedOnEmptyString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [strict],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [strict] = args.constraints;
          if (strict && typeof value === 'string') {
            value = value.trim();
          }

          return typeof value === 'string' && value !== '';
        },
        defaultMessage(): string {
          return `The ${propertyName} mustn't be empty string.`;
        },
      },
    });
  };
}
