import { IsUniqueField } from 'apps/e-library/src/common/custom-validation/is-unique-field.decorator';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSourceDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  id: number;

  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsUniqueField({ table: 'source', field: 'name' }, 'id')
  name: string;
}
