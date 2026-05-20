import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('admin/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Post()
  createPost(@Body() payload: CreatePostDto) {
    return this.postsService.createPost(payload);
  }

  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() payload: UpdatePostDto) {
    return this.postsService.updatePost(id, payload);
  }
}
