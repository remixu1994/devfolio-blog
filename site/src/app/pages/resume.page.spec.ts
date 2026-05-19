import { Dialog } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ResumeShowcaseDialogComponent } from '../components/resume-showcase-dialog.component';
import { ResumeProjectCardComponent } from '../components/resume-project-card.component';
import { ResumePageComponent } from './resume.page';

describe('ResumePageComponent', () => {
  it('opens the showcase dialog with the selected project', () => {
    const paramMap = convertToParamMap({ locale: 'zh' });
    const dialog = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ResumePageComponent],
      providers: [
        { provide: Dialog, useValue: dialog },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              paramMap: of(paramMap),
              snapshot: { paramMap },
            },
            paramMap: of(paramMap),
            snapshot: { paramMap },
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(ResumePageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const showcaseProject = component.viewModel().resume.projects.find((project) => project.showcase);

    expect(showcaseProject).toBeDefined();

    const cardDebugElements = fixture.debugElement.queryAll(By.directive(ResumeProjectCardComponent));
    const targetCard = cardDebugElements.find(
      (debugElement) => debugElement.componentInstance.project.title === showcaseProject?.title,
    );

    expect(targetCard).toBeDefined();
    if (!targetCard) {
      throw new Error('Expected target project card to exist');
    }

    targetCard.componentInstance.openShowcase.emit();

    expect(dialog.open).toHaveBeenCalledWith(
      ResumeShowcaseDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({
          project: showcaseProject,
          labels: component.viewModel().resume.labels,
        }),
        panelClass: 'resume-showcase-dialog-panel',
        backdropClass: 'resume-showcase-dialog-backdrop',
      }),
    );
  });
});
