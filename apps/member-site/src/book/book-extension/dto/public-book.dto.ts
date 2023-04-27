import { IsIn } from 'apps/e-library/src/common/custom-validation/is-in.decorator';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PubilcBookDto {
  @IsIn({ table: 'book' }, { message: '$property ບໍ່ມີໃນລະບົບ' })
  @IsNumber()
  @IsNotEmpty()
  bookId: number;
}
