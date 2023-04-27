import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

@ValidatorConstraint({ async: true })
export class IsInConstraint implements ValidatorConstraintInterface {
  async validate(value: { table: string }, args: ValidationArguments) {
    if (value) {
      const [relatedPropertyName] = args.constraints;
      const prisma = new PrismaClient();

      const ids = [];

      const objIds = await prisma[relatedPropertyName.table].findMany({
        select: {
          id: true,
        },
      });

      objIds.forEach((objId) => {
        if (typeof objId.id == 'bigint') {
          ids.push(Number(objId.id));
        } else {
          ids.push(objId.id);
        }
      });

      if (ids.includes(Number(value))) return true;

      return false;
    }
    return true;
  }
}

export function IsIn(
  property: { table: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsInConstraint,
    });
  };
}
