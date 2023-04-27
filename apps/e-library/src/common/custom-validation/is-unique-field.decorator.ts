import { PrismaClient } from '@prisma/client';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const prisma = new PrismaClient();

interface UniqueFieldOptions {
  table: string;
  field: string;
}

@ValidatorConstraint({ async: true })
class IsUniqueFieldConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: any) {
    const { table, field } = args.constraints[0];
    const relatedPropertyName = args.constraints[1];
    const relatedValue = (args.object as any)[relatedPropertyName];

    const record = await prisma[table].findFirst({
      where: {
        AND: [
          { [field]: value },
          relatedValue ? { id: { not: Number(relatedValue) } } : undefined,
        ],
      },
    });

    return !record;
  }

  defaultMessage(args: any) {
    const { field } = args.constraints[0];
    return `${field} ຕ້ອງບໍ່ຊ້ຳກັນ`;
  }
}

export function IsUniqueField(
  options: UniqueFieldOptions,
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUniqueField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options, property],
      options: validationOptions,
      validator: IsUniqueFieldConstraint,
    });
  };
}
