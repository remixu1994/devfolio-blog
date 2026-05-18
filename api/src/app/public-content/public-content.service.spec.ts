import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaAssetEntity } from '../posts/entities/media-asset.entity';
import { PostTranslationEntity } from '../posts/entities/post-translation.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { SeriesEntity } from '../posts/entities/series.entity';
import { TagEntity } from '../posts/entities/tag.entity';
import { PostsModule } from '../posts/posts.module';
import { PostsService } from '../posts/posts.service';
import { PublicContentService } from './public-content.service';

describe('PublicContentService', () => {
  let service: PublicContentService;
  let postsService: PostsService;

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
      providers: [PublicContentService],
    }).compile();

    service = moduleRef.get(PublicContentService);
    postsService = moduleRef.get(PostsService);
    await postsService.onModuleInit();
  });

  it('returns featured payload with recent posts', async () => {
    const featured = await service.getFeatured('zh');
    expect(featured.metrics.length).toBeGreaterThan(0);
    expect(featured.recentPosts.length).toBeGreaterThan(0);
  });

  it('returns a published post by slug', async () => {
    const post = await service.getPost('nx-monorepo-for-content-platforms', 'zh');
    expect(post.slug).toBe('nx-monorepo-for-content-platforms');
  });
});
