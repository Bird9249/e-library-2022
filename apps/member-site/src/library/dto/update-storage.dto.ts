import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateStorageDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsInt({ message: '$property ຕ້ອງເປັນຕົວເລກຈຳນວນເຕັມ' })
  storage: number;
}
