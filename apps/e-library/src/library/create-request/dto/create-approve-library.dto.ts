import { IsInArray } from 'apps/e-library/src/common/custom-validation/is-in-array.decorator';
import { IsArray, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateApproveLibraryDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsInt({ message: '$property ຕ້ອງເປັນຈໍານວນເຕັມ' })
  readonly storageLimit: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsArray({ message: '$property ຕ້ອງເປັນ array' })
  @IsInArray({ table: 'libraryPermission' })
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
