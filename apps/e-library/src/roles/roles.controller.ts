import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { GetByIdPipe } from '../common/custom-pip/get-by-id.pipe';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionGuard } from '../common/custom-guard/permission/permission.guard';
import { Permission } from '../common/custom-decorator/permission/permission.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-user')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get('permissions')
  permissions() {
    return this.service.permissions();
  }

  @Post()
  create(@Body() body: CreateRoleDto) {
    return this.service.create(body);
  }

  @Get()
  findAll(@Query(new ValidationPipe({ transform: true })) query: QueryRoleDto) {
    return this.service.findAll(query);
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
