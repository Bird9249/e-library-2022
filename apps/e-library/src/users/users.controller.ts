import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permission } from '../common/custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../common/custom-guard/permission/permission.guard';
import { MergeParamsAndBody } from '../common/custom-interceptor/merge-param-and-body.interceptor';
import { GetByIdPipe } from '../common/custom-pip/get-by-id.pipe';
import { CreateUsersDto } from './dto/create-users.dto';
import { QueryUserDto } from './dto/query-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-user')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('roles')
  findRoles() {
    return this.service.findRoles();
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryUserDto,
    @Request() req,
  ) {
    return this.service.findAll(query, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', new GetByIdPipe('adminAccount')) id: number) {
    return this.service.findDetail(id);
  }

  @Post()
  create(@Body() body: CreateUsersDto) {
    return this.service.create(body);
  }

  @UseInterceptors(MergeParamsAndBody)
  @Patch(':id')
  update(
    @Param('id', new GetByIdPipe('adminAccount')) id: number,
    @Body(new ValidationPipe({ transform: true })) body: UpdateUsersDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', new GetByIdPipe('adminAccount')) id: number) {
    return this.service.delete(id);
  }
}
