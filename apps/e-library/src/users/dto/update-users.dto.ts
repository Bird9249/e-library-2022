import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { CreateUsersDto } from './create-users.dto';

export class UpdateUsersDto extends PartialType(
  OmitType(CreateUsersDto, ['userName', 'password']),
) {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  id: number;
}
