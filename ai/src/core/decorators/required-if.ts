import { registerDecorator, ValidateIf, ValidationArguments, ValidationOptions } from 'class-validator';

export function RequiredIf(otherField: any, equalTo: any, validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      name: 'RequiredIf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [otherField, equalTo, propertyName],
      options: ((validationOptions, propertyName, otherField, equalTo) => {
        const decoratorFactory = ValidateIf(
          (object, value) => object[otherField] === equalTo || (object[otherField] !== equalTo && value),
        );
        decoratorFactory(object, propertyName);
        return validationOptions;
      })(validationOptions, propertyName, otherField, equalTo),
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [otherField, equalTo] = args.constraints;
          const otherFieldValue = (args.object as any)[otherField];

          return (otherFieldValue !== equalTo && value === undefined) || (otherFieldValue === equalTo && value);
        },
        defaultMessage(args: ValidationArguments): string {
          if ((args.object as any)[otherField] !== equalTo && (args.object as any)[propertyName]) {
            return `The ${propertyName} must be not present when ${otherField} is not ${equalTo} `;
          }

          return `The ${propertyName} is required when ${otherField} is ${equalTo}.`;
        },
      },
    });
  };
}
