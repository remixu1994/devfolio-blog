import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { ResumeProjectShowcaseBlock } from '@devfolio-blog/shared-types';
import type {
  ResumeImagePreviewDialogData,
  ResumeShowcaseDialogData,
  ShowcaseBlockGroup,
} from './resume-dialog.models';
import { ResumeImagePreviewDialogComponent } from './resume-image-preview-dialog.component';
import {
  ResumeShowcaseBlockComponent,
  type ResumeShowcaseImagePreviewRequest,
} from './resume-showcase-block.component';

@Component({
  standalone: true,
  selector: 'app-resume-showcase-dialog',
  imports: [ResumeShowcaseBlockComponent],
  host: {
    class: 'block h-full w-full',
  },
  template: `
    @if (showcase(); as showcase) {
      <div
        class="flex h-full w-full justify-end"
        tabindex="0"
        role="button"
        aria-label="Close showcase"
        (click)="onOverlayClick($event)"
        (keydown.enter)="closeDialog()"
        (keydown.space)="onOverlaySpace($event)"
      >
        <aside
          class="flex h-full w-full max-w-[56rem] flex-col border-l border-[color:var(--border-color)] bg-[color:var(--surface)] shadow-[-24px_0_60px_rgba(23,32,51,0.16)]"
        >
          <header class="border-b border-[color:var(--border-color)] bg-white px-5 py-5 md:px-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
                  {{ data.project.title }}
                </p>
                <h2 class="mt-3 text-3xl font-semibold text-[color:var(--ink)]">{{ activeSectionTitle() }}</h2>
                <p class="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">{{ activeSectionSummary() }}</p>
              </div>
              <button
                type="button"
                (click)="closeDialog()"
                class="shrink-0 whitespace-nowrap rounded-full border border-[color:var(--border-color)] px-4 py-2 text-sm font-medium text-[color:var(--muted)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                {{ showcase.collapseLabel }}
              </button>
            </div>
          </header>

          <div class="overflow-x-auto border-b border-[color:var(--border-color)] bg-white">
            <div class="inline-flex min-w-full gap-2 px-5 py-4 md:px-8">
              @for (section of showcase.sections; track section.key) {
                <button
                  type="button"
                  (click)="selectSection(section.key)"
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

          <div class="flex-1 overflow-y-auto px-5 py-5 md:px-8 md:py-7">
            @if (activeSection(); as section) {
              <div class="flex flex-wrap items-center gap-3">
                <span
                  class="rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em]"
                  [class]="
                    section.status === 'ready'
                      ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent)]'
                      : 'bg-[rgba(23,32,51,0.08)] text-[color:var(--muted)]'
                  "
                >
                  {{
                    section.status === 'ready'
                      ? data.labels.showcaseReady
                      : data.labels.showcaseComingSoon
                  }}
                </span>
              </div>

              <div class="mt-6 grid gap-5">
                @for (group of groupedBlocks(); track group.key) {
                  <article class="border border-[color:var(--border-color)] bg-white p-4 md:p-5">
                    <div class="grid gap-5">
                      @for (block of group.blocks; track block.title + block.type) {
                        <section class="first:pt-0" [class]="!$first ? 'border-t border-[color:var(--border-color)] pt-5' : ''">
                          <app-resume-showcase-block
                            [block]="block"
                            [openImageLabel]="data.labels.openImage"
                            (openImage)="openImagePreview($event)"
                          />
                        </section>
                      }
                    </div>
                  </article>
                }
              </div>
            }
          </div>
        </aside>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeShowcaseDialogComponent {
  readonly data = inject<ResumeShowcaseDialogData>(DIALOG_DATA);
  private readonly dialog = inject(Dialog);
  private readonly dialogRef = inject(DialogRef<ResumeShowcaseDialogComponent>);

  readonly showcase = computed(() => this.data.project.showcase ?? null);
  readonly activeSectionKey = signal(this.showcase()?.defaultSectionKey ?? null);
  readonly activeSection = computed(() => {
    const showcase = this.showcase();
    if (!showcase) {
      return null;
    }

    const sectionKey = this.activeSectionKey() ?? showcase.defaultSectionKey;
    return showcase.sections.find((section) => section.key === sectionKey) ?? showcase.sections[0] ?? null;
  });

  readonly groupedBlocks = computed(() => {
    const section = this.activeSection();
    return section ? this.groupBlocks(section.blocks) : [];
  });

  selectSection(sectionKey: string) {
    this.activeSectionKey.set(sectionKey);
  }

  isSectionActive(sectionKey: string) {
    return this.activeSectionKey() === sectionKey;
  }

  activeSectionTitle() {
    return this.activeSection()?.title ?? '';
  }

  activeSectionSummary() {
    return this.activeSection()?.summary ?? '';
  }

  openImagePreview(request: ResumeShowcaseImagePreviewRequest) {
    const data: ResumeImagePreviewDialogData = {
      src: request.src,
      alt: request.alt,
    };

    this.dialog.open(ResumeImagePreviewDialogComponent, {
      data,
      autoFocus: false,
      restoreFocus: true,
      panelClass: 'resume-image-preview-dialog-panel',
      backdropClass: 'resume-image-preview-dialog-backdrop',
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeDialog();
    }
  }

  onOverlaySpace(event: KeyboardEvent) {
    event.preventDefault();
    this.closeDialog();
  }

  private groupBlocks(blocks: ResumeProjectShowcaseBlock[]): ShowcaseBlockGroup[] {
    const groups: ShowcaseBlockGroup[] = [];

    for (const block of blocks) {
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
