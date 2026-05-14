import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';
import type { UploadedMediaFile } from './uploaded-media-file';

@Controller('admin/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          callback(null, MediaService.ensureUploadDirectory());
        },
        filename: (_request, file, callback) => {
          const safeFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-').toLowerCase()}`;
          callback(null, `${safeFileName.replace(extname(safeFileName), '')}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadMedia(@UploadedFile() file?: UploadedMediaFile) {
    return this.mediaService.registerUpload(file);
  }
}
