import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import type { ResumeLabels, ResumeProject } from '@devfolio-blog/shared-types';
import { vi } from 'vitest';
import type { ResumeShowcaseDialogData } from './resume-dialog.models';
import { ResumeImagePreviewDialogComponent } from './resume-image-preview-dialog.component';
import { ResumeShowcaseDialogComponent } from './resume-showcase-dialog.component';

const labels: ResumeLabels = {
  profile: 'Profile',
  location: 'Location',
  gender: 'Gender',
  age: 'Age',
  drivingLicense: 'Driving License',
  professionalSummary: 'Professional Summary',
  projectExperience: 'Project Experience',
  employmentHistory: 'Employment History',
  competences: 'Competences',
  education: 'Education',
  languages: 'Languages',
  focus: 'Focus',
  showcaseReady: 'Ready',
  showcaseComingSoon: 'Coming soon',
  openImage: 'Open image',
};

const project: ResumeProject = {
  title: 'Project Atlas',
  role: 'Lead Engineer',
  period: '2024',
  summary: 'Refactor and delivery work.',
  stack: ['Angular', 'Nx'],
  highlights: ['Improved maintainability'],
  showcase: {
    id: 'atlas',
    slug: 'project-atlas',
    entryLabel: 'Open showcase',
    collapseLabel: 'Close showcase',
    defaultSectionKey: 'overview',
    sections: [
      {
        key: 'overview',
        title: 'Overview',
        status: 'ready',
        summary: 'Overview summary',
        blocks: [
          {
            type: 'text',
            title: 'Summary',
            body: 'Overview body',
          },
          {
            type: 'image',
            title: 'Architecture',
            body: 'Diagram body',
            imageSrc: '/assets/architecture.png',
            imageAlt: 'Architecture diagram',
          },
        ],
      },
      {
        key: 'backlog',
        title: 'Backlog',
        status: 'placeholder',
        summary: 'Backlog summary',
        blocks: [
          {
            type: 'placeholder',
            title: 'Pending',
            body: 'More details later',
          },
        ],
      },
    ],
  },
};

describe('ResumeShowcaseDialogComponent', () => {
  it('uses the default section, opens image preview, and switches sections', () => {
    const dialog = {
      open: vi.fn(),
      getDialogById: vi.fn().mockReturnValue(null),
    };
    const dialogRef = {
      close: vi.fn(),
    };
    const data: ResumeShowcaseDialogData = { project, labels };

    TestBed.configureTestingModule({
      imports: [ResumeShowcaseDialogComponent],
      providers: [
        { provide: Dialog, useValue: dialog },
        { provide: DialogRef, useValue: dialogRef },
        { provide: DIALOG_DATA, useValue: data },
      ],
    });

    const fixture = TestBed.createComponent(ResumeShowcaseDialogComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('h2')?.textContent).toContain('Overview');
    expect(host.textContent).toContain('Ready');

    const openImageButton = Array.from(host.querySelectorAll('button')).find((button) =>
      button.textContent?.includes(labels.openImage),
    );
    expect(openImageButton).toBeDefined();
    if (!openImageButton) {
      throw new Error('Expected image preview button to exist');
    }

    openImageButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(dialog.open).toHaveBeenCalledWith(
      ResumeImagePreviewDialogComponent,
      expect.objectContaining({
        id: 'resume-showcase-image-preview',
        data: expect.objectContaining({
          src: '/assets/architecture.png',
          alt: 'Architecture diagram',
        }),
        panelClass: 'resume-image-preview-dialog-panel',
        backdropClass: 'resume-image-preview-dialog-backdrop',
      }),
    );

    const backlogButton = Array.from(host.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Backlog'),
    );
    expect(backlogButton).toBeDefined();
    if (!backlogButton) {
      throw new Error('Expected backlog button to exist');
    }

    backlogButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(host.querySelector('h2')?.textContent).toContain('Backlog');
    expect(host.textContent).toContain('Coming soon');
  });

  it('does not open a duplicate image preview dialog', () => {
    const dialog = {
      open: vi.fn(),
      getDialogById: vi.fn().mockReturnValue({}),
    };
    const dialogRef = {
      close: vi.fn(),
    };
    const data: ResumeShowcaseDialogData = { project, labels };

    TestBed.configureTestingModule({
      imports: [ResumeShowcaseDialogComponent],
      providers: [
        { provide: Dialog, useValue: dialog },
        { provide: DialogRef, useValue: dialogRef },
        { provide: DIALOG_DATA, useValue: data },
      ],
    });

    const fixture = TestBed.createComponent(ResumeShowcaseDialogComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.openImagePreview({ src: '/assets/architecture.png', alt: 'Architecture diagram' });

    expect(dialog.getDialogById).toHaveBeenCalledWith('resume-showcase-image-preview');
    expect(dialog.open).not.toHaveBeenCalled();
  });
});
