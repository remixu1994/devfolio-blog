import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { MediaAssetEntity } from './posts/entities/media-asset.entity';
import { PostTranslationEntity } from './posts/entities/post-translation.entity';
import { PostEntity } from './posts/entities/post.entity';
import { SeriesEntity } from './posts/entities/series.entity';
import { TagEntity } from './posts/entities/tag.entity';

const entities = [PostEntity, PostTranslationEntity, SeriesEntity, TagEntity, MediaAssetEntity];

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function createSqliteOptions(config: ConfigService): TypeOrmModuleOptions {
  const databasePath = resolve(config.get<string>('SQLITE_DATABASE') ?? 'storage/devfolio.sqlite');
  mkdirSync(dirname(databasePath), { recursive: true });

  return {
    type: 'sqljs',
    location: databasePath,
    autoSave: true,
    entities,
    synchronize: readBoolean(config.get<string>('DATABASE_SYNCHRONIZE'), true),
  };
}

function createPostgresOptions(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: config.get<string>('DATABASE_URL') ?? 'postgres://postgres:postgres@localhost:5432/devfolio_blog',
    entities,
    synchronize: readBoolean(config.get<string>('DATABASE_SYNCHRONIZE'), true),
  };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseType = config.get<string>('DATABASE_TYPE') ?? 'sqlite';

        return databaseType === 'postgres' ? createPostgresOptions(config) : createSqliteOptions(config);
      },
    }),
  ],
})
export class DatabaseModule {}
