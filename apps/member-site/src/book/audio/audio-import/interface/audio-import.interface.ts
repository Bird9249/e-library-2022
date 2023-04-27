import { ImportHistory } from '@prisma/client';
import { SuccessData } from '../../../book-validation/interface/book-validation.interface';
import { CreateAudioDto } from '../../audio/dto/create-audio.dto';

interface AudioImportJop {
  audioImportDto: CreateAudioDto;
  successFiles: Array<SuccessData>;
  memberId: number;
}

interface FindOneImportAudio {
  importHistory: ImportHistory;
  books: any;
}

interface QueryEBookByImpHis {
  take: number;
  skip: number;
  title: string;
}

export { AudioImportJop, FindOneImportAudio, QueryEBookByImpHis };
