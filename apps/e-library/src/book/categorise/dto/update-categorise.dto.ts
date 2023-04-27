import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { CreateCategoriseDto } from './create-categorise.dto';

export class UpdateCategoriseDto extends PartialType(CreateCategoriseDto) {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  id: number;
}
