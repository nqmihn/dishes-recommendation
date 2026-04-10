import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsAfterOrEqual(property: string, required: boolean, validationOptions?: ValidationOptions) {
  return function (object: Record<any, any>, propertyName: string) {
    registerDecorator({
      name: 'IsAfterOrEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property, required],
      options: ((validationOptions, propertyName, property) => {
        const validationOptionsDefault: ValidationOptions = {
          message: `${propertyName} must is after or equal ${property}`,
        };

        return Object.assign(validationOptionsDefault, validationOptions ?? {});
      })(validationOptions, propertyName, property),
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, required] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            (!required && relatedValue === undefined) || new Date(value).getTime() >= new Date(relatedValue).getTime()
          );
        },
      },
    });
  };
}
