import { IsUniqueField } from 'apps/e-library/src/common/custom-validation/is-unique-field.decorator';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateLanguageDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  id: number;

  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsUniqueField({ table: 'language', field: 'language' }, 'id')
  language: string;
}
