import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Library as LibraryModel } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { LibraryService } from './library.service';
import { QueryLibraryDto } from './dto/query-library.dto';
import { PermissionGuard } from '../../common/custom-guard/permission/permission.guard';
import { Permission } from '../../common/custom-decorator/permission/permission.decorator';

@Controller('library')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryLibraryDto,
  ): Promise<LibraryModel[]> {
    return await this.libraryService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LibraryModel | undefined> {
    return await this.libraryService.findOne(id);
  }
}
