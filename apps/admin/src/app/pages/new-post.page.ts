import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import type { CreatePostDto } from '@devfolio-blog/shared-types';
import { finalize } from 'rxjs';
import { AdminApiService } from '../services/admin-api.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="rounded-[28px] border border-[color:var(--border-color)] bg-[color:var(--panel)] p-6">
      <div class="max-w-3xl">
        <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">New Content</p>
        <h1 class="mt-4 font-[var(--font-display)] text-4xl font-semibold">Create a blog post</h1>
        <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          这会调用 POST /api/admin/posts，用于验证内容后台、共享类型和公共 API 的基础链路。
        </p>
      </div>

      <form class="mt-8 grid gap-5 max-w-4xl" [formGroup]="form" (ngSubmit)="submit()">
        <div class="grid gap-5 md:grid-cols-2">
          <label class="grid gap-2 text-sm">
            <span>Slug</span>
            <input class="rounded-2xl border border-[color:var(--border-color)] bg-white/5 px-4 py-3 text-white" formControlName="slug" />
          </label>
          <label class="grid gap-2 text-sm">
            <span>Locale</span>
            <select class="rounded-2xl border border-[color:var(--border-color)] bg-slate-950 px-4 py-3 text-white" formControlName="locale">
              <option value="zh">zh</option>
              <option value="en">en</option>
            </select>
          </label>
        </div>

        <label class="grid gap-2 text-sm">
          <span>Title</span>
          <input class="rounded-2xl border border-[color:var(--border-color)] bg-white/5 px-4 py-3 text-white" formControlName="title" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>Summary</span>
          <textarea class="min-h-28 rounded-2xl border border-[color:var(--border-color)] bg-white/5 px-4 py-3 text-white" formControlName="summary"></textarea>
        </label>

        <div class="grid gap-5 md:grid-cols-2">
          <label class="grid gap-2 text-sm">
            <span>Hero image</span>
            <input class="rounded-2xl border border-[color:var(--border-color)] bg-white/5 px-4 py-3 text-white" formControlName="heroImage" />
          </label>
          <label class="grid gap-2 text-sm">
            <span>Series</span>
            <input class="rounded-2xl border border-[color:var(--border-color)] bg-white/5 px-4 py-3 text-white" formControlName="series" />
          </label>
        </div>

        <label class="grid gap-2 text-sm">
          <span>Tags</span>
          <input class="rounded-2xl border border-[color:var(--border-color)] bg-white/5 px-4 py-3 text-white" formControlName="tags" />
        </label>

        <label class="grid gap-2 text-sm">
          <span>Body (Markdown)</span>
          <textarea class="min-h-64 rounded-2xl border border-[color:var(--border-color)] bg-white/5 px-4 py-3 text-white" formControlName="body"></textarea>
        </label>

        <label class="inline-flex items-center gap-3 text-sm">
          <input type="checkbox" formControlName="published" />
          Publish immediately
        </label>

        @if (message()) {
          <p class="text-sm text-[color:var(--accent)]">{{ message() }}</p>
        }

        <button
          type="submit"
          [disabled]="form.invalid || submitting()"
          class="inline-flex w-fit rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ submitting() ? 'Submitting...' : 'Create post' }}
        </button>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPostPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly message = signal('');

  readonly form = this.fb.group({
    slug: ['', Validators.required],
    locale: ['zh', Validators.required],
    title: ['', Validators.required],
    summary: ['', Validators.required],
    heroImage: ['/assets/blog/custom-post.svg', Validators.required],
    series: [''],
    tags: ['Angular,NestJS,Nx', Validators.required],
    body: ['## New post\n\nWrite your article here.', Validators.required],
    published: [true],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: CreatePostDto = {
      slug: raw.slug ?? '',
      locale: (raw.locale ?? 'zh') as 'zh' | 'en',
      title: raw.title ?? '',
      summary: raw.summary ?? '',
      heroImage: raw.heroImage ?? '',
      series: raw.series ?? undefined,
      body: raw.body ?? '',
      tags: (raw.tags ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      published: raw.published ?? false,
    };

    this.submitting.set(true);
    this.message.set('');

    this.api
      .createPost(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (post) => {
          this.message.set(`Created ${post.title} (${post.slug}).`);
          void this.router.navigateByUrl('/');
        },
        error: () => {
          this.message.set('API is not reachable yet. Start the Nest API at http://localhost:3000 and try again.');
        },
      });
  }
}
