import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_menu')
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    nullable: true,
  })
  name: string;
  @Column({
    nullable: true,
  })
  permission: string;
  @Column({
    nullable: true,
  })
  path: string;
  @Column({
    name: 'parent_id',
  })
  parentId: number;
  @Column({
    nullable: true,
  })
  icon: string;
  @Column({
    nullable: true,
  })
  component: string;
  @Column({
    nullable: true,
  })
  type: number;
  @Column()
  sort: number;
  @Column({
    name: 'data_status',
    nullable: true,
  })
  dataStatus: number;
  @Column({
    name: 'layout',
    nullable: true,
    comment: '是否嵌入layout',
  })
  layout: boolean;
  @Column({
    name: 'scope',
    nullable: true,
    comment: '可选值 auth , noAuth , public',
    default: 'auth',
  })
  scope: string;
  @Column({
    name: 'hidden',
    nullable: true,
  })
  hidden: boolean;
  @Column()
  createTime: Date;
  @Column()
  updateTime: Date;
  children?: MenuEntity[];
}
export enum ScopeEnum {
  auth = 'auth',
  noAuth = 'noAuth',
  public = 'public',
}
