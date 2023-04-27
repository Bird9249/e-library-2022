import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function RequiresFieldIfEmpty(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'requiresFieldIfEmpty',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!relatedValue && !value) {
            return false;
          }

          return true;
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${relatedPropertyName} ບໍ່ຄວນຫວ່າງເປົ່າ ຫຼື ${args.property} ບໍ່ຄວນຫວ່າງເປົ່າ`;
        },
      },
    });
  };
}
