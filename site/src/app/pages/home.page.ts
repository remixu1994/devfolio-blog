import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { withLocalePath } from '@devfolio-blog/i18n';
import { SectionCardComponent, TopicLaneComponent } from '@devfolio-blog/ui';
import { getHomeViewModel, getLocale } from '../site-content';

@Component({
  standalone: true,
  imports: [RouterLink, SectionCardComponent, TopicLaneComponent],
  template: `
    <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="overflow-hidden rounded-[40px] border border-[color:var(--border-color)] bg-[linear-gradient(135deg,rgba(255,250,243,0.96),rgba(234,239,247,0.94))] p-8 shadow-[0_26px_80px_rgba(23,24,28,0.1)] md:p-10">
        <div class="flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-[color:var(--ink)] px-4 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-white">
            Full-stack Operator
          </span>
          <span class="rounded-full bg-[color:var(--highlight-soft)] px-4 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-[color:var(--highlight)]">
            Angular / NestJS / Nx
          </span>
        </div>

        <div class="mt-8 max-w-4xl">
          <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.35em] text-[color:var(--accent)]">Moon Devfolio</p>
          <h1 class="mt-4 font-[var(--font-display)] text-5xl font-semibold leading-[0.95] text-[color:var(--ink)] md:text-7xl">
            {{ viewModel().dictionary.home.heroTitle }}
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] md:text-lg">
            {{ viewModel().dictionary.home.heroBody }}
          </p>
        </div>

        <div class="mt-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div class="grid gap-4 sm:grid-cols-3">
            @for (metric of viewModel().featured.metrics; track metric.label) {
              <div class="rounded-[24px] border border-[color:var(--border-color)] bg-[rgba(255,255,255,0.68)] p-4">
                <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  {{ metric.label }}
                </p>
                <p class="mt-3 text-2xl font-semibold text-[color:var(--ink)]">{{ metric.value }}</p>
              </div>
            }
          </div>

          <div class="flex flex-wrap gap-3">
            <a
              [routerLink]="['/', locale(), 'architecture']"
              class="rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-medium text-white"
            >
              {{ viewModel().dictionary.home.featuredLabel }}
            </a>
            <a
              [routerLink]="['/', locale(), 'resume']"
              class="rounded-full border border-[color:var(--border-color)] bg-white/70 px-5 py-3 text-sm font-medium text-[color:var(--ink)]"
            >
              {{ viewModel().dictionary.nav.resume }}
            </a>
          </div>
        </div>
      </div>

      <div class="grid gap-6">
        <df-section-card
          eyebrow="Architecture Radar"
          [title]="viewModel().dictionary.home.contactLabel"
          description="A narrative spine that connects resume, architecture cases, self-hosted infrastructure, and AI product experiments."
        >
          <div class="mt-6 grid gap-3">
            <div class="rounded-[22px] bg-[color:var(--ink)] px-4 py-4 text-white">
              <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-white/70">Strength</p>
              <p class="mt-2 text-lg font-semibold">Platform thinking + product delivery</p>
            </div>
            <div class="rounded-[22px] border border-[color:var(--border-color)] bg-white/70 px-4 py-4">
              <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">Themes</p>
              <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                Monorepo engineering, service boundaries, observability, self-hosted runtime, and AI product loops.
              </p>
            </div>
          </div>
        </df-section-card>

        <div class="rounded-[32px] border border-[color:var(--border-color)] bg-[linear-gradient(160deg,rgba(16,25,42,0.94),rgba(10,46,115,0.88))] p-6 text-white shadow-[0_22px_60px_rgba(15,24,46,0.22)]">
          <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-white/60">Live Focus</p>
          <h2 class="mt-3 font-[var(--font-display)] text-3xl font-semibold">Building a personal engineering media stack</h2>
          <div class="mt-5 grid gap-3">
            <div class="flex items-start justify-between gap-4 rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
              <div>
                <p class="text-sm font-semibold">Architecture cases</p>
                <p class="mt-1 text-sm leading-6 text-white/70">Design decisions, tradeoffs, and system boundaries.</p>
              </div>
              <span class="font-[var(--font-mono)] text-xs uppercase tracking-[0.28em] text-white/50">01</span>
            </div>
            <div class="flex items-start justify-between gap-4 rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
              <div>
                <p class="text-sm font-semibold">Unraid lab</p>
                <p class="mt-1 text-sm leading-6 text-white/70">Self-hosted infra, backups, and container operations.</p>
              </div>
              <span class="font-[var(--font-mono)] text-xs uppercase tracking-[0.28em] text-white/50">02</span>
            </div>
            <div class="flex items-start justify-between gap-4 rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
              <div>
                <p class="text-sm font-semibold">Fitness AI agent</p>
                <p class="mt-1 text-sm leading-6 text-white/70">A product case around workout loops, feedback, and coaching UX.</p>
              </div>
              <span class="font-[var(--font-mono)] text-xs uppercase tracking-[0.28em] text-white/50">03</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-[36px] border border-[color:var(--border-color)] bg-[rgba(255,249,240,0.8)] p-6 md:p-8">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Featured Work</p>
            <h2 class="mt-3 font-[var(--font-display)] text-3xl font-semibold">{{ viewModel().dictionary.home.featuredLabel }}</h2>
          </div>
          <a [routerLink]="['/', locale(), 'architecture']" class="text-sm text-[color:var(--accent)]">
            {{ viewModel().dictionary.nav.architecture }}
          </a>
        </div>

        <div class="mt-6 grid gap-5">
          @for (item of viewModel().featured.featuredCases; track item.slug) {
            <a
              [routerLink]="['/', locale(), 'architecture', item.slug]"
              class="grid gap-4 rounded-[28px] border border-[color:var(--border-color)] bg-white/80 p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(23,24,28,0.08)] md:grid-cols-[auto_1fr_auto]"
            >
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] font-[var(--font-mono)] text-sm uppercase tracking-[0.25em] text-[color:var(--accent)]">
                0{{ $index + 1 }}
              </div>
              <div>
                <h3 class="text-2xl font-semibold text-[color:var(--ink)]">{{ item.title }}</h3>
                <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ item.summary }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  @for (tag of item.tags; track tag) {
                    <span class="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent)]">{{ tag }}</span>
                  }
                </div>
              </div>
              <div class="flex items-start justify-end">
                <span class="rounded-full bg-[color:var(--highlight-soft)] px-3 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--highlight)]">
                  {{ item.updatedAt }}
                </span>
              </div>
            </a>
          }
        </div>
      </div>

      <div class="rounded-[36px] border border-[color:var(--border-color)] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,246,232,0.82))] p-6 md:p-8">
        <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Topic Lanes</p>
        <h2 class="mt-3 font-[var(--font-display)] text-3xl font-semibold">A blog shaped by systems, not categories</h2>
        <div class="mt-6 grid gap-5">
          @for (topic of viewModel().featured.topicCards; track topic.slug) {
            <df-topic-lane
              [eyebrow]="topic.eyebrow"
              [title]="topic.title"
              [summary]="topic.summary"
              [cta]="topic.cta"
              [href]="topicHref(topic.slug)"
            />
          }
        </div>
      </div>
    </section>

    <section class="mt-10 rounded-[36px] border border-[color:var(--border-color)] bg-[rgba(255,249,240,0.78)] p-6 md:p-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Recent Writing</p>
          <h2 class="mt-3 font-[var(--font-display)] text-3xl font-semibold">{{ viewModel().dictionary.home.recentLabel }}</h2>
        </div>
        <a [routerLink]="['/', locale(), 'blog']" class="text-sm text-[color:var(--accent)]">
          {{ viewModel().dictionary.nav.blog }}
        </a>
      </div>

      <div class="mt-6 grid gap-5 lg:grid-cols-3">
        @for (post of viewModel().featured.recentPosts; track post.id) {
          <a
            [routerLink]="['/', locale(), 'blog', post.slug]"
            class="group rounded-[28px] border border-[color:var(--border-color)] bg-white/82 p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(23,24,28,0.08)]"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">{{ post.updatedAt }}</span>
              <span class="rounded-full bg-[color:var(--highlight-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[color:var(--highlight)]">
                {{ post.locale }}
              </span>
            </div>
            <h3 class="mt-4 text-2xl font-semibold text-[color:var(--ink)]">{{ post.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">{{ post.summary }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              @for (tag of post.tags; track tag) {
                <span class="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent)]">{{ tag }}</span>
              }
            </div>
            <div class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--ink)]">
              Open article
              <span class="transition-transform duration-300 group-hover:translate-x-1">-></span>
            </div>
          </a>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly locale = computed(() => getLocale(this.route.parent?.snapshot.paramMap.get('locale')));
  readonly viewModel = computed(() => getHomeViewModel(this.locale()));

  topicHref(slug: string) {
    return withLocalePath(this.locale(), slug);
  }
}
