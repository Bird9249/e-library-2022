import { IsUniqueField } from 'apps/e-library/src/common/custom-validation/is-unique-field.decorator';
import { RequiresFieldIfEmpty } from 'apps/e-library/src/common/custom-validation/requires-field-if-empty.decorator';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePublisherDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  id: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsUniqueField({ table: 'publisher', field: 'name' }, 'id')
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @MaxLength(200, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  name: string;

  @IsOptional()
  @MaxLength(150, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  province: string;

  @IsOptional()
  @MaxLength(150, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  district: string;

  @IsOptional()
  @MaxLength(150, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  village: string;

  @IsOptional()
  @IsNumberString()
  no: string;

  @IsOptional()
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
