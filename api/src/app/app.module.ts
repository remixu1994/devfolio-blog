import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { PostsModule } from './posts/posts.module';
import { PublicContentModule } from './public-content/public-content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PostsModule,
    MediaModule,
    PublicContentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
