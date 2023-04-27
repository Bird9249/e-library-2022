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
import { MergeParamsAndBody } from '../../common/custom-interceptor/merge-param-and-body.interceptor';
import { GetByIdPipe } from '../../common/custom-pip/get-by-id.pipe';
import { QuerySourceDto } from './dto/query-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { SourceService } from './source.service';

@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QuerySourceDto,
  ) {
    return await this.sourceService.findAll(query);
  }

  @UseInterceptors(MergeParamsAndBody)
  @Patch(':id')
  async update(
    @Param('id', new GetByIdPipe('source')) id: number,
    @Body(new ValidationPipe({ transform: true })) body: UpdateSourceDto,
  ) {
    return await this.sourceService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', new GetByIdPipe('source')) id: number) {
    return await this.sourceService.remove(id);
  }
}
