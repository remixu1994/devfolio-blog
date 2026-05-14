import type { Locale } from '@devfolio-blog/shared-types';
import { IsArray, IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  slug!: string;

  @IsString()
  @IsIn(['zh', 'en'])
  locale!: Locale;

  @IsString()
  title!: string;

  @IsString()
  summary!: string;

  @IsString()
  body!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsString()
  heroImage!: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  series?: string;
}
