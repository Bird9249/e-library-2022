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
import { AuthorService } from './author.service';
import { QueryAuthorDto } from './dto/query-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly service: AuthorService) {}

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryAuthorDto,
  ) {
    return await this.service.findAll(query);
  }

  @UseInterceptors(MergeParamsAndBody)
  @Patch(':id')
  async update(
    @Param('id', new GetByIdPipe('author')) id: number,
    @Body(new ValidationPipe({ transform: true })) body: UpdateAuthorDto,
  ) {
    return await this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', new GetByIdPipe('author')) id: number) {
    return await this.service.remove(id);
  }
}
