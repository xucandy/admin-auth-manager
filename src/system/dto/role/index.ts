import { AllMenuDto } from '../menu';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class RoleDto {
  @ApiProperty({
    description: '角色编码',
    example: 'admin',
  })
  @MaxLength(10)
  @IsNotEmpty()
  roleName: string;
  @ApiProperty({
    description: '角色描述',
  })
  @MaxLength(20)
  @IsNotEmpty()
  roleDesc: string;
}
export class AddRoleDto extends RoleDto {
  @ApiProperty({
    description: '关联菜单',
    example: [],
  })
  @IsArray()
  menus: AllMenuDto[];
}
export class UpdateRoleDto extends RoleDto {
  @ApiProperty({
    description: '角色id',
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @ApiProperty({
    description: '关联菜单',
    example: [],
  })
  @IsArray()
  menus: number[];
}
export class GetOneRoleDto extends UpdateRoleDto {
  @ApiProperty({
    description: '创建时间',
  })
  createTime: Date;
  @ApiProperty({
    description: '更新时间',
  })
  updateTime: Date;
}
export class getListRoleDto extends RoleDto {
  @ApiProperty({
    description: '角色id',
  })
  id: number;
  @ApiProperty({
    description: '创建时间',
  })
  createTime: Date;
  @ApiProperty({
    description: '更新时间',
  })
  updateTime: Date;
}
