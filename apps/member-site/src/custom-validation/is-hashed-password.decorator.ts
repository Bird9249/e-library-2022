import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { hash } from 'bcrypt';

export function IsHashedPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isHashedPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }
          try {
            await hash(value, 10);
            return true;
          } catch (err) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} ຕ້ອງເປັນລະຫັດຜ່ານທີ່ຖືກ hashed`;
        },
      },
    });
  };
}
