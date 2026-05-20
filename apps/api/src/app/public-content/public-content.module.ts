import { Module } from '@nestjs/common';
import { PostsModule } from '../posts/posts.module';
import { PublicContentController } from './public-content.controller';
import { PublicContentService } from './public-content.service';

@Module({
  imports: [PostsModule],
  controllers: [PublicContentController],
  providers: [PublicContentService],
})
export class PublicContentModule {}
