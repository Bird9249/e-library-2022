import { AdminInfoGender } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsInArray } from '../../common/custom-validation/is-in-array.decorator';
import { IsUniqueField } from '../../common/custom-validation/is-unique-field.decorator';

export class CreateUsersDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @MaxLength(30, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsUniqueField({ table: 'adminAccount', field: 'userName' })
  userName: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsEmail(undefined, { message: '$property ບໍ່ຖືກຕ້ອງ' })
  @IsUniqueField({ table: 'adminAccount', field: 'email' }, 'id')
  email: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  password: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @MaxLength(50, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  firstName: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @MaxLength(50, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  lastName: string;

  @IsOptional()
  @IsEnum(AdminInfoGender, {
    message: '$property ຈະຕ້ອງເປັນ male ຫຼື female ຫຼື other',
  })
  gender: AdminInfoGender;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  phoneNumber: string;

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
