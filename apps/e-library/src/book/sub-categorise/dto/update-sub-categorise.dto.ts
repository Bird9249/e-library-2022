import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { CreateSubCategoriseDto } from './create-sub-categorise.dto';

export class UpdateSubCategoriseDto extends PartialType(
  CreateSubCategoriseDto,
) {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  id: number;
}
