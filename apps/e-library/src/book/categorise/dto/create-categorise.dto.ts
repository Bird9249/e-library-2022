import { IsUniqueField } from 'apps/e-library/src/common/custom-validation/is-unique-field.decorator';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoriseDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsUniqueField({ table: 'category', field: 'name' }, 'id')
  @MaxLength(100, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  name: string;

  description: string;
}
