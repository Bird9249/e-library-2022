import { IsUniqueField } from 'apps/member-site/src/custom-validation/is-unique-field.decorator';
import { RequiresFieldIfEmpty } from 'apps/member-site/src/custom-validation/requires-field-if-empty.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePublisherDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsUniqueField({ table: 'publisher', field: 'name' })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @MaxLength(200, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  name: string;

  @MaxLength(150, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  province: string;

  @MaxLength(150, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  district: string;

  @MaxLength(150, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  village: string;

  @IsNumberString()
  no: string;

  @MaxLength(150, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  road: string;

  @IsOptional()
  @MaxLength(20, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @RequiresFieldIfEmpty('email')
  phone: string;

  @IsOptional()
  @MaxLength(100, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsEmail(undefined, { message: '$property ຈະຕ້ອງເປັນອີເມວ' })
  @RequiresFieldIfEmpty('phone')
  email: string;
}
