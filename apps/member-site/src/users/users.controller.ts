import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permission } from '../custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../custom-guard/permission/permission.guard';
import { TypeOfLibraryGuard } from '../custom-guard/type-of-library/type-of-library.guard';
import { GetByIdPipe } from '../custom-pip/get-by-id.decorator';
import { CreateUsersDto } from './dto/create-users.dto';
import { QueryUserDto } from './dto/query-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, TypeOfLibraryGuard, PermissionGuard)
@Permission('manage-user')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('roles')
  findRoles(@Request() req) {
    return this.users.findRoles(req.user.libraryId);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryUserDto,
    @Request() req,
  ) {
    return this.users.findAll(query, req.user.libraryId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', new GetByIdPipe('memberAccount')) id: number) {
    return this.users.findDetail(id);
  }

  @Post()
  create(@Body() body: CreateUsersDto, @Request() req) {
    return this.users.create(body, req.user.libraryId);
  }

  @Patch(':id')
  update(
    @Param('id', new GetByIdPipe('memberAccount')) id: number,
    @Body() body: UpdateUsersDto,
  ) {
    return this.users.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', new GetByIdPipe('memberAccount')) id: number) {
    return this.users.delete(id);
  }
}
