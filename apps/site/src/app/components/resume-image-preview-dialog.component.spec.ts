import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ResumeImagePreviewDialogComponent } from './resume-image-preview-dialog.component';

describe('ResumeImagePreviewDialogComponent', () => {
  it('renders the image and closes from the backdrop', () => {
    const dialogRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ResumeImagePreviewDialogComponent],
      providers: [
        { provide: DialogRef, useValue: dialogRef },
        {
          provide: DIALOG_DATA,
          useValue: {
            src: '/assets/preview.png',
            alt: 'Preview image',
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(ResumeImagePreviewDialogComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const image = host.querySelector('img');

    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe('/assets/preview.png');
    expect(image?.getAttribute('alt')).toBe('Preview image');

    const overlay = host.querySelector('[role="button"]') as HTMLElement;
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(dialogRef.close).toHaveBeenCalled();
  });
});
