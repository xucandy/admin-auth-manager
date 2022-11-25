import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: '用户名',
  })
  @MaxLength(16)
  @MinLength(4)
  username: string;
  @ApiProperty({
    description: '用户中文名',
  })
  @MaxLength(20)
  @IsNotEmpty()
  nickname: string;
  @ApiProperty({
    description: '手机号',
  })
  @IsPhoneNumber('CN')
  phone: string;
  @ApiProperty({
    description: '头像',
  })
  avatar: string;
  @ApiProperty({
    description: '部门id',
  })
  @IsNumber()
  deptId: number;
}

export class AddUserDto extends UserDto {
  @ApiProperty({
    description: '密码',
  })
  password: string;
  @ApiProperty({
    description: '关联角色id',
  })
  @IsArray({})
  roles: number[];
}
export class UpdateUserDto extends UserDto {
  @ApiProperty({
    description: '部门id',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @ApiProperty({
    description: '密码',
  })
  password: string;
  @ApiProperty({
    description: '关联角色id',
  })
  @ApiProperty({
    description: '关联角色',
  })
  @IsArray()
  roles: number[];
}
export class GetOneUserDto extends UpdateUserDto {
  @ApiProperty({
    description: '创建时间',
  })
  createTime: Date;
  @ApiProperty({
    description: '更新时间',
  })
  updateTime: Date;
}
export class GetUserListDto extends UserDto {
  @ApiProperty({
    description: '部门id',
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

export class ChangeUserBasicDto {
  @IsNotEmpty()
  id: number;
  @ApiProperty({
    description: '用户名',
  })
  @MaxLength(16)
  @MinLength(4)
  username: string;
  @ApiProperty({
    description: '用户中文名',
  })
  @MaxLength(20)
  @IsNotEmpty()
  nickname: string;
  @ApiProperty({
    description: '手机号',
  })
  @IsPhoneNumber('CN')
  phone: string;
  @ApiProperty({
    description: '头像',
  })
  @IsNotEmpty()
  avatar: string;
}
