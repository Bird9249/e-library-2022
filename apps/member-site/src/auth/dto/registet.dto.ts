import { MemberInfoGender } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsUniqueField } from '../../custom-validation/is-unique-field.decorator';

export class RegisterDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @MaxLength(30, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsUniqueField({ table: 'memberAccount', field: 'memberName' })
  memberName: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsEmail(undefined, { message: '$property ບໍ່ຖືກຕ້ອງ' })
  @IsUniqueField({ table: 'memberAccount', field: 'email' })
  email: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  password: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @MaxLength(150, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  fullName: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsEnum(MemberInfoGender, {
    message: '$property ຈະຕ້ອງເປັນ male ຫຼື female ຫຼື other',
  })
  gender: MemberInfoGender;

  @IsDateString(undefined, {
    message: '$property ຕ້ອງເປັນສະຕຣິງວັນທີ ISO 8601 ທີ່ຖືກຕ້ອງ',
  })
  dateOfBirth: string;

  @IsOptional()
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  address: string;
}
