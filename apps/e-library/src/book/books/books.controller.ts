import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Book as BookModel, Category as CatagoryModel } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Permission } from '../../common/custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../../common/custom-guard/permission/permission.guard';
import { GetByIdPipe } from '../../common/custom-pip/get-by-id.pipe';
import { UploadFileService } from '../../upload-file/upload-file.service';
import { BooksService } from './books.service';
import { BooksActionDto } from './dto/books-action.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Controller('books')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-book')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly fileService: UploadFileService,
  ) {}

  @Get('categories')
  async allCat(): Promise<CatagoryModel[]> {
    return await this.booksService.allCat();
  }

  @Get('sub-categories/:catId')
  async allSubCat(
    @Param('catId', new GetByIdPipe('category')) catId: number,
  ): Promise<any[]> {
    return await this.booksService.allSubCat(catId);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryBookDto,
  ): Promise<any> {
    return await this.booksService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookModel | undefined> {
    return await this.booksService.findOne(id);
  }

  @Patch('action-public-book')
  actionPublicBook(@Body() body: BooksActionDto) {
    return this.booksService.actionPublicBook(body);
  }
}
