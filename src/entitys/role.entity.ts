import { MenuEntity } from './menu.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('sys_role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    name: 'role_name',
    unique: true,
    nullable: true,
  })
  roleName: string;
  @Column({
    name: 'role_desc',
    unique: true,
    nullable: true,
  })
  roleDesc: string;
  @Column({
    name: 'data_status',
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
  @ManyToMany(() => MenuEntity)
  @JoinTable()
  menus: MenuEntity[];
  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
