import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getLocale, getTopicViewModel } from '../site-content';

@Component({
  standalone: true,
  template: `
    @if (viewModel(); as vm) {
      <section class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">{{ vm.item.eyebrow }}</p>
          <h1 class="mt-4 font-[var(--font-display)] text-4xl font-semibold">{{ vm.item.title }}</h1>
          <p class="mt-4 text-base leading-8 text-[color:var(--muted)]">{{ vm.item.summary }}</p>
          <article
            class="mt-8 rounded-[28px] border border-[color:var(--border-color)] bg-white/80 p-6 text-sm leading-8 text-[color:var(--muted)]"
            [innerHTML]="html()"
          ></article>
        </div>

        <aside class="rounded-[28px] border border-[color:var(--border-color)] bg-[color:var(--panel)] p-6">
          <h2 class="text-xl font-semibold">{{ vm.dictionary.topic.sections }}</h2>
          <div class="mt-4 grid gap-4">
            @for (section of vm.item.sections; track section.title) {
              <article class="rounded-2xl border border-[color:var(--border-color)] bg-white/70 p-4">
                <h3 class="font-semibold">{{ section.title }}</h3>
                <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ section.description }}</p>
              </article>
            }
          </div>
        </aside>
      </section>
    } @else {
      <p>Topic not found.</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly locale = computed(() => getLocale(this.route.parent?.snapshot.paramMap.get('locale')));
  readonly slug = computed(() => this.route.snapshot.data['slug'] as string);
  readonly viewModel = computed(() => getTopicViewModel(this.locale(), this.slug()));
  readonly html = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.viewModel()?.html ?? ''),
  );
}
