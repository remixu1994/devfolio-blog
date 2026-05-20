import { Controller, Get, Param, Query } from '@nestjs/common';
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
}
