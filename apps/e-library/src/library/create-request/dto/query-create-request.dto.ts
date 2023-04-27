import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryCreateRequestDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  limit: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  id: number;
}
