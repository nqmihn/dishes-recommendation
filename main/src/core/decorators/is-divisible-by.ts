import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsDivisibleBy(value: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDivisibleBy',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [value],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [divisibleBy] = args.constraints;
          return typeof value === 'number' && value % divisibleBy === 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be divisible by ${args.constraints[0]}`;
        },
      },
    });
  };
}
