import { BannerStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class QueryBookAdDto {
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
  search?: number;

  @IsOptional()
  @IsEnum(BannerStatus)
  status?: BannerStatus;
}
