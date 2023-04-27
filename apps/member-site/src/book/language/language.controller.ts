import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Permission } from '../../custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../../custom-guard/permission/permission.guard';
import { CreateLanguageDto } from './dto/create-language.dto';
import { QueryLanguageDto } from './dto/query-language.dto';
import { LanguageService } from './language.service';

@Controller('language')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-book')
export class LanguageController {
  constructor(private readonly langService: LanguageService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryLanguageDto,
  ) {
    return this.langService.getAll(query);
  }

  @Post()
  create(@Body() body: CreateLanguageDto) {
    return this.langService.create(body);
  }
}
