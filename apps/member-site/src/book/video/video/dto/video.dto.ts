import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class VideoDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @MaxLength(30, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  pattern: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  description: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  size: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  timing: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  fileUrl: string;
}
