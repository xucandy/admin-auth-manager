import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeptService } from '@/system/service/dept/dept.service';
import { AddDeptDto, UpdateDeptDto } from '@/system/dto/dept';
import { MyResponse } from '@/common/myResponse';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('dept')
@ApiTags('部门管理')
export class DeptController {
  constructor(private deptService: DeptService) {}

  @Post()
  @ApiBody({ type: AddDeptDto })
  @ApiResponse({ type: AddDeptDto })
  async addDept(@Body() addDeptDto: AddDeptDto) {
    const dept = await this.deptService.addDept(addDeptDto);
    return MyResponse.success('添加部门成功', dept);
  }

  @Put()
  @ApiBody({ type: UpdateDeptDto })
  @ApiResponse({ type: UpdateDeptDto })
  async updateDept(@Body() updateDeptDto: UpdateDeptDto) {
    const dept = await this.deptService.updateDept(updateDeptDto);
    if (!dept) {
      return MyResponse.badRequest(`id ${updateDeptDto.id} dept 未找到`);
    }
    return MyResponse.success('更新部门成功', dept);
  }
  @Get('/tree')
  async getDeptTree(
    @Query('deptName') deptName: string,
    @Query('dataStatus') dataStatus: number,
  ) {
    const dept = await this.deptService.getDeptTree(deptName, dataStatus);
    return MyResponse.success('查询部门tree成功', dept);
  }
  @Get('/:id')
  @ApiParam({ name: 'id' })
  async getDeptById(@Param('id') id: number) {
    const dept = await this.deptService.getDeptById(id);
    return MyResponse.success('查询成功', dept);
  }
  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async delDeptById(@Param('id') id: number) {
    const res = await this.deptService.delDept(id);
    if (res.affected === 0) {
      return MyResponse.badRequest(`id ${id} dept 不存在`);
    }
    return MyResponse.success('删除部门成功');
  }
}
