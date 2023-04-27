import { BookType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BooleanBody } from '../../common/enum/book';

export class QueryBookDto {
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
  searchName: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  subCategoryId: number;

  @IsNotEmpty()
  @IsEnum(BookType)
  bookType: BookType;

  @IsOptional()
  @IsEnum(BooleanBody)
  adminApprove: BooleanBody;
}
