import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import type { ResumeProject } from '@devfolio-blog/shared-types';
import { ResumeProjectCardComponent } from '../components/resume-project-card.component';
import { ResumeShowcaseDialogComponent } from '../components/resume-showcase-dialog.component';
import { getLocale, getResumeViewModel } from '../site-content';

@Component({
  standalone: true,
  imports: [ResumeProjectCardComponent],
  template: `
    <section class="grid gap-8">
      <header class="border border-[color:var(--border-color)] bg-white">
        <div class="grid gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
              {{ viewModel().resume.title }}
            </p>
            <h1 class="mt-4 font-[var(--font-display)] text-5xl font-semibold leading-tight md:text-7xl">
              {{ viewModel().resume.name }}
            </h1>
            <p class="mt-4 text-2xl font-semibold text-[color:var(--ink)]">{{ viewModel().resume.headline }}</p>
            <p class="mt-5 max-w-4xl text-base leading-8 text-[color:var(--muted)]">{{ viewModel().resume.intro }}</p>
          </div>

          <aside class="border-l border-[color:var(--border-color)] pl-6">
            <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
              {{ viewModel().resume.labels.profile }}
            </p>
            <dl class="mt-5 grid gap-4 text-sm">
              <div>
                <dt class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                  {{ viewModel().resume.labels.location }}
                </dt>
                <dd class="mt-1 font-medium">{{ viewModel().resume.location }}</dd>
              </div>
              <div>
                <dt class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                  {{ viewModel().resume.labels.gender }}
                </dt>
                <dd class="mt-1 font-medium">{{ viewModel().resume.gender }}</dd>
              </div>
              <div>
                <dt class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                  {{ viewModel().resume.labels.age }}
                </dt>
                <dd class="mt-1 font-medium">{{ viewModel().resume.age }}</dd>
              </div>
              <div>
                <dt class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                  {{ viewModel().resume.labels.drivingLicense }}
                </dt>
                <dd class="mt-1 font-medium">{{ viewModel().resume.drivingLicense }}</dd>
              </div>
            </dl>
            <a
              href="/resume/moon-devfolio-resume.pdf"
              class="mt-7 inline-flex border border-[color:var(--border-color)] px-5 py-3 text-sm font-medium transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {{ viewModel().dictionary.resume.download }}
            </a>
          </aside>
        </div>

        <div class="grid border-t border-[color:var(--border-color)] md:grid-cols-3">
          @for (metric of viewModel().resume.heroMetrics; track metric.label) {
            <div class="border-b border-[color:var(--border-color)] px-6 py-5 md:border-b-0 md:border-r md:last:border-r-0">
              <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ metric.label }}</p>
              <p class="mt-2 text-3xl font-semibold">{{ metric.value }}</p>
            </div>
          }
        </div>
      </header>

      <section class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div class="grid gap-8">
          <article class="border border-[color:var(--border-color)] bg-white p-6 md:p-8">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
              {{ viewModel().resume.labels.professionalSummary }}
            </p>
            <div class="mt-6 grid gap-4">
              @for (point of viewModel().resume.summaryPoints; track point) {
                <p class="border-l-2 border-[color:var(--accent)] pl-4 text-sm leading-7 text-[color:var(--muted)]">{{ point }}</p>
              }
            </div>
          </article>

          <article class="border border-[color:var(--border-color)] bg-white p-6 md:p-8">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
              {{ viewModel().resume.labels.projectExperience }}
            </p>
            <div class="mt-6 grid gap-5">
              @for (project of viewModel().resume.projects; track project.title) {
                <app-resume-project-card [project]="project" (openShowcase)="openProjectShowcase(project)" />
              }
            </div>
          </article>

          <article class="border border-[color:var(--border-color)] bg-white p-6 md:p-8">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
              {{ viewModel().resume.labels.employmentHistory }}
            </p>
            <div class="mt-6 divide-y divide-[color:var(--border-color)]">
              @for (item of viewModel().resume.experiences; track item.period + item.role) {
                <section class="grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[9rem_minmax(0,1fr)]">
                  <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">{{ item.period }}</p>
                  <div>
                    <h2 class="text-2xl font-semibold leading-snug">{{ item.role }}</h2>
                    <p class="mt-1 text-sm font-medium text-[color:var(--muted)]">{{ item.company }}</p>
                    <p class="mt-4 text-sm leading-7 text-[color:var(--muted)]">{{ item.summary }}</p>
                    <ul class="mt-4 grid gap-2 text-sm leading-7 text-[color:var(--ink)]">
                      @for (highlight of item.highlights; track highlight) {
                        <li class="flex gap-3">
                          <span class="mt-3 h-1.5 w-1.5 shrink-0 bg-[color:var(--accent)]"></span>
                          <span>{{ highlight }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                </section>
              }
            </div>
          </article>

          <article class="border border-[color:var(--border-color)] bg-white p-6 md:p-8">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
              {{ viewModel().resume.labels.competences }}
            </p>
            <div class="mt-6 grid gap-5 md:grid-cols-2">
              @for (group of viewModel().resume.skillGroups; track group.title) {
                <section class="border-l border-[color:var(--border-color)] pl-4">
                  <h2 class="text-lg font-semibold">{{ group.title }}</h2>
                  <div class="mt-4 flex flex-wrap gap-2">
                    @for (item of group.items; track item) {
                      <span class="bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent)]">{{ item }}</span>
                    }
                  </div>
                </section>
              }
            </div>
          </article>
        </div>

        <aside class="grid content-start gap-6">
          <section class="border border-[color:var(--border-color)] bg-white p-6">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              {{ viewModel().resume.labels.education }}
            </p>
            <div class="mt-5 grid gap-5">
              @for (item of viewModel().resume.education; track item.school) {
                <article>
                  <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">{{ item.period }}</p>
                  <h2 class="mt-2 text-lg font-semibold">{{ item.school }}</h2>
                  <p class="mt-1 text-sm leading-6 text-[color:var(--muted)]">{{ item.degree }}</p>
                </article>
              }
            </div>
          </section>

          <section class="border border-[color:var(--border-color)] bg-[rgba(255,252,246,0.86)] p-6">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              {{ viewModel().resume.labels.languages }}
            </p>
            <div class="mt-5 grid gap-4">
              @for (item of viewModel().resume.languages; track item.name) {
                <div class="flex items-start justify-between gap-4 border-b border-[color:var(--border-color)] pb-4 last:border-b-0 last:pb-0">
                  <h2 class="font-semibold">{{ item.name }}</h2>
                  <p class="max-w-36 text-right text-xs leading-5 text-[color:var(--muted)]">{{ item.proficiency }}</p>
                </div>
              }
            </div>
          </section>

          <section class="border border-[color:var(--border-color)] bg-[color:var(--ink)] p-6 text-white">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-white/60">
              {{ viewModel().resume.labels.focus }}
            </p>
            <p class="mt-4 text-2xl font-semibold leading-tight">{{ viewModel().resume.focus }}</p>
          </section>
        </aside>
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(Dialog);
  private readonly parentParamMap = toSignal(this.route.parent?.paramMap ?? this.route.paramMap, {
    initialValue: this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap,
  });

  readonly locale = computed(() => getLocale(this.parentParamMap().get('locale')));
  readonly viewModel = computed(() => getResumeViewModel(this.locale()));

  openProjectShowcase(project: ResumeProject) {
    if (!project.showcase) {
      return;
    }

    this.dialog.open(ResumeShowcaseDialogComponent, {
      data: {
        project,
        labels: this.viewModel().resume.labels,
      },
      autoFocus: false,
      restoreFocus: true,
      panelClass: 'resume-showcase-dialog-panel',
      backdropClass: 'resume-showcase-dialog-backdrop',
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
    });
  }
}
