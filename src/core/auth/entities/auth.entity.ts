import {
  Column,
  // CreateDateColumn,
  Entity,
  // PrimaryGeneratedColumn,
  // UpdateDateColumn,
} from 'typeorm';

import { BaseRepository } from '@src/utils/base-repository';

@Entity('users')
export class UserEntity extends BaseRepository {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column({
    nullable: true,
  })
  picture: string;

  @Column({
    nullable: true,
  })
  token: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column()
  password: string;

  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updateAt: Date;
}
