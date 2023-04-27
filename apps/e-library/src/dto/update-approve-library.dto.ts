import { IsNotEmpty } from 'class-validator';
import { IsIn } from '../common/custom-validation/is-in.decorator';

export class UpdateApproveLibraryDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsIn({ table: 'updateStorage' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  readonly id: number;
}
