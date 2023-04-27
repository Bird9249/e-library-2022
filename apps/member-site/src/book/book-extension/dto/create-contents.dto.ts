import { IsIn } from 'apps/member-site/src/custom-validation/is-in.decorator';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContentsDto {
  @IsNotEmpty()
  @IsNumber()
  @IsIn({ table: 'book' })
  @Transform(({ value }) => parseInt(value))
  bookId: number;
}
