import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type { ResumeProjectShowcaseBlock } from '@devfolio-blog/shared-types';

export interface ResumeShowcaseImagePreviewRequest {
  src: string;
  alt: string;
}

@Component({
  standalone: true,
  selector: 'app-resume-showcase-block',
  template: `
    @if (block.type === 'image' && block.imageSrc; as imageSrc) {
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h4 class="text-lg font-semibold text-[color:var(--ink)]">{{ block.title }}</h4>
        <button
          type="button"
          (click)="emitImagePreview(imageSrc)"
          class="text-sm font-medium text-[color:var(--accent)] transition hover:text-[color:var(--ink)]"
        >
          {{ openImageLabel }}
        </button>
      </div>

      @if (block.body) {
        <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">{{ block.body }}</p>
      }

      <div class="group relative mt-4 overflow-hidden border border-[color:var(--border-color)] bg-[color:var(--panel)]">
        <img [src]="imageSrc" [alt]="block.imageAlt || block.title" class="w-full object-cover" />
        <button
          type="button"
          (click)="emitImagePreview(imageSrc)"
          class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--ink)]/72 text-white shadow-lg ring-1 ring-white/25 backdrop-blur transition duration-200 hover:scale-105 hover:bg-[color:var(--ink)]/84 max-md:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
          [attr.aria-label]="openImageLabel"
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeShowcaseBlockComponent {
  @Input({ required: true }) block!: ResumeProjectShowcaseBlock;
  @Input({ required: true }) openImageLabel!: string;
  @Output() openImage = new EventEmitter<ResumeShowcaseImagePreviewRequest>();

  emitImagePreview(src: string) {
    this.openImage.emit({
      src,
      alt: this.block.imageAlt || this.block.title,
    });
  }
}
