import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';
import type { UploadedMediaFile } from './uploaded-media-file';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

function sanitizeBaseName(name: string): string {
  return name
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 80);
}

@Controller('admin/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_request, file, callback) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
          callback(new Error(`Unsupported file type: ${file.mimetype}`), false);
          return;
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          callback(null, MediaService.ensureUploadDirectory());
        },
        filename: (_request, file, callback) => {
          const originalExt = extname(file.originalname).toLowerCase();
          const safeExt = /^[.][a-z0-9]+$/.test(originalExt) ? originalExt : '';
          const rawBaseName = file.originalname.replace(extname(file.originalname), '');
          const safeBaseName = sanitizeBaseName(rawBaseName) || 'upload';
          callback(null, `${Date.now()}-${safeBaseName}${safeExt}`);
        },
      }),
    }),
  )
  uploadMedia(@UploadedFile() file?: UploadedMediaFile) {
    return this.mediaService.registerUpload(file);
  }
}
