import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryRoleDto {
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
  name?: string;
}
