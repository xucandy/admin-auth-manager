import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from '@/system/service/user/user.service';
import {
  AddUserDto,
  UpdateUserDto,
  ChangeUserBasicDto,
} from '@/system/dto/user';
import { MyResponse } from '@/common/myResponse';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { strToMd5 } from '../../../common/utils';

@Controller('user')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiBody({ type: AddUserDto })
  async addUser(@Body() addUserDto: AddUserDto) {
    const user = await this.userService.addUser(addUserDto);
    delete user.password;
    return MyResponse.success('添加用户成功', user);
  }
  @Put()
  @ApiBody({ type: UpdateUserDto })
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateUser(updateUserDto);
    if (!user) {
      return MyResponse.badRequest(`id ${updateUserDto.id} user 不存在`);
    }
    delete user.password;
    return MyResponse.success('更新用户成功', user);
  }
  @Put('/changeUserBasicInfo')
  async changeUserBasic(@Body() updateUserDto: ChangeUserBasicDto) {
    const res = await this.userService.changeUserBasic(updateUserDto);
    if (res.affected === 0) {
      return MyResponse.badRequest(`id ${updateUserDto.id} user 不存在`);
    }
    return MyResponse.success('更新用户成功');
  }
  @Put('/changePassword')
  async changePassword(
    @Req() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    if (req.user.password !== strToMd5(body.oldPassword)) {
      return MyResponse.badRequest('旧密码输入错误');
    }
    const res = await this.userService.changePassword(
      req.user.id,
      body.newPassword,
    );
    if (res.affected === 0) {
      return MyResponse.badRequest(`id ${req.user.id} user 不存在`);
    }
    return MyResponse.success('更新密码成功');
  }
  @Get('/list')
  @ApiQuery({ name: 'username' })
  @ApiQuery({ name: 'phone' })
  @ApiQuery({ name: 'updateTimeRange' })
  @ApiQuery({ name: 'createTimeRange' })
  @ApiQuery({ name: 'deptId' })
  @ApiQuery({ name: 'roleCodes' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'pageSize' })
  async getList(
    @Query('username') username: string,
    @Query('phone') phone: string,
    @Query('updateTimeRange') updateTimeRange: string[],
    @Query('createTimeRange') createTimeRange: string[],
    @Query('deptId') deptId: number,
    @Query('roleCodes') roleCodes: string[],
    @Query('dataStatus') dataStatus: number,
    @Query('nickname') nickname: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const result = await this.userService.getUserByConds({
      username,
      phone,
      nickname,
      createTimeRange,
      updateTimeRange,
      deptId,
      roleCodes,
      dataStatus,
      page,
      pageSize,
    });
    return MyResponse.success('查询成功', result);
  }
  @Get('/userInfo')
  async getUserInfo(@Req() req: any) {
    return MyResponse.success(req.user);
  }
  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userService.getUserById(id);
    return MyResponse.success(user);
  }
  @Delete('/:id')
  async delUser(@Param('id') id: number) {
    const res = await this.userService.delUser(id);
    if (res === false) {
      return MyResponse.badRequest(`id ${id} user不存在`);
    }
    return MyResponse.success('删除用户成功');
  }
}
