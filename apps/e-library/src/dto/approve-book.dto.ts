import { IsInt } from 'class-validator';
import { IsIn } from '../common/custom-validation/is-in.decorator';

export class ApproveBookDto {
  @IsInt({ message: '$property ຕ້ອງເປັນຈໍານວນເຕັມ' })
  @IsIn({ table: 'book' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  readonly id: number;
}
