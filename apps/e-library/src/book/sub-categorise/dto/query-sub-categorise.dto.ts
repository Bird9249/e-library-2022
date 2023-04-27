import { IsIn } from 'apps/e-library/src/common/custom-validation/is-in.decorator';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QuerySubCategoriseDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsIn({ table: 'category' })
  catId: number;
}
