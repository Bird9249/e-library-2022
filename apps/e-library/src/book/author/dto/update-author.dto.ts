import { IsUniqueField } from 'apps/e-library/src/common/custom-validation/is-unique-field.decorator';
import { Transform } from 'class-transformer';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class UpdateAuthorDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  id: number;

  @IsUniqueField({ table: 'author', field: 'fullName' }, 'id')
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @MaxLength(200, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  fullName: string;

  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @MaxLength(150, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  major: string;

  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @MaxLength(30, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  phoneNumber: string;

  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @MaxLength(50, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  email: string;
}
