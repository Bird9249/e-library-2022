import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryLanguageDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  page?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  language?: string;
}
