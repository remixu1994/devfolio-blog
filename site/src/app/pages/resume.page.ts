import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import type {
  ResumeProject,
  ResumeProjectShowcaseBlock,
  ResumeProjectShowcaseSection,
} from '@devfolio-blog/shared-types';
import { getLocale, getResumeViewModel } from '../site-content';

interface ShowcaseBlockGroup {
  key: string;
  blocks: ResumeProjectShowcaseBlock[];
}

@Component({
  standalone: true,
  template: `
    <section class="grid gap-8">

      <!-- ======== Page Header: Name, headline, intro + profile sidebar + hero metrics ======== -->
      <header class="border border-[color:var(--border-color)] bg-white">
        <div class="grid gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <!-- Left: Title, name, headline, intro paragraph -->
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

          <!-- Right sidebar: Personal profile info (location, gender, age, driving license) + download button -->
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

        <!-- Hero metrics bar: Key numbers displayed at the bottom of the header (e.g. years of experience, projects delivered) -->
        <div class="grid border-t border-[color:var(--border-color)] md:grid-cols-3">
          @for (metric of viewModel().resume.heroMetrics; track metric.label) {
            <div class="border-b border-[color:var(--border-color)] px-6 py-5 md:border-b-0 md:border-r md:last:border-r-0">
              <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ metric.label }}</p>
              <p class="mt-2 text-3xl font-semibold">{{ metric.value }}</p>
            </div>
          }
        </div>
      </header>

      <!-- ======== Main Content: Left column (main articles) + Right sidebar ======== -->
      <section class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div class="grid gap-8">
          <!-- Section: Professional Summary — Bullet-point overview of career highlights -->
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

          <!-- Section: Project Experience — Detailed project cards with role, tech stack, highlights, and optional showcase -->
          <article class="border border-[color:var(--border-color)] bg-white p-6 md:p-8">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
              {{ viewModel().resume.labels.projectExperience }}
            </p>
            <div class="mt-6 grid gap-5">
              @for (project of viewModel().resume.projects; track project.title) {
                <section class="border border-[color:var(--border-color)] bg-[color:var(--panel)] p-5">
                  <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
                    <div>
                      <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">{{ project.role }}</p>
                      <h2 class="mt-2 text-2xl font-semibold leading-snug">{{ project.title }}</h2>
                    </div>
                    <p class="whitespace-nowrap font-[var(--font-mono)] text-xs uppercase tracking-[0.24em] text-[color:var(--muted)] md:text-right">
                      {{ project.period }}
                    </p>
                  </div>
                  <p class="mt-4 text-sm leading-7 text-[color:var(--muted)]">{{ project.summary }}</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    @for (item of project.stack; track item) {
                      <span class="border border-[color:var(--border-color)] bg-white px-3 py-1 text-xs text-[color:var(--muted)]">{{ item }}</span>
                    }
                  </div>
                  <ul class="mt-4 grid gap-2 text-sm leading-7 text-[color:var(--ink)]">
                    @for (highlight of project.highlights; track highlight) {
                      <li class="flex gap-3">
                        <span class="mt-3 h-1.5 w-1.5 shrink-0 bg-[color:var(--accent)]"></span>
                        <span>{{ highlight }}</span>
                      </li>
                    }
                  </ul>

                  @if (project.showcase; as showcase) {
                    <div class="mt-5 border-t border-[color:var(--border-color)] pt-5">
                      <button
                        type="button"
                        (click)="toggleProjectShowcase(showcase.id, showcase.defaultSectionKey)"
                        class="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[color:var(--accent-strong)]"
                      >
                        {{ isShowcaseOpen(showcase.id) ? showcase.collapseLabel : showcase.entryLabel }}
                      </button>
                    </div>
                  }
                </section>
              }
            </div>
          </article>

          <!-- Section: Employment History — Timeline of past roles with company, period, and key achievements -->
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

          <!-- Section: Competences / Skills — Grouped skill tags organized by category -->
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

        <!-- ======== Right Sidebar: Education, Languages, and Focus area ======== -->
        <aside class="grid content-start gap-6">
          <!-- Sidebar: Education — School name, degree, and time period -->
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

          <!-- Sidebar: Languages — Spoken languages with proficiency levels -->
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

          <!-- Sidebar: Focus — Current career focus area (dark highlight card) -->
          <section class="border border-[color:var(--border-color)] bg-[color:var(--ink)] p-6 text-white">
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-white/60">
              {{ viewModel().resume.labels.focus }}
            </p>
            <p class="mt-4 text-2xl font-semibold leading-tight">{{ viewModel().resume.focus }}</p>
          </section>
        </aside>
      </section>

      <!-- ======== Project Showcase Overlay: Slide-in panel for detailed project documentation ======== -->
      @if (activeProjectShowcase(); as showcase) {
        <!-- Backdrop overlay — click to close the showcase panel -->
        <div
          class="fixed inset-0 z-30 bg-[rgba(23,32,51,0.28)] backdrop-blur-[1px]"
          tabindex="0"
          role="button"
          aria-label="Close showcase"
          (click)="closeShowcase()"
          (keydown.enter)="closeShowcase()"
          (keydown.space)="closeShowcase()"
        ></div>

        <!-- Showcase slide-in panel — project title, section title, summary, and close button -->
        <aside
          class="fixed inset-y-0 right-0 z-40 flex w-full max-w-[56rem] flex-col border-l border-[color:var(--border-color)] bg-[color:var(--surface)] shadow-[-24px_0_60px_rgba(23,32,51,0.16)]"
        >
          <header class="border-b border-[color:var(--border-color)] bg-white px-5 py-5 md:px-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
                  {{ activeProjectTitle() }}
                </p>
                <h2 class="mt-3 text-3xl font-semibold text-[color:var(--ink)]">{{ activeSectionTitle() }}</h2>
                <p class="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">{{ activeSectionSummary() }}</p>
              </div>
              <button
                type="button"
                (click)="closeShowcase()"
                class="shrink-0 whitespace-nowrap rounded-full border border-[color:var(--border-color)] px-4 py-2 text-sm font-medium text-[color:var(--muted)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                {{ showcase.collapseLabel }}
              </button>
            </div>
          </header>

          <!-- Section tabs — switch between different showcase sections (e.g. overview, architecture, demo) -->
          <div class="overflow-x-auto border-b border-[color:var(--border-color)] bg-white">
            <div class="inline-flex min-w-full gap-2 px-5 py-4 md:px-8">
              @for (section of showcase.sections; track section.key) {
                <button
                  type="button"
                  (click)="selectShowcaseSection(section.key)"
                  [class]="
                    isSectionActive(section.key)
                      ? 'rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium whitespace-nowrap text-white'
                      : 'rounded-full border border-[color:var(--border-color)] bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-[color:var(--muted)]'
                  "
                >
                  {{ section.title }}
                </button>
              }
            </div>
          </div>

          <!-- Showcase content area — status badge + content blocks (image, text, or placeholder) -->
          <div class="flex-1 overflow-y-auto px-5 py-5 md:px-8 md:py-7">
            @if (activeShowcaseSection(); as activeSection) {
              <div class="flex flex-wrap items-center gap-3">
                <span
                  class="rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em]"
                  [class]="
                    activeSection.status === 'ready'
                      ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent)]'
                      : 'bg-[rgba(23,32,51,0.08)] text-[color:var(--muted)]'
                  "
                >
                  {{
                    activeSection.status === 'ready'
                      ? viewModel().resume.labels.showcaseReady
                      : viewModel().resume.labels.showcaseComingSoon
                  }}
                </span>
              </div>

              <div class="mt-6 grid gap-5">
                @for (group of groupedShowcaseBlocks(activeSection); track group.key) {
                  <article class="border border-[color:var(--border-color)] bg-white p-4 md:p-5">
                    <div class="grid gap-5">
                      @for (block of group.blocks; track block.title + block.type) {
                        <section class="first:pt-0" [class]="!$first ? 'border-t border-[color:var(--border-color)] pt-5' : ''">
                          @if (block.type === 'image' && block.imageSrc; as imageSrc) {
                            <div class="flex flex-wrap items-center justify-between gap-3">
                              <h4 class="text-lg font-semibold text-[color:var(--ink)]">{{ block.title }}</h4>
                              <button
                                type="button"
                                (click)="openImagePreview(imageSrc)"
                                class="text-sm font-medium text-[color:var(--accent)] transition hover:text-[color:var(--ink)]"
                              >
                                {{ viewModel().resume.labels.openImage }}
                              </button>
                            </div>
                            @if (block.body) {
                              <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">{{ block.body }}</p>
                            }
                            <div class="group relative mt-4 overflow-hidden border border-[color:var(--border-color)] bg-[color:var(--panel)]">
                              <img [src]="imageSrc" [alt]="block.imageAlt || block.title" class="w-full object-cover" />
                              <button
                                type="button"
                                (click)="openImagePreview(imageSrc)"
                                class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--ink)]/72 text-white shadow-lg ring-1 ring-white/25 backdrop-blur transition duration-200 hover:scale-105 hover:bg-[color:var(--ink)]/84 max-md:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                                aria-label="放大预览图片"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  class="h-5 w-5"
                                >
                                  <circle cx="11" cy="11" r="5" />
                                  <path d="M20 20l-4.2-4.2" />
                                  <path d="M11 8.5v5" />
                                  <path d="M8.5 11h5" />
                                </svg>
                              </button>
                            </div>
                            @if (block.caption) {
                              <p class="mt-3 text-xs leading-6 text-[color:var(--muted)]">{{ block.caption }}</p>
                            }
                          } @else if (block.type === 'text') {
                            <h4 class="text-lg font-semibold text-[color:var(--ink)]">{{ block.title }}</h4>
                            @if (block.body) {
                              <p class="mt-3 whitespace-pre-line text-sm leading-7 text-[color:var(--muted)]">{{ block.body }}</p>
                            }
                          } @else {
                            <div class="border border-dashed border-[color:var(--border-color)] bg-[rgba(255,252,246,0.86)] p-4">
                              <h4 class="text-lg font-semibold text-[color:var(--ink)]">{{ block.title }}</h4>
                              @if (block.body) {
                                <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">{{ block.body }}</p>
                              }
                            </div>
                          }
                        </section>
                      }
                    </div>
                  </article>
                }
              </div>
            }
          </div>
        </aside>
      }

      <!-- Full-page image preview overlay -->
      @if (previewImageSrc(); as previewSrc) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          tabindex="0"
          role="button"
          aria-label="Close image preview"
          (click)="onImagePreviewOverlayClick($event)"
          (keydown.enter)="closeImagePreview()"
          (keydown.space)="closeImagePreview()"
        >
          <button
            type="button"
            (click)="closeImagePreview()"
            class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
          <img
            [src]="previewSrc"
            alt="Preview"
            class="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumePageComponent {
  // --- Route & locale resolution ---
  private readonly route = inject(ActivatedRoute);
  private readonly parentParamMap = toSignal((this.route.parent?.paramMap ?? this.route.paramMap), {
    initialValue: (this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap),
  });

  readonly locale = computed(() => getLocale(this.parentParamMap().get('locale')));
  readonly viewModel = computed(() => getResumeViewModel(this.locale()));

  // --- Showcase panel state ---
  readonly openShowcaseId = signal<string | null>(null);
  readonly activeSectionKey = signal<string | null>(null);

  // --- Image preview state ---
  readonly previewImageSrc = signal<string | null>(null);

  // --- Showcase toggle & section selection ---
  toggleProjectShowcase(showcaseId: string, defaultSectionKey: string) {
    if (this.openShowcaseId() === showcaseId) {
      this.openShowcaseId.set(null);
      this.activeSectionKey.set(null);
      return;
    }

    this.openShowcaseId.set(showcaseId);
    this.activeSectionKey.set(defaultSectionKey);
  }

  selectShowcaseSection(sectionKey: string) {
    this.activeSectionKey.set(sectionKey);
  }

  isShowcaseOpen(showcaseId: string) {
    return this.openShowcaseId() === showcaseId;
  }

  isSectionActive(sectionKey: string) {
    return this.activeSectionKey() === sectionKey;
  }

  closeShowcase() {
    this.openShowcaseId.set(null);
    this.activeSectionKey.set(null);
  }

  // --- Image preview ---
  openImagePreview(src: string) {
    this.previewImageSrc.set(src);
  }

  closeImagePreview() {
    this.previewImageSrc.set(null);
  }

  onImagePreviewOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeImagePreview();
    }
  }

  // --- Active showcase data accessors ---
  activeProject(): ResumeProject | null {
    const showcaseId = this.openShowcaseId();
    if (!showcaseId) {
      return null;
    }

    return (
      this.viewModel().resume.projects.find((project) => project.showcase?.id === showcaseId) ?? null
    );
  }

  activeProjectShowcase() {
    return this.activeProject()?.showcase ?? null;
  }

  activeProjectTitle() {
    return this.activeProject()?.title ?? '';
  }

  activeShowcaseSection(): ResumeProjectShowcaseSection | null {
    const showcase = this.activeProjectShowcase();
    if (!showcase) {
      return null;
    }

    const sectionKey = this.activeSectionKey() ?? showcase.defaultSectionKey;
    return showcase.sections.find((section) => section.key === sectionKey) ?? showcase.sections[0] ?? null;
  }

  activeSectionTitle() {
    return this.activeShowcaseSection()?.title ?? '';
  }

  activeSectionSummary() {
    return this.activeShowcaseSection()?.summary ?? '';
  }

  groupedShowcaseBlocks(section: ResumeProjectShowcaseSection): ShowcaseBlockGroup[] {
    const groups: ShowcaseBlockGroup[] = [];

    for (const block of section.blocks) {
      const groupKey = block.groupKey;
      const previousGroup = groups[groups.length - 1];

      if (groupKey && previousGroup?.key === groupKey) {
        previousGroup.blocks.push(block);
        continue;
      }

      groups.push({
        key: groupKey ?? `${block.type}-${block.title}`,
        blocks: [block],
      });
    }

    return groups;
  }
}
