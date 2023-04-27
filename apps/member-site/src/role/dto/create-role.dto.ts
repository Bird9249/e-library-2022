import { ArrayMinSize, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IsInArray } from '../../custom-validation/is-in-array.decorator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsInArray({ table: 'permission' })
  perIds: number[];
}
