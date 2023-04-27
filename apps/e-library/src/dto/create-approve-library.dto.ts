import { IsArray, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { IsIn } from '../common/custom-validation/is-in.decorator';

export class CreateApproveLibraryDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsIn({ table: 'library' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  readonly libId: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsInt({ message: '$property ຕ້ອງເປັນຈໍານວນເຕັມ' })
  readonly storageLimit: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsArray({ message: '$property ຕ້ອງເປັນ array' })
  @IsNumber(
    {},
    {
      each: true,
      message:
        "ແຕ່ລະຄ່າໃນ '$property ຈະຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້",
    },
  )
  readonly libPerIds: number[];
}
