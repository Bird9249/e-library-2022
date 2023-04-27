import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsEmail(undefined, { message: '$property ບໍ່ຖືກຕ້ອງ' })
  email: string;
}
