import { Column } from 'typeorm';

export class BaseModel {
  @Column({
    name: 'create_time',
  })
  createTime: Date;
  @Column({
    name: 'update_time',
  })
  updateTime: Date;
}
