import { IsNotEmpty } from 'class-validator';
import { IsIn } from '../../../../custom-validation/is-in.decorator';

export class CreateAudioImportDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsIn({ table: 'category' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  categoryId: number;

  @IsIn({ table: 'subCategory' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  subCategoryId: number;

  @IsIn({ table: 'source' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  sourceId: number;

  @IsIn({ table: 'language' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  langId: number;
}
