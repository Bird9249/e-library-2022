import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryLibraryDto {
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
}
