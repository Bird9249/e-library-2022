import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
  Patch,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UpdateRequestService } from './update-request.service';
import { QueryUpdateRequestDto } from './dto/query-update-requert.dto';
import { GetByIdPipe } from '../../common/custom-pip/get-by-id.pipe';
import { PermissionGuard } from '../../common/custom-guard/permission/permission.guard';
import { Permission } from '../../common/custom-decorator/permission/permission.decorator';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-library')
@Controller('update-request')
export class UpdateRequestController {
  constructor(private readonly updateRequestService: UpdateRequestService) {}

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryUpdateRequestDto,
  ): Promise<any> {
    return await this.updateRequestService.findAll(query);
  }

  @Patch('approve/:id')
  approveUpdate(@Param('id', new GetByIdPipe('updateStorage')) id: number) {
    return this.updateRequestService.approveUpdate(id);
  }

  @Patch('reject/:id')
  rejectUpdate(@Param('id', new GetByIdPipe('updateStorage')) id: number) {
    return this.updateRequestService.rejectUpdate(id);
  }
}
