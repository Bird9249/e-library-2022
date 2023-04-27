// import { IsAlreadyExist } from 'apps/e-library/src/common/custom-validation/is-already-exist.decorator';
import { IsIn } from 'apps/e-library/src/common/custom-validation/is-in.decorator';
import { IsUniqueField } from 'apps/e-library/src/common/custom-validation/is-unique-field.decorator';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSubCategoriseDto {
  @IsIn({ table: 'category' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  categoryId: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsUniqueField({ table: 'subCategory', field: 'name' }, 'id')
  @MaxLength(100, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
