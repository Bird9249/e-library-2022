import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsIn } from 'apps/member-site/src/custom-validation/is-in.decorator';
import { StakeholderDto } from '../../../dto/stakeholder.dto';

export class BookDto {
  @IsIn({ table: 'publisher' }, { message: '$property ບໍ່ມີໃນລະບົບແລ້ວ' })
  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  pubId: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  bookPage: number;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  @IsNumber(undefined, {
    message: '$property ຕ້ອງເປັນຕົວເລກທີ່ສອດຄ່ອງກັບຂໍ້ຈໍາກັດທີ່ລະບຸໄວ້',
  })
  manufactureDate: number;

  ISBN: string;

  @IsNotEmpty({ message: '$property ບໍ່ຄວນຫວ່າງເປົ່າ' })
  briefContent: string;

  content: string;

  @IsOptional()
  @IsString({ message: '$property ຕ້ອງເປັນສະຕຣິງ' })
  contentsUrl: string;

  @ValidateNested({
    message: 'ຄ່າໃນ nested property $property ຈະຕ້ອງເປັນ object ຫຼື array',
  })
  @Type(() => StakeholderDto)
  stakeholder: StakeholderDto;
}
