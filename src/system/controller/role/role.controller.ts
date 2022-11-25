import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  // Req,
} from '@nestjs/common';
import { RoleService } from '../../service/role/role.service';
import { AddRoleDto, getListRoleDto, UpdateRoleDto } from '../../dto/role';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MyResponse } from '../../../common/myResponse';
import { QueryFailedError } from 'typeorm';

@Controller('role')
@ApiTags('角色管理')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  @ApiOperation({
    summary: '添加角色',
  })
  @ApiBody({ type: AddRoleDto })
  @ApiResponse({ type: AddRoleDto })
  async addRole(@Body() addRoleDto: AddRoleDto) {
    try {
      const role = await this.roleService.addRole(addRoleDto);
      return MyResponse.success('添加角色成功', role);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return MyResponse.fail('角色编码，角色名称不能重复', e);
      }
      throw e;
    }
  }
  @Put()
  @ApiOperation({ summary: '添加角色' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ type: AddRoleDto })
  async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.updateRole(updateRoleDto);
    if (!role) {
      return MyResponse.badRequest(`id ${updateRoleDto.id} 的角色不存在`);
    }
    return MyResponse.success('添加角色成功', role);
  }
  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async delRole(@Param('id') id: number) {
    const res = await this.roleService.delRoleById(id);
    if (res.affected === 0) {
      return MyResponse.badRequest(`id ${id} 角色不存在`);
    }
    return MyResponse.success('删除成功');
  }
  @Get()
  @ApiOperation({ summary: '查询可用的所有角色' })
  async getAllRole() {
    const roleList = await this.roleService.getAllRoll();
    return MyResponse.success('查询角色成功', roleList);
  }
  @Get('/list')
  @ApiQuery({ name: 'roleName', description: '角色名称', required: false })
  @ApiQuery({ name: 'roleDesc', description: '角色描述', required: false })
  @ApiQuery({ name: 'dataStatus', description: '角色状态', required: false })
  @ApiQuery({
    name: 'createTimeRange',
    description: '角色创建时间(第一个开始时间，第二个结束时间)',
    required: false,
  })
  @ApiQuery({
    name: 'updateTimeRange',
    description: '角色更新时间(第一个开始时间，第二个结束时间)',
    required: false,
  })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'pageSize', description: '每页条数', required: false })
  @ApiResponse({
    type: [getListRoleDto],
  })
  async getRoleList(
    @Query('roleName') roleName: string,
    @Query('roleDesc') roleDesc: string,
    @Query('dataStatus') dataStatus: number,
    @Query('createTimeRange') createTimeRange: string[],
    @Query('updateTimeRange') updateTimeRange: string[],
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    let dStatus: number[] = [];
    if (!Number.isNaN(Number.parseInt(dataStatus + ''))) {
      dStatus = [dataStatus];
    } else {
      dStatus = [0, 1];
    }
    const list = await this.roleService.getRoleByConds(
      roleName,
      roleDesc,
      dStatus,
      createTimeRange,
      updateTimeRange,
      page,
      pageSize,
    );
    return MyResponse.success('查询role列表成功', list);
  }
  @Get('/:id')
  @ApiParam({ name: 'id' })
  async getRoleById(@Param('id') id: number) {
    const role = await this.roleService.getRoleById(id);
    if (!role) {
      return MyResponse.badRequest(`id ${id} 不存在`);
    }
    return MyResponse.success('查询成功', role);
  }
}
