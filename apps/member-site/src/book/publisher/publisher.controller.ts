import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Permission } from '../../custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../../custom-guard/permission/permission.guard';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { QueryPublisherDto } from './dto/query-publisher.dto';
import { PublisherService } from './publisher.service';

@Controller('publisher')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-book')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryPublisherDto,
  ) {
    return this.publisherService.findAll(query);
  }

  @Post()
  create(@Body() body: CreatePublisherDto) {
    return this.publisherService.create(body);
  }
}
