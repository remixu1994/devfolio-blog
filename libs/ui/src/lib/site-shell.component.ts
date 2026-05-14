import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface ShellLink {
  label: string;
  href: string;
}

@Component({
  selector: 'df-site-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-[color:var(--surface)] text-[color:var(--ink)]">
      <header class="sticky top-0 z-20 px-4 pt-4 md:px-6">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-[28px] border border-[color:var(--border-color)] bg-[rgba(255,249,240,0.82)] px-5 py-4 shadow-[0_18px_50px_rgba(23,24,28,0.08)] backdrop-blur">
          <a [routerLink]="homeHref()" class="flex min-w-0 flex-col">
            <span class="font-[var(--font-display)] text-xl tracking-wide">{{ brand() }}</span>
            <span class="truncate text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ tagline() }}</span>
          </a>
          <nav class="hidden items-center gap-2 lg:flex">
            @for (link of links(); track link.href) {
              <a
                [routerLink]="link.href"
                routerLinkActive="bg-[color:var(--ink)] text-white"
                class="rounded-full px-4 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--ink)]"
              >
                {{ link.label }}
              </a>
            }
          </nav>
          <div class="flex items-center gap-3">
            <span class="hidden rounded-full bg-[color:var(--highlight-soft)] px-3 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--highlight)] md:inline-flex">
              Self-hosted
            </span>
            <a
              [routerLink]="switchHref()"
              class="rounded-full border border-[color:var(--border-color)] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]"
            >
              {{ switchLabel() }}
            </a>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <ng-content />
      </main>

      <footer class="px-4 pb-8 pt-2 md:px-6">
        <div class="mx-auto max-w-7xl rounded-[28px] border border-[color:var(--border-color)] bg-[rgba(255,249,240,0.7)] px-6 py-5 text-center text-sm text-[color:var(--muted)]">
          {{ footer() }}
        </div>
      </footer>
    </div>
  `,
})
export class SiteShellComponent {
  readonly brand = input.required<string>();
  readonly tagline = input.required<string>();
  readonly links = input.required<ShellLink[]>();
  readonly homeHref = input.required<string>();
  readonly switchHref = input.required<string>();
  readonly switchLabel = input.required<string>();
  readonly footer = input.required<string>();
}
