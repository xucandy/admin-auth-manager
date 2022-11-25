import { RoleEntity } from './role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { DeptEntity } from './dept.entity';
@Entity('sys_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column({
    nullable: true,
  })
  nickname: string;
  @Column()
  password: string;
  @Column({
    nullable: true,
  })
  phone: string;
  @Column()
  avatar: string;
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
  @ManyToOne(() => DeptEntity)
  @JoinTable({
    joinColumn: {
      name: 'dept_id',
    },
  })
  dept: DeptEntity;
  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];
}
