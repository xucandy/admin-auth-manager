import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class DeptDto {
  @ApiProperty({
    description: '父节点id',
    required: false,
    default: 0,
  })
  @IsNumber()
  parentId: number;
  @ApiProperty({
    description: '部门名称',
  })
  @MaxLength(20)
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    description: '当前节点的所有父节点id',
    required: false,
  })
  ancestors: string;
  @ApiProperty({
    description: '排序',
  })
  sort: number;
}

export class AddDeptDto extends DeptDto {}
export class UpdateDeptDto extends DeptDto {
  @ApiProperty({
    description: '部门id',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
export class AllDeptDto extends UpdateDeptDto {
  @ApiProperty({
    description: '创建时间',
  })
  createTime: Date;
  @ApiProperty({
    description: '更新时间',
  })
  updateTime: Date;
}
