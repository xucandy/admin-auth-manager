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
import { MenuService } from '../../service/menu/menu.service';
import {
  AddMenuDto,
  MenuTreeDto,
  AllMenuDto,
  UpdateMenuDto,
} from '../../dto/menu';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MyResponse } from '../../../common/myResponse';

@Controller('menu')
@ApiTags('菜单管理')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post()
  @ApiOperation({ summary: '添加菜单', description: '添加菜单接口' })
  @ApiBody({
    type: AddMenuDto,
    required: true,
    description: '在body中传入参数',
  })
  @ApiResponse({
    status: 200,
    description: '添加菜单响应',
    type: AllMenuDto,
  })
  async addMenu(@Body() addMenuDto: AddMenuDto) {
    const menu = await this.menuService.addMenu(addMenuDto);
    return MyResponse.success<AllMenuDto>('添加菜单成功', menu);
  }
  @Put()
  @ApiOperation({ summary: '修改菜单', description: '修改菜单接口' })
  @ApiBody({
    type: UpdateMenuDto,
    required: true,
    description: '在body中传入参数',
  })
  @ApiResponse({
    status: 200,
    description: '添加菜单响应',
    type: AllMenuDto,
  })
  async updateMenu(@Body() updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuService.updateMenu(updateMenuDto);
    if (!menu) {
      return MyResponse.success<AllMenuDto>('更新菜单失败', menu);
    }
    return MyResponse.success<AllMenuDto>('更新菜单成功', menu);
  }
  @Get('/tree')
  @ApiQuery({ name: 'menuName', description: '菜单名', required: false })
  @ApiResponse({
    status: 200,
    description: '响应结果',
    type: [MenuTreeDto],
  })
  async getMenuTree(@Query('menuName') menuName?: string) {
    const menuTree = await this.menuService.getMenuTree(menuName);
    return MyResponse.success('查询成功', menuTree);
  }
  @Get('/routers')
  async getUserMenu(@Req() req: any) {
    const menuTree = await this.menuService.getUserRouters(req.user);
    return MyResponse.success('查询成功', menuTree);
  }
  @Get('/:id')
  @ApiParam({ name: 'id', description: '带单Id' })
  @ApiResponse({
    status: 200,
    type: AllMenuDto,
  })
  async getMenuById(@Param('id') id: number) {
    const menu = await this.menuService.getMenuById(id);
    return MyResponse.success('查询菜单成功', menu);
  }
  @Delete('/:id')
  @ApiParam({ name: 'id', description: '要删除的菜单id' })
  @ApiResponse({
    type: MyResponse,
  })
  async delMenuById(@Param('id') id: number) {
    const res = await this.menuService.delMenuById(id);
    if (res.affected !== 1) {
      return MyResponse.badRequest(`id ${id} 菜单不存在`);
    }
    return MyResponse.success('删除成功');
  }
}
