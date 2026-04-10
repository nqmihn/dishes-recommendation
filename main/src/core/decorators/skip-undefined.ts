import { ValidateIf } from 'class-validator';

export function SkipUndefined() {
  return function (object: any, propertyName: string) {
    const decoratorFactory = ValidateIf((object, value) => value !== undefined);
    decoratorFactory(object, propertyName);
  };
}
