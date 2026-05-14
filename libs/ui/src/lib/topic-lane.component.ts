import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'df-topic-lane',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a
      class="group flex h-full flex-col justify-between rounded-[32px] border border-[color:var(--border-color)] bg-[linear-gradient(150deg,rgba(255,250,242,0.95),rgba(229,235,247,0.88))] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(23,24,28,0.12)]"
      [routerLink]="href()"
    >
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">{{ eyebrow() }}</p>
        <h3 class="mt-3 text-2xl font-semibold text-[color:var(--ink)]">{{ title() }}</h3>
        <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">{{ summary() }}</p>
      </div>
      <span class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--ink)]">
        {{ cta() }}
        <span class="transition-transform duration-300 group-hover:translate-x-1">-></span>
      </span>
    </a>
  `,
})
export class TopicLaneComponent {
  readonly href = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly summary = input.required<string>();
  readonly cta = input.required<string>();
}
