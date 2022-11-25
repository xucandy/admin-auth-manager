import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('login_log')
export class LoginLogEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    nullable: true,
  })
  os: string;
  @Column({
    nullable: true,
  })
  browser: string;
  @Column({
    nullable: true,
  })
  ua: string;
  @Column({
    nullable: true,
  })
  ip: string;
  @Column({
    nullable: true,
  })
  location: string;
  @Column({
    name: 'user_id',
    nullable: true,
  })
  userId: number;
  @Column({
    name: 'login_time',
    nullable: true,
  })
  loginTime: Date;
}
