import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { MergeParamsAndBody } from '../../common/custom-interceptor/merge-param-and-body.interceptor';
import { GetByIdPipe } from '../../common/custom-pip/get-by-id.pipe';
import { QueryPublisherDto } from './dto/query-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherService } from './publisher.service';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly service: PublisherService) {}

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryPublisherDto,
  ) {
    return await this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findOne(id);
  }

  @UseInterceptors(MergeParamsAndBody)
  @Patch(':id')
  async update(
    @Param('id', new GetByIdPipe('publisher')) id: number,
    @Body(new ValidationPipe({ transform: true })) body: UpdatePublisherDto,
  ) {
    return await this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', new GetByIdPipe('publisher')) id: number) {
    return await this.service.remove(id);
  }
}
