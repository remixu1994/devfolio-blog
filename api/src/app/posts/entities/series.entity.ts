import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('series')
export class SeriesEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column('text')
  description!: string;
}
