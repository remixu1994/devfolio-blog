import { seedPosts } from '@devfolio-blog/content-data';
import type { CreatePostDto, Locale, PublicPost, SeriesSummary, TagSummary, UpdatePostDto } from '@devfolio-blog/shared-types';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostTranslationEntity } from './entities/post-translation.entity';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService implements OnModuleInit {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.postRepository.count();

    if (count > 0) {
      return;
    }

    await this.postRepository.save(seedPosts.map((post) => this.toEntity(post)));
  }

  async getAllPosts(): Promise<PublicPost[]> {
    const posts = await this.findAllEntities();
    return posts.flatMap((post) => this.toPublicPosts(post));
  }

  async getPublishedPosts(locale?: Locale): Promise<PublicPost[]> {
    const posts = await this.getAllPosts();
    return posts.filter((post) => post.published && (!locale || post.locale === locale));
  }

  async getPostBySlug(slug: string, locale?: Locale): Promise<PublicPost | undefined> {
    const post = await this.postRepository.findOne({
      where: { slug },
      relations: { translations: true },
    });

    if (!post) {
      return undefined;
    }

    return this.toPublicPosts(post).find((item) => !locale || item.locale === locale);
  }

  async createPost(payload: CreatePostDto): Promise<PublicPost> {
    const post = this.postRepository.create({
      slug: payload.slug,
      status: payload.published ? 'published' : 'draft',
      seriesName: payload.series,
      tags: payload.tags,
      heroImage: payload.heroImage,
      translations: [this.toTranslation(payload)],
    });
    const saved = await this.postRepository.save(post);
    return this.toPublicPosts(saved)[0];
  }

  async updatePost(id: string, payload: UpdatePostDto): Promise<PublicPost> {
    const current = await this.postRepository.findOne({
      where: { id },
      relations: { translations: true },
    });

    if (!current) {
      throw new NotFoundException(`Post ${id} was not found.`);
    }

    if (payload.slug !== undefined) {
      current.slug = payload.slug;
    }
    if (payload.tags !== undefined) {
      current.tags = payload.tags;
    }
    if (payload.heroImage !== undefined) {
      current.heroImage = payload.heroImage;
    }
    if (payload.series !== undefined) {
      current.seriesName = payload.series;
    }
    if (payload.published !== undefined) {
      current.status = payload.published ? 'published' : 'draft';
    }

    const locale = payload.locale ?? current.translations[0]?.locale ?? 'zh';
    let translation = current.translations.find((item) => item.locale === locale);

    if (!translation) {
      translation = this.toTranslation({
        locale,
        title: payload.title ?? '',
        summary: payload.summary ?? '',
        body: payload.body ?? '',
      });
      current.translations.push(translation);
    } else {
      if (payload.title !== undefined) {
        translation.title = payload.title;
      }
      if (payload.summary !== undefined) {
        translation.summary = payload.summary;
      }
      if (payload.body !== undefined) {
        translation.body = payload.body;
      }
    }

    const saved = await this.postRepository.save(current);
    const updated = this.toPublicPosts(saved).find((post) => post.locale === locale);

    if (!updated) {
      throw new NotFoundException(`Post ${id} translation was not found.`);
    }

    return updated;
  }

  async getTagSummaries(): Promise<TagSummary[]> {
    const counts = new Map<string, number>();

    for (const post of await this.getPublishedPosts()) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
  }

  async getSeriesSummaries(): Promise<SeriesSummary[]> {
    const counts = new Map<string, number>();

    for (const post of await this.getPublishedPosts()) {
      if (!post.series) {
        continue;
      }
      counts.set(post.series, (counts.get(post.series) ?? 0) + 1);
    }

    return [...counts.entries()].map(([name, count]) => ({
      name,
      count,
      description: `${name} series`,
    }));
  }

  private async findAllEntities(): Promise<PostEntity[]> {
    return this.postRepository.find({
      relations: { translations: true },
      order: { updatedAt: 'DESC' },
    });
  }

  private toEntity(post: PublicPost): PostEntity {
    return this.postRepository.create({
      id: post.id,
      slug: post.slug,
      status: post.status,
      seriesName: post.series,
      tags: post.tags,
      heroImage: post.heroImage,
      translations: [this.toTranslation(post)],
    });
  }

  private toTranslation(payload: Pick<PublicPost | CreatePostDto, 'locale' | 'title' | 'summary' | 'body'>): PostTranslationEntity {
    const translation = new PostTranslationEntity();
    translation.locale = payload.locale;
    translation.title = payload.title;
    translation.summary = payload.summary;
    translation.body = payload.body;
    return translation;
  }

  private toPublicPosts(post: PostEntity): PublicPost[] {
    return post.translations.map((translation) => ({
      id: post.id,
      slug: post.slug,
      locale: translation.locale,
      title: translation.title,
      summary: translation.summary,
      body: translation.body,
      tags: post.tags ?? [],
      heroImage: post.heroImage,
      updatedAt: post.updatedAt.toISOString().slice(0, 10),
      published: post.status === 'published',
      status: post.status,
      series: post.seriesName,
    }));
  }
}
