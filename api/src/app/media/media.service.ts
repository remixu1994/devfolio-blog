import type { MediaAssetDto } from '@devfolio-blog/shared-types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import type { UploadedMediaFile } from './uploaded-media-file';

@Injectable()
export class MediaService {
  static ensureUploadDirectory(): string {
    const target = join(process.cwd(), 'storage', 'media');

    if (!existsSync(target)) {
      mkdirSync(target, { recursive: true });
    }

    return target;
  }

  registerUpload(file?: UploadedMediaFile): MediaAssetDto {
    if (!file) {
      throw new BadRequestException('No file was uploaded.');
    }

    return {
      id: randomUUID(),
      fileName: file.filename,
      url: `/media/${file.filename}`,
      mimeType: file.mimetype,
      createdAt: new Date().toISOString(),
    };
  }
}
