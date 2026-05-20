import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { getBlogListViewModel, getLocale } from '../site-content';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="grid gap-8">
      <div class="border-b border-[color:var(--border-color)] bg-[rgba(255,252,246,0.72)] px-5 py-8 md:px-8">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div class="max-w-3xl">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">Moon DevBlogs</p>
            <h1 class="mt-4 font-[var(--font-display)] text-4xl font-semibold leading-tight md:text-6xl">
              {{ viewModel().dictionary.blog.title }}
            </h1>
            <p class="mt-4 text-base leading-8 text-[color:var(--muted)]">
              {{ viewModel().dictionary.blog.intro }}
            </p>
          </div>
          <div class="min-w-40 border-l border-[color:var(--border-color)] pl-5">
            <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">Published</p>
            <p class="mt-2 text-4xl font-semibold">{{ viewModel().items.length }}</p>
          </div>
        </div>

        <div class="mt-7 flex flex-wrap gap-2">
          @for (topic of viewModel().topics; track topic.name) {
            <span class="border border-[color:var(--border-color)] bg-white px-3 py-2 text-xs text-[color:var(--muted)]">
              {{ topic.name }} / {{ topic.count }}
            </span>
          }
        </div>
      </div>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div class="grid gap-8">
        @if (viewModel().items.length === 0) {
          <p class="border border-[color:var(--border-color)] bg-white px-5 py-8 text-sm text-[color:var(--muted)]">
            {{ viewModel().dictionary.blog.empty }}
          </p>
        }

        @if (viewModel().highlightedPost; as item) {
          <div>
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Highlights</p>
            <a
              [routerLink]="['/', locale(), 'blog', item.slug]"
              class="mt-4 grid overflow-hidden border border-[color:var(--border-color)] bg-white transition hover:border-[color:var(--accent)] md:grid-cols-[minmax(0,1fr)_18rem]"
            >
              <div class="p-6 md:p-8">
                <div class="flex flex-wrap items-center gap-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                  <span>{{ item.updatedAt }}</span>
                  @if (item.series) {
                    <span class="text-[color:var(--accent)]">{{ item.series }}</span>
                  }
                </div>
                <h2 class="mt-4 font-[var(--font-display)] text-3xl font-semibold leading-tight md:text-4xl">
                  {{ item.title }}
                </h2>
                <p class="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
                  {{ item.summary }}
                </p>
                <div class="mt-6 flex flex-wrap gap-2">
                  @for (tag of item.tags; track tag) {
                    <span class="bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent)]">{{ tag }}</span>
                  }
                </div>
              </div>
              <div class="min-h-56 bg-[color:var(--surface-strong)]">
                <img [src]="item.heroImage" [alt]="item.title" class="h-full min-h-56 w-full object-cover" />
              </div>
            </a>
          </div>
        }

        @if (viewModel().latestPosts.length > 0) {
          <div>
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Latest posts</p>
            <div class="mt-4 divide-y divide-[color:var(--border-color)] border-y border-[color:var(--border-color)] bg-white">
              @for (item of viewModel().latestPosts; track item.id) {
                <a
                  [routerLink]="['/', locale(), 'blog', item.slug]"
                  class="grid gap-4 px-5 py-6 transition hover:bg-[color:var(--panel)] md:grid-cols-[8rem_minmax(0,1fr)]"
                >
                  <div class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                    <p>{{ item.updatedAt }}</p>
                    @if (item.series) {
                      <p class="mt-2 text-[color:var(--accent)]">{{ item.series }}</p>
                    }
                  </div>
                  <div>
                    <h2 class="text-2xl font-semibold leading-snug">{{ item.title }}</h2>
                    <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ item.summary }}</p>
                    <div class="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-xs text-[color:var(--muted)]">
                      @for (tag of item.tags; track tag) {
                        <span>{{ tag }}</span>
                      }
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }
        </div>

        <aside class="grid content-start gap-6">
          <section class="border border-[color:var(--border-color)] bg-white p-5">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Series</p>
            <div class="mt-4 grid gap-3">
              @for (item of viewModel().series; track item.name) {
                <div class="flex items-center justify-between gap-4 border-b border-[color:var(--border-color)] pb-3 text-sm last:border-b-0 last:pb-0">
                  <span class="font-medium">{{ item.name }}</span>
                  <span class="font-[var(--font-mono)] text-xs text-[color:var(--muted)]">{{ item.count }}</span>
                </div>
              }
            </div>
          </section>

          <section class="border border-[color:var(--border-color)] bg-[rgba(255,252,246,0.82)] p-5">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">All topics</p>
            <div class="mt-4 flex flex-wrap gap-2">
              @for (topic of viewModel().topics; track topic.name) {
                <span class="bg-white px-3 py-2 text-xs text-[color:var(--muted)]">{{ topic.name }}</span>
              }
            </div>
          </section>
        </aside>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly parentParamMap = toSignal((this.route.parent?.paramMap ?? this.route.paramMap), {
    initialValue: (this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap),
  });

  readonly locale = computed(() => getLocale(this.parentParamMap().get('locale')));
  readonly viewModel = computed(() => getBlogListViewModel(this.locale()));
}
