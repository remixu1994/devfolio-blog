import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { getBlogDetailViewModel, getLocale } from '../site-content';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (viewModel(); as vm) {
      <section class="grid gap-8">
        <a [routerLink]="['/', locale(), 'blog']" class="text-sm font-medium text-[color:var(--accent)]"><- Blog</a>

        <header class="grid overflow-hidden border border-[color:var(--border-color)] bg-white lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div class="p-6 md:p-10">
            <div class="flex flex-wrap items-center gap-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
              <span>{{ vm.item.updatedAt }}</span>
              @if (vm.item.series) {
                <span class="text-[color:var(--accent)]">{{ vm.item.series }}</span>
              }
            </div>
            <h1 class="mt-5 font-[var(--font-display)] text-4xl font-semibold leading-tight md:text-6xl">
              {{ vm.item.title }}
            </h1>
            <p class="mt-5 max-w-3xl text-base leading-8 text-[color:var(--muted)] md:text-lg">
              {{ vm.item.summary }}
            </p>
            <div class="mt-7 flex flex-wrap gap-2">
              @for (tag of vm.item.tags; track tag) {
                <span class="bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent)]">{{ tag }}</span>
              }
            </div>
          </div>
          <div class="min-h-64 bg-[color:var(--surface-strong)]">
            <img [src]="vm.item.heroImage" [alt]="vm.item.title" class="h-full min-h-64 w-full object-cover" />
          </div>
        </header>

        <div class="grid gap-8 lg:grid-cols-[minmax(0,44rem)_18rem] lg:items-start">
          <article
            class="bg-white px-6 py-8 text-base leading-8 text-[color:var(--ink)] md:px-10
              [&_a]:text-[color:var(--accent)]
              [&_h2]:mt-10 [&_h2]:font-[var(--font-display)] [&_h2]:text-3xl [&_h2]:font-semibold
              [&_li]:my-2 [&_p]:my-5 [&_p]:text-[color:var(--muted)]
              [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
            [innerHTML]="html()"
          ></article>

          <aside class="grid gap-6">
            <section class="border border-[color:var(--border-color)] bg-[rgba(255,252,246,0.86)] p-5">
              <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Article info</p>
              <dl class="mt-4 grid gap-4 text-sm">
                <div>
                  <dt class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Updated</dt>
                  <dd class="mt-1 font-medium">{{ vm.item.updatedAt }}</dd>
                </div>
                @if (vm.item.series) {
                  <div>
                    <dt class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Series</dt>
                    <dd class="mt-1 font-medium">{{ vm.item.series }}</dd>
                  </div>
                }
              </dl>
            </section>

            @if (vm.relatedPosts.length > 0) {
              <section class="border border-[color:var(--border-color)] bg-white p-5">
                <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Related posts</p>
                <div class="mt-4 divide-y divide-[color:var(--border-color)]">
                  @for (post of vm.relatedPosts; track post.id) {
                    <a [routerLink]="['/', locale(), 'blog', post.slug]" class="block py-4 first:pt-0 last:pb-0">
                      <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ post.updatedAt }}</p>
                      <h2 class="mt-2 text-base font-semibold leading-snug">{{ post.title }}</h2>
                    </a>
                  }
                </div>
              </section>
            }
          </aside>
        </div>
      </section>
    } @else {
      <p class="border border-[color:var(--border-color)] bg-white px-5 py-8 text-sm text-[color:var(--muted)]">
        Post not found.
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly parentParamMap = toSignal((this.route.parent?.paramMap ?? this.route.paramMap), {
    initialValue: (this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap),
  });
  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly locale = computed(() => getLocale(this.parentParamMap().get('locale')));
  readonly viewModel = computed(() =>
    getBlogDetailViewModel(this.locale(), this.paramMap().get('slug') ?? ''),
  );
  readonly html = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.viewModel()?.html ?? ''),
  );
}
