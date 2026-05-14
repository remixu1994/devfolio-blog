import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'df-section-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="rounded-[32px] border border-[color:var(--border-color)] bg-[color:var(--panel)] p-6 shadow-[0_20px_60px_rgba(23,24,28,0.08)]">
      <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">{{ eyebrow() }}</p>
      <h3 class="mt-3 text-2xl font-semibold text-[color:var(--ink)]">{{ title() }}</h3>
      <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">{{ description() }}</p>
      <ng-content />
    </article>
  `,
})
export class SectionCardComponent {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
