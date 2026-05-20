import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { ResumeImagePreviewDialogData } from './resume-dialog.models';

@Component({
  standalone: true,
  selector: 'app-resume-image-preview-dialog',
  host: {
    class: 'block h-full w-full',
  },
  template: `
    <div
      class="flex h-full w-full items-center justify-center bg-black/80 backdrop-blur-sm"
      tabindex="0"
      role="button"
      aria-label="Close image preview"
      (click)="onOverlayClick($event)"
      >
        <button
          type="button"
          (click)="close()"
        class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close image preview"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>

      <img [src]="data.src" [alt]="data.alt" class="max-h-[90vh] max-w-[90vw] object-contain" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeImagePreviewDialogComponent {
  readonly data = inject<ResumeImagePreviewDialogData>(DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef<ResumeImagePreviewDialogComponent>);

  close() {
    this.dialogRef.close();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
