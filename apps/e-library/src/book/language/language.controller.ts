import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Language } from '@prisma/client';
import { MergeParamsAndBody } from '../../common/custom-interceptor/merge-param-and-body.interceptor';
import { GetByIdPipe } from '../../common/custom-pip/get-by-id.pipe';
import { QueryLanguageDto } from './dto/query-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(private readonly service: LanguageService) {}

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryLanguageDto,
  ) {
    return await this.service.findAll(query);
  }

  @UseInterceptors(MergeParamsAndBody)
  @Patch(':id')
  async update(
    @Param('id', new GetByIdPipe('language')) id: number,
    @Body(new ValidationPipe({ transform: true })) body: UpdateLanguageDto,
  ): Promise<Language> {
    return await this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', new GetByIdPipe('language')) id: number) {
    return await this.service.remove(id);
  }
}
