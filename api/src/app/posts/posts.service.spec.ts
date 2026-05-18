import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaAssetEntity } from './entities/media-asset.entity';
import { PostTranslationEntity } from './entities/post-translation.entity';
import { PostEntity } from './entities/post.entity';
import { SeriesEntity } from './entities/series.entity';
import { TagEntity } from './entities/tag.entity';
import { PostsModule } from './posts.module';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          entities: [PostEntity, PostTranslationEntity, SeriesEntity, TagEntity, MediaAssetEntity],
          synchronize: true,
        }),
        PostsModule,
      ],
    }).compile();

    service = moduleRef.get(PostsService);
    await service.onModuleInit();
  });

  it('returns published posts by locale', async () => {
    const posts = await service.getPublishedPosts('zh');
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.locale === 'zh')).toBe(true);
  });

  it('creates a post with draft or published status', async () => {
    const post = await service.createPost({
      slug: 'new-post',
      locale: 'zh',
      title: 'New Post',
      summary: 'Summary',
      body: 'Body',
      tags: ['Nx'],
      heroImage: '/hero.svg',
      published: true,
      series: 'engineering-foundations',
    });

    const posts = await service.getAllPosts();
    expect(post.status).toBe('published');
    expect(posts.some((item) => item.slug === 'new-post')).toBe(true);
  });
});
