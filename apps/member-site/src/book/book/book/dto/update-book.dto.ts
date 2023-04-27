import { BookDto } from './book.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BookForUpdateDto extends OmitType(BookDto, ['contentsUrl']) {}

export class UpdateBookDto extends PartialType(
  OmitType(CreateBookDto, ['book', 'coverUrl']),
) {
  @ValidateNested()
  @Type(() => BookForUpdateDto)
  book: BookForUpdateDto;
}
