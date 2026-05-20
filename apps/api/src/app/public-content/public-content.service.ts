import { getFeaturedPayload } from '@devfolio-blog/content-data';
import { normalizeLocale } from '@devfolio-blog/i18n';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class PublicContentService {
  constructor(private readonly postsService: PostsService) {}

  async getPosts(locale?: string) {
    return this.postsService.getPublishedPosts(locale ? normalizeLocale(locale) : undefined);
  }

  async getPost(slug: string, locale?: string) {
    const post = await this.postsService.getPostBySlug(slug, locale ? normalizeLocale(locale) : undefined);

    if (!post || !post.published) {
      throw new NotFoundException(`Post ${slug} was not found.`);
    }

    return post;
  }

  async getSeries() {
    return this.postsService.getSeriesSummaries();
  }

  async getTags() {
    return this.postsService.getTagSummaries();
  }

  async getFeatured(locale?: string) {
    const normalizedLocale = normalizeLocale(locale);
    const featured = getFeaturedPayload(normalizedLocale);

    return {
      ...featured,
      recentPosts: (await this.postsService.getPublishedPosts(normalizedLocale)).slice(0, 3),
    };
  }
}
