import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('media_assets')
export class MediaAssetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fileName!: string;

  @Column()
  originalName!: string;

  @Column()
  mimeType!: string;

  @Column()
  url!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
