import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      name: 'devfolio-blog-api',
      status: 'ok',
      modules: ['auth', 'posts', 'media', 'public-content'],
      timestamp: new Date().toISOString(),
    };
  }
}
