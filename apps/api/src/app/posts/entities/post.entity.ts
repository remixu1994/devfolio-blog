import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PostTranslationEntity } from './post-translation.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ default: 'draft' })
  status!: 'draft' | 'published';

  @Column({ nullable: true })
  seriesName?: string;

  @Column('simple-array', { default: '' })
  tags!: string[];

  @Column()
  heroImage!: string;

  @OneToMany(() => PostTranslationEntity, (translation) => translation.post, {
    cascade: true,
  })
  translations!: PostTranslationEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
