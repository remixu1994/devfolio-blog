import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import type { RecipeCategory, RecipeDifficulty, RecipeSummary, RecipeTag } from '@devfolio-blog/shared-types';
import { getLocale } from '../site-content';
import { RecipeRepository } from '../recipes/recipe.repository';

type CategoryFilter = 'all' | RecipeCategory;
type TagFilter = 'all' | RecipeTag;

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="grid gap-6">
      <article class="border border-(--border-color) bg-[rgba(255,250,243,0.92)] p-6 sm:rounded-[28px] md:p-8">
        <p class="font-(--font-mono) text-[11px] uppercase tracking-[0.32em] text-(--accent)">
          {{ locale() === 'zh' ? 'Recipe Collection' : 'Recipe Collection' }}
        </p>
        <h1 class="mt-4 font-(family-name:--font-display) text-4xl font-semibold text-(--ink) md:text-6xl">
          {{ locale() === 'zh' ? '食谱分享' : 'Recipes' }}
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-8 text-(--muted)">
          {{
            locale() === 'zh'
              ? '记录我在增肌、减脂和日常均衡饮食中的高复用食谱，方便长期执行。'
              : 'A practical collection of repeatable meals for muscle gain, fat loss, and balanced daily nutrition.'
          }}
        </p>
      </article>

      <section class="grid gap-4 border border-(--border-color) bg-white p-5 sm:rounded-[20px] md:grid-cols-2">
        <article>
          <p class="font-(--font-mono) text-[10px] uppercase tracking-[0.26em] text-(--muted)">
            {{ locale() === 'zh' ? '分类' : 'Category' }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            @for (item of categoryOptions(); track item.value) {
              <button
                type="button"
                (click)="selectedCategory.set(item.value)"
                class="rounded-full border px-3 py-1.5 text-xs transition"
                [style.borderColor]="selectedCategory() === item.value ? 'var(--accent)' : 'var(--border-color)'"
                [style.color]="selectedCategory() === item.value ? 'var(--accent)' : 'var(--muted)'"
                [style.backgroundColor]="selectedCategory() === item.value ? 'rgba(15,91,216,0.08)' : 'var(--panel)'"
              >
                {{ item.label }} ({{ item.count }})
              </button>
            }
          </div>
        </article>

        <article>
          <p class="font-(--font-mono) text-[10px] uppercase tracking-[0.26em] text-(--muted)">
            {{ locale() === 'zh' ? '标签' : 'Tags' }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            @for (item of tagOptions(); track item.value) {
              <button
                type="button"
                (click)="selectedTag.set(item.value)"
                class="rounded-full border px-3 py-1.5 text-xs transition"
                [style.borderColor]="selectedTag() === item.value ? 'var(--accent)' : 'var(--border-color)'"
                [style.color]="selectedTag() === item.value ? 'var(--accent)' : 'var(--muted)'"
                [style.backgroundColor]="selectedTag() === item.value ? 'rgba(15,91,216,0.08)' : 'var(--panel)'"
              >
                {{ item.label }} ({{ item.count }})
              </button>
            }
          </div>
        </article>
      </section>

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        @for (card of filteredCards(); track card.slug) {
          <article class="border border-(--border-color) bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(23,24,28,0.08)] sm:rounded-[18px]">
            <a [routerLink]="['/', locale(), 'recipes', card.slug]" class="block">
            <div class="h-32 rounded-xl border border-dashed border-(--border-color) bg-(--panel)"></div>
            <div class="mt-4 flex items-start justify-between gap-3">
              <h2 class="text-lg font-semibold text-(--ink)">{{ card.title }}</h2>
              <span class="rounded-full bg-(--panel) px-2.5 py-1 text-[10px] text-(--muted)">{{ categoryLabel(card.category) }}</span>
            </div>
            <p class="mt-2 text-sm leading-7 text-(--muted)">{{ card.summary }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              @for (tag of card.tags; track tag) {
                <span class="rounded-full border border-(--border-color) bg-white px-2.5 py-1 text-[10px] text-(--muted)">{{ tagLabel(tag) }}</span>
              }
            </div>
            <div class="mt-4 grid grid-cols-3 gap-2 text-xs text-(--muted)">
              <div class="rounded-lg bg-(--panel) px-2 py-2 text-center">
                {{ locale() === 'zh' ? '时长' : 'Time' }}<br />
                <strong class="text-(--ink)">{{ card.durationMinutes }}m</strong>
              </div>
              <div class="rounded-lg bg-(--panel) px-2 py-2 text-center">
                {{ locale() === 'zh' ? '难度' : 'Level' }}<br />
                <strong class="text-(--ink)">{{ difficultyLabel(card.difficulty) }}</strong>
              </div>
              <div class="rounded-lg bg-(--panel) px-2 py-2 text-center">
                {{ locale() === 'zh' ? '热量' : 'Kcal' }}<br />
                <strong class="text-(--ink)">{{ card.calories ?? '-' }}</strong>
              </div>
            </div>
            </a>
          </article>
        }
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly parentParamMap = toSignal(this.route.parent?.paramMap ?? this.route.paramMap, {
    initialValue: this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap,
  });

  readonly locale = computed(() => getLocale(this.parentParamMap().get('locale')));
  readonly cards = toSignal(
    toObservable(this.locale).pipe(
      switchMap((locale) => this.recipeRepository.listRecipes({ locale })),
    ),
    { initialValue: [] as RecipeSummary[] },
  );

  readonly selectedCategory = signal<CategoryFilter>('all');
  readonly selectedTag = signal<TagFilter>('all');

  readonly categoryOptions = computed(() => {
    const cards = this.cards();
    const keys: RecipeCategory[] = ['muscle', 'fat-loss', 'balanced'];
    const base = [{ value: 'all' as const, label: this.locale() === 'zh' ? '全部' : 'All', count: cards.length }];
    return [
      ...base,
      ...keys.map((key) => ({ value: key, label: this.categoryLabel(key), count: cards.filter((item) => item.category === key).length })),
    ];
  });

  readonly tagOptions = computed(() => {
    const cards = this.cards();
    const keys: RecipeTag[] = ['high-protein', 'low-fat', 'quick'];
    const base = [{ value: 'all' as const, label: this.locale() === 'zh' ? '全部' : 'All', count: cards.length }];
    return [
      ...base,
      ...keys.map((key) => ({ value: key, label: this.tagLabel(key), count: cards.filter((item) => item.tags.includes(key)).length })),
    ];
  });

  readonly filteredCards = computed(() =>
    this.cards().filter((card) => {
      const categoryMatches = this.selectedCategory() === 'all' || card.category === this.selectedCategory();
      const selectedTag = this.selectedTag();
      const tagMatches = selectedTag === 'all' || card.tags.includes(selectedTag);
      return categoryMatches && tagMatches;
    }),
  );

  categoryLabel(value: RecipeCategory) {
    if (this.locale() === 'zh') {
      return value === 'muscle' ? '增肌' : value === 'fat-loss' ? '减脂' : '均衡';
    }
    return value === 'muscle' ? 'Muscle' : value === 'fat-loss' ? 'Fat Loss' : 'Balanced';
  }

  tagLabel(value: RecipeTag) {
    if (this.locale() === 'zh') {
      if (value === 'high-protein') return '高蛋白';
      if (value === 'low-fat') return '低脂';
      return '快手';
    }
    if (value === 'high-protein') return 'High Protein';
    if (value === 'low-fat') return 'Low Fat';
    return 'Quick';
  }

  difficultyLabel(value: RecipeDifficulty) {
    if (this.locale() === 'zh') {
      if (value === 'easy') return '简单';
      if (value === 'medium') return '中等';
      return '困难';
    }
    if (value === 'easy') return 'Easy';
    if (value === 'medium') return 'Medium';
    return 'Hard';
  }
}
