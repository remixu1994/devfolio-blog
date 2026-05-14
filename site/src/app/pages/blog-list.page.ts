import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getBlogListViewModel, getLocale } from '../site-content';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section>
      <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">{{ viewModel().dictionary.blog.title }}</p>
      <h1 class="mt-4 font-[var(--font-display)] text-4xl font-semibold">{{ viewModel().dictionary.blog.title }}</h1>
      <p class="mt-4 max-w-3xl text-base leading-8 text-[color:var(--muted)]">{{ viewModel().dictionary.blog.intro }}</p>

      <div class="mt-8 grid gap-6">
        @if (viewModel().items.length === 0) {
          <p class="text-sm text-[color:var(--muted)]">{{ viewModel().dictionary.blog.empty }}</p>
        }

        @for (item of viewModel().items; track item.id) {
          <a
            [routerLink]="['/', locale(), 'blog', item.slug]"
            class="rounded-[28px] border border-[color:var(--border-color)] bg-white/80 p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(23,32,51,0.08)]"
          >
            <div class="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              <span>{{ item.updatedAt }}</span>
              <span>{{ item.tags.join(' / ') }}</span>
            </div>
            <h2 class="mt-4 text-2xl font-semibold">{{ item.title }}</h2>
            <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">{{ item.summary }}</p>
          </a>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly locale = computed(() => getLocale(this.route.parent?.snapshot.paramMap.get('locale')));
  readonly viewModel = computed(() => getBlogListViewModel(this.locale()));
}
