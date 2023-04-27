import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

@ValidatorConstraint({ async: true })
export class IsInArrayConstraint implements ValidatorConstraintInterface {
  private message;

  async validate(value: number[], args: ValidationArguments) {
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

      const notExsisId = value.filter((val) => !ids.includes(Number(val)));

      if (notExsisId.length > 0) {
        this.message = `${notExsisId.join(',')} ບໍ່ມີໃນລະບົບ`;

        return false;
      }

      return true;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} ${this.message}`;
  }
}

export function IsInArray(
  property: { table: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsInArrayConstraint,
    });
  };
}
