import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { RecipeRepository } from '../recipes/recipe.repository';
import { RecipesPageComponent } from './recipes.page';

describe('RecipesPageComponent', () => {
  it('labels all supported difficulty values in Chinese and English', () => {
    const zhParamMap = convertToParamMap({ locale: 'zh' });

    TestBed.configureTestingModule({
      imports: [RecipesPageComponent],
      providers: [
        provideRouter([]),
        { provide: RecipeRepository, useValue: { listRecipes: () => of([]) } },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { paramMap: of(zhParamMap), snapshot: { paramMap: zhParamMap } },
            paramMap: of(zhParamMap),
            snapshot: { paramMap: zhParamMap },
          },
        },
      ],
    });

    const zhFixture = TestBed.createComponent(RecipesPageComponent);
    zhFixture.detectChanges();

    expect(zhFixture.componentInstance.difficultyLabel('easy')).toBe('简单');
    expect(zhFixture.componentInstance.difficultyLabel('medium')).toBe('中等');
    expect(zhFixture.componentInstance.difficultyLabel('hard')).toBe('困难');

    TestBed.resetTestingModule();

    const enParamMap = convertToParamMap({ locale: 'en' });
    TestBed.configureTestingModule({
      imports: [RecipesPageComponent],
      providers: [
        provideRouter([]),
        { provide: RecipeRepository, useValue: { listRecipes: () => of([]) } },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { paramMap: of(enParamMap), snapshot: { paramMap: enParamMap } },
            paramMap: of(enParamMap),
            snapshot: { paramMap: enParamMap },
          },
        },
      ],
    });

    const enFixture = TestBed.createComponent(RecipesPageComponent);
    enFixture.detectChanges();

    expect(enFixture.componentInstance.difficultyLabel('easy')).toBe('Easy');
    expect(enFixture.componentInstance.difficultyLabel('medium')).toBe('Medium');
    expect(enFixture.componentInstance.difficultyLabel('hard')).toBe('Hard');
  });
});
