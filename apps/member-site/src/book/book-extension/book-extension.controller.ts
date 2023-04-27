import {
  Controller,
  Get,
  Param,
  UseGuards,
  Put,
  Request,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { BookExtensionService } from './book-extension.service';
import {
  Body,
  Delete,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookExtenSionValidationService } from './book-extension-validation.service';
import { GetByIdPipe } from '../../custom-pip/get-by-id.decorator';
import { PermissionGuard } from '../../custom-guard/permission/permission.guard';
import { Permission } from '../../custom-decorator/permission/permission.decorator';
import { PubilcBookDto } from './dto/public-book.dto';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-book')
@Controller('book-extension')
export class BookExtensionController {
  constructor(
    private readonly bookExtensionService: BookExtensionService,
    private readonly BEValidate: BookExtenSionValidationService,
  ) {}

  @Get('categories')
  findCat() {
    return this.bookExtensionService.findCat();
  }

  @Get('sub-categories/:catId')
  findSubCat(@Param('catId', new GetByIdPipe('category')) catId: number) {
    return this.bookExtensionService.findSubCat(catId);
  }

  @Post('cover/:id')
  @UseInterceptors(FileInterceptor('cover'))
  async createOrupdateCover(
    @Param('id', new GetByIdPipe('book')) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    this.BEValidate.thumbnailFile(file);

    return await this.bookExtensionService.createOrUpdateCover(id, file);
  }

  @Post('contents/:id')
  @UseInterceptors(FileInterceptor('contents'))
  async updateOrCreateContents(
    @Param('id', new GetByIdPipe('book')) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<any> {
    this.BEValidate.file(file);

    await this.BEValidate.contentsStorage(id, req.user.libraryId, file);

    return await this.bookExtensionService.createOrUpdate(
      id,
      req.user.libraryId,
      file,
    );
  }

  @Delete('contents/:id')
  async deleteContents(
    @Param('id', new GetByIdPipe('book')) id: number,
    @Request() req,
  ) {
    await this.bookExtensionService.deleteContents(id, req.user.libraryId);
  }

  @Put('book-file/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateBookFile(
    @Param('id', new GetByIdPipe('book')) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<any> {
    this.BEValidate.file(file);

    await this.BEValidate.fileStorage(id, req.user.libraryId, file);

    return await this.bookExtensionService.updateBookFile(
      id,
      req.user.libraryId,
      file,
    );
  }

  @Patch('book-public')
  publicBook(@Body() body: PubilcBookDto) {
    return this.bookExtensionService.publicBook(body);
  }
}
