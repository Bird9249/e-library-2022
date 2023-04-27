import { IsIn } from 'apps/member-site/src/custom-validation/is-in.decorator';
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
import { VideoDto } from './video.dto';

export class CreateVideoDto {
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsIn({ table: 'category' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  categoryId: number;

  @IsOptional()
  @IsIn({ table: 'subCategory' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  subCategoryId: number;

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

  @MaxLength(255, {
    message: '$property ຈະຕ້ອງສັ້ນກວ່າ ຫຼືເທົ່າກັບ $constraint1 ຕົວອັກສອນ',
  })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  title: string;

  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  price: number;

  @IsBoolean({ message: '$property ຕ້ອງເປັນຄ່າ boolean' })
  complete: boolean;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  code: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @ValidateNested()
  @Type(() => VideoDto)
  video: VideoDto;
}
