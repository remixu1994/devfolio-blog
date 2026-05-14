import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getLocale, getResumeViewModel } from '../site-content';

@Component({
  standalone: true,
  template: `
    <section class="rounded-[32px] border border-[color:var(--border-color)] bg-white/78 p-8">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            {{ viewModel().dictionary.resume.title }}
          </p>
          <h1 class="mt-4 font-[var(--font-display)] text-4xl font-semibold">{{ viewModel().resume.headline }}</h1>
          <p class="mt-3 text-base text-[color:var(--muted)]">{{ viewModel().resume.intro }}</p>
        </div>
        <a
          href="/resume/moon-devfolio-resume.pdf"
          class="rounded-full border border-[color:var(--border-color)] px-5 py-3 text-sm font-medium"
        >
          {{ viewModel().dictionary.resume.download }}
        </a>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 class="font-[var(--font-display)] text-2xl font-semibold">Experience</h2>
          <div class="mt-5 grid gap-6">
            @for (item of viewModel().resume.experiences; track item.company + item.role) {
              <article class="rounded-[24px] border border-[color:var(--border-color)] bg-[color:var(--panel)] p-6">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 class="text-xl font-semibold">{{ item.role }}</h3>
                    <p class="text-sm text-[color:var(--muted)]">{{ item.company }}</p>
                  </div>
                  <span class="font-[var(--font-mono)] text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ item.period }}</span>
                </div>
                <p class="mt-4 text-sm leading-7 text-[color:var(--muted)]">{{ item.summary }}</p>
                <ul class="mt-4 grid gap-2 text-sm leading-7 text-[color:var(--ink)]">
                  @for (highlight of item.highlights; track highlight) {
                    <li>• {{ highlight }}</li>
                  }
                </ul>
              </article>
            }
          </div>
        </div>

        <div>
          <h2 class="font-[var(--font-display)] text-2xl font-semibold">Capabilities</h2>
          <div class="mt-5 grid gap-4">
            @for (group of viewModel().resume.skillGroups; track group.title) {
              <article class="rounded-[24px] border border-[color:var(--border-color)] bg-[color:var(--panel)] p-6">
                <h3 class="text-lg font-semibold">{{ group.title }}</h3>
                <div class="mt-4 flex flex-wrap gap-2">
                  @for (item of group.items; track item) {
                    <span class="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent)]">{{ item }}</span>
                  }
                </div>
              </article>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumePageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly locale = computed(() => getLocale(this.route.parent?.snapshot.paramMap.get('locale')));
  readonly viewModel = computed(() => getResumeViewModel(this.locale()));
}
