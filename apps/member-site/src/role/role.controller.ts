import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryRoleDto } from './dto/query-role.dto';
import { GetByIdPipe } from '../custom-pip/get-by-id.decorator';
import { PermissionGuard } from '../custom-guard/permission/permission.guard';
import { Permission } from '../custom-decorator/permission/permission.decorator';

@Controller('role')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('namage-user')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get('permissions')
  permissions() {
    return this.service.permissions();
  }

  @Post()
  create(@Body() body: CreateRoleDto, @Request() req) {
    return this.service.create(body, req.user.libraryId);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryRoleDto,
    @Request() req,
  ) {
    return this.service.findAll(query, req.user.libraryId);
  }

  @Get(':id')
  findOne(@Param('id', new GetByIdPipe('role')) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new GetByIdPipe('role')) id: number,
    @Body() body: UpdateRoleDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', new GetByIdPipe('role')) id: number) {
    return this.service.remove(id);
  }
}
