import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { parseRecipeMarkdown } from '@devfolio-blog/markdown';
import type { Locale, RecipeDetail, RecipeQuery, RecipeSummary } from '@devfolio-blog/shared-types';
import { catchError, combineLatest, forkJoin, map, of, startWith } from 'rxjs';

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
    const normalizedQuery = { ...query, locale };
    return combineLatest([this.listFromMd(normalizedQuery), this.listFromApi(normalizedQuery)]).pipe(
      map(([mdItems, apiItems]) => {
        const bySlug = new Map<string, RecipeSummary>();
        for (const item of mdItems) bySlug.set(item.slug, item);
        for (const item of apiItems) {
          if (!bySlug.has(item.slug)) bySlug.set(item.slug, item);
        }
        return paginateRecipes([...bySlug.values()], normalizedQuery);
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

  private listFromMd(query: RecipeQuery & { locale: Locale }) {
    const { locale } = query;
    const matched = mdRecipes.filter((item) => item.locale === locale);
    if (matched.length === 0) return of([] as RecipeSummary[]);
    return forkJoin(matched.map((item) => this.fetchMd(item.markdownUrl))).pipe(
      map((items) => items.map((item) => toSummary(item)).filter((item) => matchesRecipeQuery(item, query))),
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

    return this.http.get<RecipeSummary[]>('/api/public/recipes', { params }).pipe(
      map((items) => (Array.isArray(items) ? items.filter((item) => matchesRecipeQuery(item, query)) : [])),
      catchError(() => of([] as RecipeSummary[])),
      startWith([] as RecipeSummary[]),
    );
  }

  private getFromApi(slug: string, locale: Locale) {
    const params = new HttpParams().set('locale', locale);
    return this.http.get<RecipeDetail>(`/api/public/recipes/${slug}`, { params }).pipe(
      map((item) => item ?? null),
      catchError(() => of(null)),
      startWith(null),
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

function matchesRecipeQuery(item: RecipeSummary, query: RecipeQuery): boolean {
  if (query.category && item.category !== query.category) return false;
  if (query.tag && !item.tags.includes(query.tag)) return false;

  const search = query.search?.trim().toLowerCase();
  if (!search) return true;

  const haystack = [item.title, item.summary, item.category, ...item.tags].join(' ').toLowerCase();
  return haystack.includes(search);
}

function paginateRecipes(items: RecipeSummary[], query: RecipeQuery): RecipeSummary[] {
  const pageSize = query.pageSize && query.pageSize > 0 ? Math.floor(query.pageSize) : undefined;
  if (!pageSize) return items;

  const page = query.page && query.page > 0 ? Math.floor(query.page) : 1;
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
