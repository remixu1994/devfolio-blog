import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('post_translations')
export class PostTranslationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  locale!: 'zh' | 'en';

  @Column()
  title!: string;

  @Column()
  summary!: string;

  @Column('text')
  body!: string;

  @ManyToOne(() => PostEntity, (post) => post.translations, {
    onDelete: 'CASCADE',
  })
  post!: PostEntity;
}
