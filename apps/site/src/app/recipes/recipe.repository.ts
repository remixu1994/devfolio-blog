import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { parseRecipeMarkdown } from '@devfolio-blog/markdown';
import type { Locale, RecipeDetail, RecipeQuery, RecipeSummary } from '@devfolio-blog/shared-types';
import { catchError, combineLatest, forkJoin, map, of, switchMap } from 'rxjs';

type MdRecipeSource = {
  slug: string;
  locale: Locale;
  markdownUrl: string;
};

const mdRecipes: MdRecipeSource[] = [
  { slug: 'hairtail', locale: 'zh', markdownUrl: '/recipes/hairtail.md' },
];

@Injectable({ providedIn: 'root' })
export class RecipeRepository {
  private readonly http = inject(HttpClient);

  listRecipes(query: RecipeQuery) {
    const locale = query.locale ?? 'zh';
    return combineLatest([this.listFromMd(locale), this.listFromApi(query)]).pipe(
      map(([mdItems, apiItems]) => {
        const bySlug = new Map<string, RecipeSummary>();
        for (const item of mdItems) bySlug.set(item.slug, item);
        for (const item of apiItems) {
          if (!bySlug.has(item.slug)) bySlug.set(item.slug, item);
        }
        return [...bySlug.values()];
      }),
    );
  }

  getRecipeBySlug(slug: string, locale: Locale) {
    return combineLatest([this.getFromMd(slug, locale), this.getFromApi(slug, locale)]).pipe(
      map(([mdItem, apiItem]) => {
        if (mdItem && apiItem) {
          return mergeRecipeDetail(mdItem, apiItem);
        }
        return mdItem ?? apiItem;
      }),
    );
  }

  private listFromMd(locale: Locale) {
    const matched = mdRecipes.filter((item) => item.locale === locale);
    if (matched.length === 0) return of([] as RecipeSummary[]);
    return forkJoin(matched.map((item) => this.fetchMd(item.markdownUrl))).pipe(
      map((items) => items.map((item) => toSummary(item))),
      catchError(() => of([] as RecipeSummary[])),
    );
  }

  private getFromMd(slug: string, locale: Locale) {
    const source = mdRecipes.find((item) => item.slug === slug && item.locale === locale);
    if (!source) return of(null);
    return this.fetchMd(source.markdownUrl).pipe(
      map((item) => item),
      catchError(() => of(null)),
    );
  }

  private fetchMd(url: string) {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((markdown) => parseRecipeMarkdown(markdown)),
    );
  }

  private listFromApi(query: RecipeQuery) {
    let params = new HttpParams();
    if (query.locale) params = params.set('locale', query.locale);
    if (query.category) params = params.set('category', query.category);
    if (query.tag) params = params.set('tag', query.tag);
    if (query.search) params = params.set('search', query.search);
    if (query.page) params = params.set('page', String(query.page));
    if (query.pageSize) params = params.set('pageSize', String(query.pageSize));

    return this.http.get<RecipeSummary[]>('/api/public/recipes', { params }).pipe(
      map((items) => (Array.isArray(items) ? items : [])),
      catchError(() => of([] as RecipeSummary[])),
    );
  }

  private getFromApi(slug: string, locale: Locale) {
    const params = new HttpParams().set('locale', locale);
    return this.http.get<RecipeDetail>(`/api/public/recipes/${slug}`, { params }).pipe(
      map((item) => item ?? null),
      catchError(() => of(null)),
    );
  }
}

function toSummary(item: RecipeDetail): RecipeSummary {
  return {
    slug: item.slug,
    locale: item.locale,
    title: item.title,
    summary: item.summary,
    category: item.category,
    tags: item.tags,
    durationMinutes: item.durationMinutes,
    difficulty: item.difficulty,
    calories: item.calories,
    coverImage: item.coverImage,
    updatedAt: item.updatedAt,
    source: item.source,
  };
}

function mergeRecipeDetail(mdItem: RecipeDetail, apiItem: RecipeDetail): RecipeDetail {
  return {
    ...apiItem,
    ...mdItem,
    coverImage: mdItem.coverImage || apiItem.coverImage,
    calories: mdItem.calories ?? apiItem.calories,
    methodImage: mdItem.methodImage || apiItem.methodImage,
    downloadFileName: mdItem.downloadFileName || apiItem.downloadFileName,
    ingredients: mdItem.ingredients.length ? mdItem.ingredients : apiItem.ingredients,
    seasonings: mdItem.seasonings.length ? mdItem.seasonings : apiItem.seasonings,
    sauce: mdItem.sauce.length ? mdItem.sauce : apiItem.sauce,
    steps: mdItem.steps.length ? mdItem.steps : apiItem.steps,
    tips: mdItem.tips.length ? mdItem.tips : apiItem.tips,
    nutritionNotes: mdItem.nutritionNotes.length ? mdItem.nutritionNotes : apiItem.nutritionNotes,
    html: mdItem.html || apiItem.html,
    source: 'md',
  };
}
