import { IsUniqueField } from 'apps/member-site/src/custom-validation/is-unique-field.decorator';
import { IsString, MaxLength } from 'class-validator';

export class CreateAuthorDto {
  @IsUniqueField({ table: 'author', field: 'fullName' })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  @MaxLength(200, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  fullname: string;

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
