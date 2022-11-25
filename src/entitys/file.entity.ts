import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './Base';
@Entity('file')
export class FileEntity extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    nullable: true,
  })
  name: string;
  @Column({
    name: 'file_name',
    nullable: true,
  })
  fileName: string;
  @Column({
    name: 'path',
    nullable: true,
  })
  path: string;
}
