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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { QueryAuthorDto } from './dto/query-author.dto';

@Controller('authors')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-book')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  create(@Body() authorDto: CreateAuthorDto): any {
    return this.authorsService.create(authorDto);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryAuthorDto,
  ): any {
    return this.authorsService.findAll(query);
  }
}
