import { Controller, Get, Param, Query } from '@nestjs/common';
import type { RecipeCategory, RecipeQuery, RecipeTag } from '@devfolio-blog/shared-types';
import { normalizeLocale } from '@devfolio-blog/i18n';
import { PublicContentService } from './public-content.service';

@Controller('public')
export class PublicContentController {
  constructor(private readonly publicContentService: PublicContentService) {}

  @Get('posts')
  getPosts(@Query('locale') locale?: string) {
    return this.publicContentService.getPosts(locale);
  }

  @Get('posts/:slug')
  getPost(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.publicContentService.getPost(slug, locale);
  }

  @Get('series')
  getSeries() {
    return this.publicContentService.getSeries();
  }

  @Get('tags')
  getTags() {
    return this.publicContentService.getTags();
  }

  @Get('featured')
  getFeatured(@Query('locale') locale?: string) {
    return this.publicContentService.getFeatured(locale);
  }

  @Get('recipes')
  getRecipes(
    @Query('locale') locale?: string,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const normalizedQuery: RecipeQuery = {
      locale: locale ? normalizeLocale(locale) : undefined,
      category: normalizeCategory(category),
      tag: normalizeTag(tag),
      search,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    };

    return this.publicContentService.getRecipes({
      ...normalizedQuery,
    });
  }

  @Get('recipes/:slug')
  getRecipe(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.publicContentService.getRecipe(slug, locale);
  }
}

function normalizeCategory(value?: string): RecipeCategory | undefined {
  if (value === 'muscle' || value === 'fat-loss' || value === 'balanced') {
    return value;
  }
  return undefined;
}

function normalizeTag(value?: string): RecipeTag | undefined {
  if (value === 'high-protein' || value === 'low-fat' || value === 'quick') {
    return value;
  }
  return undefined;
}
