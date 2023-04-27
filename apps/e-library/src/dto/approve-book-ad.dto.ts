import { IsInt } from 'class-validator';
import { IsIn } from '../common/custom-validation/is-in.decorator';

export class ApproveBookAdDto {
  @IsInt({ message: '$property ຕ້ອງເປັນຈໍານວນເຕັມ' })
  @IsIn({ table: 'banner' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  readonly id: number;
}
