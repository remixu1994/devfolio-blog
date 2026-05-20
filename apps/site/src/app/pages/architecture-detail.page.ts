import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { getArchitectureDetailViewModel, getLocale } from '../site-content';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (viewModel(); as vm) {
      <section class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <a [routerLink]="['/', locale(), 'architecture']" class="text-sm text-[color:var(--accent)]"><- Back</a>
          <h1 class="mt-4 font-[var(--font-display)] text-4xl font-semibold">{{ vm.item.title }}</h1>
          <p class="mt-4 text-base leading-8 text-[color:var(--muted)]">{{ vm.item.summary }}</p>
          <div class="mt-6 flex flex-wrap gap-2">
            @for (tag of vm.item.tags; track tag) {
              <span class="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent)]">{{ tag }}</span>
            }
          </div>
          <article
            class="mt-8 rounded-[28px] border border-[color:var(--border-color)] bg-white/80 p-6 text-sm leading-8 text-[color:var(--muted)]"
            [innerHTML]="html()"
          ></article>
        </div>

        <aside class="rounded-[28px] border border-[color:var(--border-color)] bg-[color:var(--panel)] p-6">
          <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Challenge</p>
          <p class="mt-3 text-sm leading-7 text-[color:var(--ink)]">{{ vm.item.challenge }}</p>
          <h2 class="mt-6 text-xl font-semibold">{{ vm.dictionary.topic.stack }}</h2>
          <div class="mt-4 flex flex-wrap gap-2">
            @for (tech of vm.item.stack; track tech) {
              <span class="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent)]">{{ tech }}</span>
            }
          </div>
          <h2 class="mt-6 text-xl font-semibold">Outcomes</h2>
          <ul class="mt-4 grid gap-2 text-sm leading-7 text-[color:var(--muted)]">
            @for (outcome of vm.item.outcomes; track outcome) {
              <li>• {{ outcome }}</li>
            }
          </ul>
        </aside>
      </section>
    } @else {
      <p>Case not found.</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchitectureDetailPageComponent {
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
    getArchitectureDetailViewModel(this.locale(), this.paramMap().get('slug') ?? ''),
  );
  readonly html = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.viewModel()?.html ?? ''),
  );
}
