import { IsIn } from 'apps/e-library/src/common/custom-validation/is-in.decorator';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class BooksActionDto {
  @IsIn({ table: 'book' }, { message: '$property ບໍ່ມີໃນລະບົບ' })
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
