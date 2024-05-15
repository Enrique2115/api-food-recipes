import { Column, Entity } from 'typeorm';

import { BaseRepository } from '@src/utils/base-repository';

@Entity('recipe')
export class Recipe extends BaseRepository {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  ingredients: string;

  @Column()
  instructions: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  video: string;

  @Column({ nullable: true })
  image: string;
}
