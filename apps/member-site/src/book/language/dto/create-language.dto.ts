import { IsUniqueField } from 'apps/member-site/src/custom-validation/is-unique-field.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLanguageDto {
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsUniqueField({ table: 'language', field: 'language' })
  language: string;
}
