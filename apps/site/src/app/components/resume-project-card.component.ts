import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type { ResumeProject } from '@devfolio-blog/shared-types';

@Component({
  standalone: true,
  selector: 'app-resume-project-card',
  template: `
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
            (click)="openShowcase.emit()"
            class="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[color:var(--accent-strong)]"
          >
            {{ showcase.entryLabel }}
          </button>
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeProjectCardComponent {
  @Input({ required: true }) project!: ResumeProject;
  @Output() openShowcase = new EventEmitter<void>();
}
