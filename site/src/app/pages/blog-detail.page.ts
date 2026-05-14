import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getBlogDetailViewModel, getLocale } from '../site-content';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (viewModel(); as vm) {
      <section>
        <a [routerLink]="['/', locale(), 'blog']" class="text-sm text-[color:var(--accent)]"><- Back</a>
        <div class="mt-4 rounded-[32px] border border-[color:var(--border-color)] bg-white/80 p-8">
          <div class="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            <span>{{ vm.item.updatedAt }}</span>
            <span>{{ vm.item.tags.join(' / ') }}</span>
          </div>
          <h1 class="mt-4 font-[var(--font-display)] text-4xl font-semibold">{{ vm.item.title }}</h1>
          <p class="mt-4 text-base leading-8 text-[color:var(--muted)]">{{ vm.item.summary }}</p>
          <article
            class="mt-8 text-sm leading-8 text-[color:var(--muted)]"
            [innerHTML]="html()"
          ></article>
        </div>
      </section>
    } @else {
      <p>Post not found.</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly locale = computed(() => getLocale(this.route.parent?.snapshot.paramMap.get('locale')));
  readonly viewModel = computed(() =>
    getBlogDetailViewModel(this.locale(), this.route.snapshot.paramMap.get('slug') ?? ''),
  );
  readonly html = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.viewModel()?.html ?? ''),
  );
}
