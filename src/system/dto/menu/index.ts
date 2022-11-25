import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ScopeEnum } from '../../../entitys/menu.entity';

export class MenuDto {
  @ApiProperty({
    description: '路由名称，建议唯一',
    example: 'Layout',
    required: true,
  })
  @MaxLength(20)
  name: string;
  @ApiProperty({
    description: '权限码，type button时生效',
    example: '**|**|**',
    required: false,
  })
  permission?: string;
  @ApiProperty({
    description: '路径，建议绝对路径，子菜单的前缀要以父菜单开头',
    example: '/path',
    required: true,
  })
  @MaxLength(50)
  @IsNotEmpty()
  path: string;
  @ApiProperty({
    description: '父节点id ，默认 0 跟节点',
    example: 0,
  })
  @IsNumber()
  parentId?: number;
  @ApiProperty({
    description: '菜单图标 class 名',
    example: 'icon-shezhi',
  })
  @MaxLength(20)
  @MinLength(0)
  icon?: string;
  @ApiProperty({
    description: '组件地址,对应react views下边的文件',
    example: 'system/user/user',
    required: true,
  })
  @MaxLength(50)
  @IsNotEmpty()
  component: string;
  @ApiProperty({
    description: '类型，是页面还是按钮 ,1页面 2 按钮',
    example: '1',
  })
  @IsNumber()
  @IsOptional({})
  type?: number;
  @ApiProperty({
    description: '菜单排序,降序',
    example: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  sort: number;
  @ApiProperty({
    description: '是否嵌入在layout组件中显示，一般一级路由时可配置',
    example: false,
  })
  @IsBoolean()
  layout?: boolean;
  @ApiProperty({
    description:
      '是否鉴权，public:不鉴权，任何时候都可访问，auth：登录之后可访问，noAuth：登陆之后不可访问，default auth',
    required: false,
  })
  @IsEnum(ScopeEnum)
  scope?: string;
  @ApiProperty({
    description: '菜单是否可见 true不可见,false可见',
    example: true,
    required: false,
  })
  hidden?: boolean;
}

export class AddMenuDto extends MenuDto {}
export class UpdateMenuDto extends MenuDto {
  @ApiProperty({
    description: '菜单id 必填',
    example: 1,
  })
  @IsNumber()
  id: number;
}
export class AllMenuDto extends UpdateMenuDto {
  @ApiProperty({
    description: '创建时间',
  })
  createTime: Date;
  @ApiProperty({
    description: '更新时间',
  })
  updateTime: Date;
}
export class MenuTreeDto extends AllMenuDto {
  @ApiProperty({
    description: '菜单的子菜单',
    required: false,
    example: [
      {
        name: 'Layout',
        permission: '**|**|**',
        path: '/path',
        parentId: 0,
        icon: 'icon-shezhi',
        component: 'system/user/user',
        type: 1,
        sort: 0,
        layout: false,
        scope: 'string',
        hidden: true,
        id: 1,
        createTime: '2021-10-23T14:40:26.336Z',
        updateTime: '2021-10-23T14:40:26.336Z',
        children: [],
      },
    ],
  })
  children: MenuTreeDto[];
}
