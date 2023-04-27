import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateVideoDto } from './create-video.dto';
import { VideoDto } from './video.dto';

class VideoForUpdateDto extends OmitType(VideoDto, [
  'size',
  'timing',
  'fileUrl',
]) {}

export class UpdateVideoDto extends PartialType(
  OmitType(CreateVideoDto, ['video', 'code', 'coverUrl']),
) {
  @ValidateNested()
  @Type(() => VideoForUpdateDto)
  video: VideoForUpdateDto;
}
