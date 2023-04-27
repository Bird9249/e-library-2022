import {
  Controller,
  UseGuards,
  Get,
  Query,
  Post,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Permission } from '../../custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../../custom-guard/permission/permission.guard';
import { CreateSourceDto } from './dto/create-source.dto';
import { QuerySourceDto } from './dto/query-source.dto';
import { SourceService } from './source.service';

@Controller('source')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-book')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: QuerySourceDto,
  ) {
    return this.sourceService.findAll(query);
  }

  @Post()
  create(@Body() createSourceDto: CreateSourceDto) {
    return this.sourceService.create(createSourceDto);
  }
}
