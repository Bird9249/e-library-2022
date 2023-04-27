import { IsDateString } from 'class-validator';

export class UpdateSupportAdDto {
  @IsDateString(undefined, {
    message: '$property ຕ້ອງເປັນສະຕຣິງວັນທີ ISO 8601 ທີ່ຖືກຕ້ອງ',
  })
  durationStart: Date;

  @IsDateString(undefined, {
    message: '$property ຕ້ອງເປັນສະຕຣິງວັນທີ ISO 8601 ທີ່ຖືກຕ້ອງ',
  })
  durationEnd: Date;
}
