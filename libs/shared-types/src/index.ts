export type Locale = 'zh' | 'en';

export interface StaticContentFrontmatter {
  slug: string;
  locale: Locale;
  title: string;
  summary: string;
  heroImage: string;
  updatedAt: string;
  tags: string[];
  published: boolean;
}

export interface HeroMetric {
  label: string;
  value: string;
}

export interface ResumeExperience {
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
}

export interface ResumeSkillGroup {
  title: string;
  items: string[];
}

export interface ResumeProfile {
  locale: Locale;
  headline: string;
  location: string;
  contactEmail: string;
  intro: string;
  heroMetrics: HeroMetric[];
  experiences: ResumeExperience[];
  skillGroups: ResumeSkillGroup[];
}

export interface ArchitectureCase extends StaticContentFrontmatter {
  challenge: string;
  stack: string[];
  outcomes: string[];
  body: string;
}

export interface TopicShowcase extends StaticContentFrontmatter {
  eyebrow: string;
  cta: string;
  sections: {
    title: string;
    description: string;
  }[];
  body: string;
}

export type PostStatus = 'draft' | 'published';

export interface PublicPost extends StaticContentFrontmatter {
  id: string;
  body: string;
  series?: string;
  status: PostStatus;
}

export interface PublicPostSummary extends Omit<PublicPost, 'body'> {}

export interface FeaturedPayload {
  metrics: HeroMetric[];
  featuredCases: ArchitectureCase[];
  recentPosts: PublicPostSummary[];
  topicCards: TopicShowcase[];
}

export interface CreatePostDto {
  slug: string;
  locale: Locale;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  heroImage: string;
  published?: boolean;
  series?: string;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export interface TagSummary {
  name: string;
  count: number;
}

export interface SeriesSummary {
  name: string;
  description: string;
  count: number;
}

export interface MediaAssetDto {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  createdAt: string;
}
