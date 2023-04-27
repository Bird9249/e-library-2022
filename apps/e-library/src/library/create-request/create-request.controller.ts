import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Library as LibraryModel, LibraryPermission } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateRequestService } from './create-request.service';
import { QueryCreateRequestDto } from './dto/query-create-request.dto';
import { CreateApproveLibraryDto } from './dto/create-approve-library.dto';
import { GetByIdPipe } from '../../common/custom-pip/get-by-id.pipe';
import { PermissionGuard } from '../../common/custom-guard/permission/permission.guard';
import { Permission } from '../../common/custom-decorator/permission/permission.decorator';

@Controller('create-request')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-library')
export class CreateRequestController {
  constructor(private readonly createRequestService: CreateRequestService) {}

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryCreateRequestDto,
  ): Promise<LibraryModel[]> {
    return await this.createRequestService.findAll(query);
  }

  @Get('library-permissions')
  async findLibPer(): Promise<LibraryPermission[]> {
    return await this.createRequestService.findLibPer();
  }

  @Patch(':id')
  approveLibrary(
    @Param('id', new GetByIdPipe('library')) id: number,
    @Body() body: CreateApproveLibraryDto,
  ) {
    return this.createRequestService.approveLibrary(id, body);
  }
}
