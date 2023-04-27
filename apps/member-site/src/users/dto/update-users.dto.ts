import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-users.dto';

export class UpdateUsersDto extends PartialType(
  OmitType(CreateUsersDto, ['memberName', 'password', 'email']),
) {}
