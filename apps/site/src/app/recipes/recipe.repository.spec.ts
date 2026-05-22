import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { RecipeDetail, RecipeSummary } from '@devfolio-blog/shared-types';
import { RecipeRepository } from './recipe.repository';

const hairtailMarkdown = `# 空气炸锅低氧化版红烧带鱼

## 基础信息
- slug: hairtail
- locale: zh
- category: balanced
- tags: high-protein,low-fat,quick
- servings: 2人份
- durationMinutes: 30
- difficulty: easy
- calories: 520
- summary: 外微焦、内多汁的低氧化红烧带鱼做法。
- coverImage: /recipes/hero_hairtail.png
- updatedAt: 2026-05-21

## 食材
- 带鱼 | 500g | 4~6段

## 调料
- 盐 | 2g |

## 步骤
### 1. 处理带鱼
- 清洗后吸干水分。
`;

const apiRecipe: RecipeSummary = {
  slug: 'api-only',
  locale: 'zh',
  title: 'API Recipe',
  summary: 'API fallback recipe',
  category: 'balanced',
  tags: ['quick'],
  durationMinutes: 12,
  difficulty: 'medium',
  calories: 300,
  updatedAt: '2026-05-21',
  source: 'api',
};

describe('RecipeRepository', () => {
  let repository: RecipeRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repository = TestBed.inject(RecipeRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('emits markdown recipes before a pending API list response and appends API-only recipes later', () => {
    const emissions: RecipeSummary[][] = [];

    repository.listRecipes({ locale: 'zh' }).subscribe((items) => emissions.push(items));

    const mdRequest = http.expectOne('/recipes/hairtail.md');
    const apiRequest = http.expectOne((request) => request.url === '/api/public/recipes');

    mdRequest.flush(hairtailMarkdown);

    expect(emissions.at(-1)?.map((item) => item.slug)).toEqual(['hairtail']);

    apiRequest.flush([apiRecipe]);

    expect(emissions.at(-1)?.map((item) => item.slug)).toEqual(['hairtail', 'api-only']);
  });

  it('applies query filters and pagination after markdown/API merge', () => {
    const emissions: RecipeSummary[][] = [];

    repository
      .listRecipes({ locale: 'zh', category: 'balanced', tag: 'quick', page: 2, pageSize: 1 })
      .subscribe((items) => emissions.push(items));

    const mdRequest = http.expectOne('/recipes/hairtail.md');
    const apiRequest = http.expectOne((request) => request.url === '/api/public/recipes');

    expect(apiRequest.request.params.has('page')).toBe(false);
    expect(apiRequest.request.params.has('pageSize')).toBe(false);

    mdRequest.flush(hairtailMarkdown);
    apiRequest.flush([apiRecipe]);

    expect(emissions.at(-1)?.map((item) => item.slug)).toEqual(['api-only']);
  });

  it('emits markdown detail before a pending API detail response', () => {
    const emissions: Array<RecipeDetail | null> = [];

    repository.getRecipeBySlug('hairtail', 'zh').subscribe((item) => emissions.push(item));

    const mdRequest = http.expectOne('/recipes/hairtail.md');
    const apiRequest = http.expectOne((request) => request.url === '/api/public/recipes/hairtail');

    mdRequest.flush(hairtailMarkdown);

    expect(emissions.at(-1)?.slug).toBe('hairtail');
    expect(emissions.at(-1)?.source).toBe('md');

    apiRequest.flush({
      ...emissions.at(-1),
      title: 'API Hairtail',
      source: 'api',
    });

    expect(emissions.at(-1)?.title).toBe('空气炸锅低氧化版红烧带鱼');
    expect(emissions.at(-1)?.source).toBe('md');
  });
});
