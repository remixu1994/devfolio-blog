import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { getLocale } from '../site-content';
import { RecipeRepository } from '../recipes/recipe.repository';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (recipe(); as item) {
      <section class="grid gap-6">
        <section class="rounded-[28px] border border-(--border-color) bg-white p-4 md:p-6">
          <a [routerLink]="['/', locale(), 'recipes']" class="text-sm text-(--muted) hover:text-(--accent)">
            {{ locale() === 'zh' ? '← 返回所有食谱' : '← Back to all recipes' }}
          </a>
          <div class="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <article class="rounded-2xl bg-[color:var(--panel)] p-5 md:p-7">
              <h1 class="text-[2rem] font-semibold leading-tight text-(--ink) md:text-[3.25rem]">{{ item.title }}</h1>
              <p class="mt-4 text-sm leading-7 text-(--muted) md:text-base">{{ item.summary }}</p>
              <div class="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div class="rounded-xl border border-(--border-color) bg-white px-3 py-3 text-center">
                  <p class="text-xs text-(--muted)">{{ locale() === 'zh' ? '份量' : 'Servings' }}</p>
                  <p class="mt-1 text-sm font-semibold text-(--ink)">{{ item.servings }}</p>
                </div>
                <div class="rounded-xl border border-(--border-color) bg-white px-3 py-3 text-center">
                  <p class="text-xs text-(--muted)">{{ locale() === 'zh' ? '总用时' : 'Total Time' }}</p>
                  <p class="mt-1 text-sm font-semibold text-(--ink)">{{ item.durationMinutes }}m</p>
                </div>
                <div class="rounded-xl border border-(--border-color) bg-white px-3 py-3 text-center">
                  <p class="text-xs text-(--muted)">{{ locale() === 'zh' ? '难度' : 'Level' }}</p>
                  <p class="mt-1 text-sm font-semibold text-(--ink)">{{ item.difficulty }}</p>
                </div>
                <div class="rounded-xl border border-(--border-color) bg-white px-3 py-3 text-center">
                  <p class="text-xs text-(--muted)">Kcal</p>
                  <p class="mt-1 text-sm font-semibold text-(--ink)">{{ item.calories ?? '-' }}</p>
                </div>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                @for (tag of item.tags; track tag) {
                  <span class="rounded-full bg-white px-3 py-1 text-xs text-(--muted)">{{ tag }}</span>
                }
              </div>
            </article>
            <article class="overflow-hidden rounded-2xl">
              <img [src]="item.coverImage || item.methodImage || '/recipes/hero_hairtail.png'" [alt]="item.title" class="h-full min-h-[330px] w-full object-cover" />
            </article>
          </div>
        </section>

        <section class="grid gap-6 lg:grid-cols-[1.28fr_0.72fr]">
          <div class="grid gap-6">
            <section class="rounded-[24px] border border-(--border-color) bg-white p-5 md:p-6">
              <h2 class="text-2xl font-semibold text-(--ink)">{{ locale() === 'zh' ? '食材清单' : 'Ingredients' }}</h2>
              <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article class="rounded-xl border border-(--border-color) p-4">
                  <h3 class="text-base font-semibold">{{ locale() === 'zh' ? '主食材' : 'Main' }}</h3>
                  <ul class="mt-2 space-y-1.5 text-sm text-(--muted)">
                    @for (line of item.ingredients; track line.name + line.amount) {
                      <li>{{ line.name }} · {{ line.amount }}</li>
                    }
                  </ul>
                </article>
                <article class="rounded-xl border border-(--border-color) p-4">
                  <h3 class="text-base font-semibold">{{ locale() === 'zh' ? '腌制调料' : 'Seasoning' }}</h3>
                  <ul class="mt-2 space-y-1.5 text-sm text-(--muted)">
                    @for (line of item.seasonings; track line.name + line.amount) {
                      <li>{{ line.name }} · {{ line.amount }}</li>
                    }
                  </ul>
                </article>
                <article class="rounded-xl border border-(--border-color) p-4">
                  <h3 class="text-base font-semibold">{{ locale() === 'zh' ? '红烧汁' : 'Sauce' }}</h3>
                  <ul class="mt-2 space-y-1.5 text-sm text-(--muted)">
                    @for (line of item.sauce; track line.name + line.amount) {
                      <li>{{ line.name }} · {{ line.amount }}</li>
                    }
                  </ul>
                </article>
                <article class="rounded-xl border border-(--border-color) p-4">
                  <h3 class="text-base font-semibold">{{ locale() === 'zh' ? '表面用油' : 'Oil' }}</h3>
                  <p class="mt-2 text-sm text-(--muted)">菜籽油/橄榄油 · 6g</p>
                  <p class="mt-2 text-xs text-(--muted)">{{ locale() === 'zh' ? '薄薄一层即可' : 'Brush a thin layer only' }}</p>
                </article>
              </div>
            </section>

            <section class="rounded-[24px] border border-(--border-color) bg-white p-5 md:p-6">
              <h2 class="text-2xl font-semibold text-(--ink)">{{ locale() === 'zh' ? '制作步骤' : 'Steps' }}</h2>
              <div class="mt-5 grid gap-5">
                @for (step of item.steps; track step.title; let index = $index) {
                  <section class="grid gap-3 md:grid-cols-[minmax(0,1fr)_300px]">
                    <article class="rounded-xl border border-(--border-color) p-4">
                      <div class="flex items-start gap-3">
                        <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-xs font-semibold text-white">{{ index + 1 }}</span>
                        <div>
                          <h3 class="text-xl font-semibold text-(--ink)">{{ step.title }}</h3>
                          <ul class="mt-2 space-y-2 text-sm leading-7 text-(--muted)">
                            @for (bullet of step.bullets; track bullet) {
                              <li>• {{ bullet }}</li>
                            }
                          </ul>
                        </div>
                      </div>
                    </article>
                    <article class="overflow-hidden rounded-xl border border-(--border-color) bg-(--panel)">
                      <img [src]="item.methodImage || item.coverImage || '/recipes/hero_hairtail.png'" [alt]="step.title" class="h-full min-h-[170px] w-full object-cover" />
                    </article>
                  </section>
                }
              </div>
            </section>
          </div>

          <aside class="grid gap-4">
            <section class="rounded-2xl border border-(--border-color) bg-white p-4">
              <h3 class="text-2xl font-semibold text-(--ink)">{{ locale() === 'zh' ? '营养亮点' : 'Nutrition Notes' }}</h3>
              <ul class="mt-3 space-y-2 text-sm text-(--muted)">
                @for (note of item.nutritionNotes; track note) { <li>• {{ note }}</li> }
              </ul>
              <table class="mt-4 w-full text-sm">
                <tbody>
                  <tr class="border-t border-(--border-color)"><td class="py-2 text-(--muted)">热量</td><td class="py-2 text-right font-semibold">{{ item.calories ?? '-' }} kcal</td></tr>
                  <tr class="border-t border-(--border-color)"><td class="py-2 text-(--muted)">蛋白质</td><td class="py-2 text-right font-semibold">38 g</td></tr>
                  <tr class="border-t border-(--border-color)"><td class="py-2 text-(--muted)">脂肪</td><td class="py-2 text-right font-semibold">30 g</td></tr>
                  <tr class="border-t border-(--border-color)"><td class="py-2 text-(--muted)">碳水</td><td class="py-2 text-right font-semibold">8 g</td></tr>
                </tbody>
              </table>
            </section>
            <section class="rounded-2xl border border-(--border-color) bg-white p-4">
              <h3 class="text-2xl font-semibold text-(--ink)">{{ locale() === 'zh' ? '关键提示' : 'Tips' }}</h3>
              <ul class="mt-3 space-y-2 text-sm text-(--muted)">
                @for (tip of item.tips; track tip) { <li>✓ {{ tip }}</li> }
              </ul>
            </section>
            <section class="rounded-2xl border border-(--border-color) bg-white p-4">
              <h3 class="text-2xl font-semibold text-(--ink)">{{ locale() === 'zh' ? '你可能还喜欢' : 'You may also like' }}</h3>
              <div class="mt-3 grid grid-cols-3 gap-2">
                @for (rec of recommendations; track rec.title) {
                  <article>
                    <img [src]="rec.image" [alt]="rec.title" class="h-20 w-full rounded-lg object-cover" />
                    <p class="mt-1 text-xs font-semibold">{{ rec.title }}</p>
                    <p class="text-[11px] text-(--muted)">{{ rec.meta }}</p>
                  </article>
                }
              </div>
            </section>
            <section class="rounded-2xl border border-(--border-color) bg-white p-4">
              <h3 class="text-2xl font-semibold text-(--ink)">{{ locale() === 'zh' ? '操作小贴士' : 'Cooking Tips' }}</h3>
              <div class="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-(--muted)">
                <p>空炸低温</p><p>短时收汁</p><p>最后加醋</p>
              </div>
              @if (item.methodImage) {
                <a class="mt-4 inline-flex rounded-full bg-(--accent) px-4 py-2 text-sm text-white" [href]="item.methodImage" [attr.download]="item.downloadFileName || (item.slug + '-steps.png')">
                  {{ locale() === 'zh' ? '下载做法图' : 'Download Image' }}
                </a>
              }
            </section>
          </aside>
        </section>
      </section>
    } @else {
      <p>{{ locale() === 'zh' ? '食谱不存在或加载失败。' : 'Recipe not found.' }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly parentParamMap = toSignal(this.route.parent?.paramMap ?? this.route.paramMap, {
    initialValue: this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap,
  });
  private readonly slugSignal = toSignal(this.route.paramMap.pipe(map((paramMap) => paramMap.get('slug') ?? '')), {
    initialValue: this.route.snapshot.paramMap.get('slug') ?? '',
  });

  readonly locale = computed(() => getLocale(this.parentParamMap().get('locale')));
  readonly recipe = toSignal(
    toObservable(computed(() => ({ locale: this.locale(), slug: this.slugSignal() }))).pipe(
      switchMap(({ locale, slug }) => this.recipeRepository.getRecipeBySlug(slug, locale)),
    ),
    { initialValue: null },
  );

  readonly recommendations = [
    { title: '清蒸带鱼', meta: '25分钟 · 430 kcal', image: '/recipes/hero_hairtail.png' },
    { title: '香煎三文鱼', meta: '20分钟 · 480 kcal', image: '/recipes/hero_hairtail.png' },
    { title: '蒜香梅虾', meta: '15分钟 · 320 kcal', image: '/recipes/hero_hairtail.png' },
  ];
}
