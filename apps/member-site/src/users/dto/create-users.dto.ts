import { MemberInfoGender } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsUniqueField } from '../../custom-validation/is-unique-field.decorator';
import { IsInArray } from '../../custom-validation/is-in-array.decorator';

export class CreateUsersDto {
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

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsArray({
    message: '$property ຕ້ອງເປັນ array',
  })
  @ArrayMinSize(1, {
    message: '$property ຕ້ອງມີຢ່າງໜ້ອຍ $constraint1 ອົງປະກອບ',
  })
  @IsNumber(
    {},
    {
      each: true,
      message:
        'ແຕ່ລະຄ່າໃນ $property ຈະຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
    },
  )
  @IsInArray({ table: 'role' })
  roleIds: Array<number>;
}
