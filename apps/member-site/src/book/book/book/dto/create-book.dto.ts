import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { IsInArray } from 'apps/member-site/src/custom-validation/is-in-array.decorator';
import { IsIn } from 'apps/member-site/src/custom-validation/is-in.decorator';
import { BookDto } from './book.dto';

export class CreateBookDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsIn({ table: 'category' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  categoryId: number;

  @IsOptional()
  @IsIn({ table: 'subCategory' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  subCategoryId: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsIn({ table: 'language' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  langId: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsIn({ table: 'source' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  sourceId: number;

  @IsOptional()
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  coverUrl: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @MaxLength(255, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  title: string;

  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  price: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsBoolean({ message: '$property ຕ້ອງເປັນຄ່າ boolean' })
  complete: boolean;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsNumber(undefined, {
    each: true,
    message:
      'ແຕ່ລະຄ່າໃນ $property ຈະຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  @IsInArray({ table: 'author' })
  authorIds: number[];

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @ValidateNested()
  @Type(() => BookDto)
  book: BookDto;
}
