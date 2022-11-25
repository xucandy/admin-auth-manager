import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_dept')
export class DeptEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    name: 'parent_id',
    nullable: true,
  })
  parentId: number;
  @Column({
    nullable: true,
  })
  name: string;
  @Column({
    default: null,
    nullable: true,
  })
  ancestors: string;
  @Column()
  sort: number;
  @Column({
    name: 'data_status',
    comment: '1启用,0停用,-1删除',
    nullable: true,
  })
  dataStatus: number;
  @Column({
    name: 'create_time',
  })
  createTime: Date;
  @Column({
    name: 'update_time',
  })
  updateTime: Date;
  children: DeptEntity[];
}
