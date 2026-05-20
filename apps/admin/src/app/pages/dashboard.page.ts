import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../services/admin-api.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  template: `
    <section class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div class="rounded-[28px] border border-[color:var(--border-color)] bg-[color:var(--panel)] p-6">
        <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">Control Layer</p>
        <h1 class="mt-4 font-[var(--font-display)] text-4xl font-semibold">轻量内容后台</h1>
        <p class="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          当前版本用于管理博客文章与专题内容，首发保持单管理员心智，后续再接 GitHub OAuth 完整认证链路。
        </p>
        <a
          routerLink="/posts/new"
          class="mt-6 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Create a post
        </a>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <article class="rounded-[24px] border border-[color:var(--border-color)] bg-white/5 p-5">
          <p class="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">Apps</p>
          <p class="mt-3 text-3xl font-semibold">3</p>
          <p class="mt-2 text-sm text-[color:var(--muted)]">site / admin / api</p>
        </article>
        <article class="rounded-[24px] border border-[color:var(--border-color)] bg-white/5 p-5">
          <p class="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">Content Mode</p>
          <p class="mt-3 text-3xl font-semibold">Hybrid</p>
          <p class="mt-2 text-sm text-[color:var(--muted)]">Repo + API managed posts</p>
        </article>
        <article class="rounded-[24px] border border-[color:var(--border-color)] bg-white/5 p-5">
          <p class="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">Deploy</p>
          <p class="mt-3 text-3xl font-semibold">Unraid</p>
          <p class="mt-2 text-sm text-[color:var(--muted)]">Container-first self-hosting</p>
        </article>
      </div>
    </section>

    <section class="mt-8 rounded-[28px] border border-[color:var(--border-color)] bg-[color:var(--panel)] p-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold">Managed posts</h2>
          <p class="mt-2 text-sm text-[color:var(--muted)]">由 GET /api/admin/posts 驱动，用于验证站点后台链路。</p>
        </div>
        <a routerLink="/posts/new" class="text-sm text-[color:var(--accent)]">New post</a>
      </div>

      <div class="mt-6 overflow-hidden rounded-2xl border border-[color:var(--border-color)]">
        <table class="min-w-full border-collapse text-left text-sm">
          <thead class="bg-white/5 text-[color:var(--muted)]">
            <tr>
              <th class="px-4 py-3 font-medium">Title</th>
              <th class="px-4 py-3 font-medium">Locale</th>
              <th class="px-4 py-3 font-medium">Status</th>
              <th class="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            @for (post of posts$ | async; track post.id) {
              <tr class="border-t border-[color:var(--border-color)]">
                <td class="px-4 py-3">{{ post.title }}</td>
                <td class="px-4 py-3 uppercase">{{ post.locale }}</td>
                <td class="px-4 py-3">{{ post.status }}</td>
                <td class="px-4 py-3">{{ post.updatedAt }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly api = inject(AdminApiService);
  readonly posts$ = this.api.getPosts();
}
