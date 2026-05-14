import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(() => {
    service = new PostsService();
  });

  it('returns published posts by locale', () => {
    const posts = service.getPublishedPosts('zh');
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.locale === 'zh')).toBe(true);
  });

  it('creates a post with draft or published status', () => {
    const post = service.createPost({
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

    expect(post.status).toBe('published');
    expect(service.getAllPosts()[0]?.slug).toBe('new-post');
  });
});
