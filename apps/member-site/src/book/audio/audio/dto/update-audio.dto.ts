import { PartialType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AudioDto } from './audio.dto';
import { CreateAudioDto } from './create-audio.dto';

class AudioForUpdateDto extends OmitType(AudioDto, [
  'size',
  'timing',
  'fileUrl',
]) {}

export class UpdateAudioDto extends PartialType(
  OmitType(CreateAudioDto, ['audio', 'code', 'coverUrl']),
) {
  @ValidateNested()
  @Type(() => AudioForUpdateDto)
  audio: AudioForUpdateDto;
}
