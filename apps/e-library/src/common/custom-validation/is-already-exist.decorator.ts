import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

@ValidatorConstraint({ async: true })
export class IsAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(
    value: { table: string; column: string },
    args: ValidationArguments,
  ) {
    const [relatedPropertyName] = args.constraints;
    const prisma = new PrismaClient();

    if (value) {
      return prisma[relatedPropertyName.table]
        .findUnique({
          where: {
            [relatedPropertyName.column]: value,
          },
        })
        .then((res) => {
          return res ? false : true;
        });
    }

    return true;
  }
}

export function IsAlreadyExist(
  property: { table: string; column: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAlreadyExistConstraint,
    });
  };
}
