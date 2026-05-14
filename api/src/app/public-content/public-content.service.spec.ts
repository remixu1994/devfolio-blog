import { PostsService } from '../posts/posts.service';
import { PublicContentService } from './public-content.service';

describe('PublicContentService', () => {
  let service: PublicContentService;

  beforeEach(() => {
    service = new PublicContentService(new PostsService());
  });

  it('returns featured payload with recent posts', () => {
    const featured = service.getFeatured('zh');
    expect(featured.metrics.length).toBeGreaterThan(0);
    expect(featured.recentPosts.length).toBeGreaterThan(0);
  });

  it('returns a published post by slug', () => {
    const post = service.getPost('nx-monorepo-for-content-platforms', 'zh');
    expect(post.slug).toBe('nx-monorepo-for-content-platforms');
  });
});
