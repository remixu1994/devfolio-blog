import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import type { RecipeDetail } from '@devfolio-blog/shared-types';
import { of } from 'rxjs';
import { RecipeRepository } from '../recipes/recipe.repository';
import { RecipeDetailPageComponent } from './recipe-detail.page';

const recipe: RecipeDetail = {
  slug: 'hairtail',
  locale: 'zh',
  title: '红烧带鱼',
  summary: '测试食谱',
  category: 'balanced',
  tags: ['quick'],
  durationMinutes: 30,
  difficulty: 'easy',
  calories: 520,
  coverImage: '/recipes/hero_hairtail.png',
  updatedAt: '2026-05-21',
  source: 'md',
  servings: '2人份',
  ingredients: [{ name: '带鱼', amount: '500g' }],
  seasonings: [{ name: '盐', amount: '2g' }],
  sauce: [],
  steps: [{ title: '处理', bullets: ['清洗'] }],
  tips: [],
  nutritionNotes: ['低温空气炸。'],
  html: '',
};

describe('RecipeDetailPageComponent', () => {
  it('does not render hardcoded protein/fat/carb macro values', () => {
    const localeParamMap = convertToParamMap({ locale: 'zh' });
    const slugParamMap = convertToParamMap({ slug: 'hairtail' });

    TestBed.configureTestingModule({
      imports: [RecipeDetailPageComponent],
      providers: [
        provideRouter([]),
        { provide: RecipeRepository, useValue: { getRecipeBySlug: () => of(recipe) } },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { paramMap: of(localeParamMap), snapshot: { paramMap: localeParamMap } },
            paramMap: of(slugParamMap),
            snapshot: { paramMap: slugParamMap },
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(RecipeDetailPageComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('520 kcal');
    expect(text).not.toContain('38 g');
    expect(text).not.toContain('30 g');
    expect(text).not.toContain('8 g');
  });
});
