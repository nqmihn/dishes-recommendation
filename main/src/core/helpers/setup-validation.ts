import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ErrorCode } from 'src/exceptions/error-code';
import { LogicalException } from 'src/exceptions/logical-exception';

/**
 * Sets up a validation pipe with custom exception handling.
 *
 * @returns {ValidationPipe} A configured ValidationPipe instance.
 *
 * The validation pipe transforms the input and uses a custom exception factory
 * to generate detailed validation error descriptions.
 *
 * The exception factory processes the validation errors and constructs a
 * descriptions object that maps each property to an array of constraint
 * violation messages. It recursively handles nested validation errors.
 *
 * @param {ValidationError[]} errors - An array of validation errors.
 * @param {any} error - A single validation error object.
 * @param {string} [prefix] - A prefix used for nested properties.
 */
export const setupValidationPipe = function (): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const descriptions = getValidationErrorDescriptions(errors);

      throw new LogicalException(ErrorCode.VALIDATION_ERROR, 'Validation error.', descriptions);
    },
  });
};

export const getValidationErrorDescriptions = (errors: ValidationError[]) => {
  const descriptions: Record<string, string[]> = {};

  const getErrorDescription = (error: any, prefix = '') => {
    const currentPrefix = `${prefix ? prefix + '.' : ''}`;

    if (error.constraints) {
      const constraintDescription: string[] = [];
      const constraints = Object.keys(error.constraints);
      for (const constraint of constraints) {
        constraintDescription.push(error.constraints[`${constraint}`]);
      }
      descriptions[`${currentPrefix}${error.property}`] = constraintDescription;
    }

    if (error.children && Array.isArray(error.children)) {
      error.children.forEach((item: any) => {
        getErrorDescription(item, `${currentPrefix}${error.property}`);
      });
    }
  };

  errors.forEach((error) => {
    getErrorDescription(error);
  });

  return descriptions;
};
