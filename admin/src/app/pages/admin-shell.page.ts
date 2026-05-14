import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen">
      <header class="border-b border-[color:var(--border-color)] bg-[rgba(15,23,42,0.85)] backdrop-blur">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p class="font-[var(--font-display)] text-xl">Moon Devfolio Admin</p>
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">Protected-ready content cockpit</p>
          </div>
          <nav class="flex gap-5 text-sm text-[color:var(--muted)]">
            <a routerLink="/" routerLinkActive="text-white">Dashboard</a>
            <a routerLink="/posts/new" routerLinkActive="text-white">New Post</a>
          </nav>
        </div>
      </header>
      <main class="mx-auto max-w-7xl px-6 py-8">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShellPageComponent {}
