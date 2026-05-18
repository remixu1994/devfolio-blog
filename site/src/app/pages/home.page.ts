import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { withLocalePath } from '@devfolio-blog/i18n';
import { SectionCardComponent, TopicLaneComponent } from '@devfolio-blog/ui';
import { getHomeViewModel, getLocale } from '../site-content';

@Component({
  standalone: true,
  imports: [RouterLink, SectionCardComponent, TopicLaneComponent],
  template: `
    <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="overflow-hidden border border-[color:var(--border-color)] bg-[rgba(255,250,243,0.96)] p-6 shadow-[0_16px_44px_rgba(23,24,28,0.08)] sm:rounded-[28px] md:p-10 lg:bg-[linear-gradient(135deg,rgba(255,250,243,0.96),rgba(234,239,247,0.94))] lg:shadow-[0_26px_80px_rgba(23,24,28,0.1)]">
        <div class="hidden flex-wrap items-center gap-3 sm:flex">
          <span class="rounded-full bg-[color:var(--ink)] px-4 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-white">
            Product-minded Engineer
          </span>
          <span class="rounded-full bg-[color:var(--highlight-soft)] px-4 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-[color:var(--highlight)]">
            Architecture / Delivery / Reliability
          </span>
        </div>

        <div class="max-w-4xl sm:mt-8">
          <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-[color:var(--accent)] sm:text-xs sm:tracking-[0.35em]">Moon Devfolio</p>
          <h1 class="mt-4 font-[var(--font-display)] text-[1.82rem] font-semibold leading-[1.18] text-[color:var(--ink)] sm:text-4xl md:text-7xl md:leading-[0.95]">
            {{ viewModel().dictionary.home.heroTitle }}
          </h1>
          <p class="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)] md:mt-6 md:text-lg md:leading-8">
            {{ viewModel().dictionary.home.heroBody }}
          </p>
        </div>

        <div class="mt-7 grid gap-4 md:mt-10 md:grid-cols-[1fr_auto] md:items-end">
          <div class="hidden gap-4 sm:grid sm:grid-cols-3">
            @for (metric of viewModel().featured.metrics; track metric.label) {
              <div class="rounded-[18px] border border-[color:var(--border-color)] bg-[rgba(255,255,255,0.68)] p-4 md:rounded-[24px]">
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
              class="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_28px_rgba(15,91,216,0.18)] transition hover:bg-[color:var(--accent-strong)]"
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

      <div class="hidden gap-6 lg:grid">
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
                Service boundaries, observability, delivery quality, self-hosted operations, and AI product loops.
              </p>
            </div>
          </div>
        </df-section-card>

        <div class="rounded-[32px] border border-[color:var(--border-color)] bg-[linear-gradient(160deg,rgba(16,25,42,0.94),rgba(10,46,115,0.88))] p-6 text-white shadow-[0_22px_60px_rgba(15,24,46,0.22)]">
          <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-white/60">Live Focus</p>
          <h2 class="mt-3 font-[var(--font-display)] text-3xl font-semibold">Building a personal engineering knowledge base</h2>
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

    <section class="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="border border-[color:var(--border-color)] bg-[rgba(255,249,240,0.8)] p-5 sm:rounded-[28px] md:p-8 lg:rounded-[36px]">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)] md:text-xs md:tracking-[0.32em]">Featured Work</p>
            <h2 class="mt-2 font-[var(--font-display)] text-2xl font-semibold md:mt-3 md:text-3xl">{{ viewModel().dictionary.home.featuredLabel }}</h2>
          </div>
          <a [routerLink]="['/', locale(), 'architecture']" class="text-sm text-[color:var(--accent)]">
            {{ viewModel().dictionary.nav.architecture }}
          </a>
        </div>

        <div class="mt-6 grid gap-5">
          @for (item of viewModel().featured.featuredCases; track item.slug) {
            <a
              [routerLink]="['/', locale(), 'architecture', item.slug]"
              class="grid gap-4 border-b border-[color:var(--border-color)] bg-white/70 px-0 py-5 transition last:border-b-0 hover:bg-white md:rounded-[28px] md:border md:bg-white/80 md:p-5 md:hover:-translate-y-1 md:hover:shadow-[0_18px_40px_rgba(23,24,28,0.08)] lg:grid-cols-[auto_1fr_auto]"
            >
              <div class="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] font-[var(--font-mono)] text-sm uppercase tracking-[0.25em] text-[color:var(--accent)] md:flex">
                0{{ $index + 1 }}
              </div>
              <div>
                <h3 class="text-xl font-semibold leading-snug text-[color:var(--ink)] md:text-2xl">{{ item.title }}</h3>
                <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ item.summary }}</p>
                <div class="mt-4 hidden flex-wrap gap-2 sm:flex">
                  @for (tag of item.tags; track tag) {
                    <span class="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent)]">{{ tag }}</span>
                  }
                </div>
              </div>
              <div class="hidden items-start justify-end md:flex">
                <span class="rounded-full bg-[color:var(--highlight-soft)] px-3 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--highlight)]">
                  {{ item.updatedAt }}
                </span>
              </div>
            </a>
          }
        </div>
      </div>

      <div class="hidden rounded-[36px] border border-[color:var(--border-color)] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,246,232,0.82))] p-6 md:p-8 lg:block">
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

    <section class="mt-8 border border-[color:var(--border-color)] bg-white lg:mt-10">
      <div class="grid gap-6 border-b border-[color:var(--border-color)] bg-[rgba(255,249,240,0.7)] px-5 py-5 md:px-8 md:py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)] md:text-xs md:tracking-[0.32em]">
            {{ viewModel().dictionary.home.booksLabel }}
          </p>
          <h2 class="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[color:var(--ink)] md:mt-3 md:text-4xl">
            {{ viewModel().books.title }}
          </h2>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">{{ viewModel().books.summary }}</p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a
              [routerLink]="['/', locale(), 'books']"
              class="rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[color:var(--accent)]"
            >
              {{ viewModel().books.cta }}
            </a>
            @if (viewModel().books.highlightedQuote; as quote) {
              <span class="inline-flex max-w-full items-center rounded-full border border-[color:var(--border-color)] bg-white px-4 py-3 text-sm text-[color:var(--muted)] md:max-w-[32rem]">
                “{{ quote }}”
              </span>
            }
          </div>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            @for (book of viewModel().books.featuredBooks; track book.slug) {
              <article class="overflow-hidden rounded-[22px] border border-[color:var(--border-color)] bg-white/80">
                @if (book.quote) {
                  <div class="bg-[linear-gradient(135deg,rgba(255,246,232,0.96),rgba(234,239,247,0.92))] px-4 py-4">
                    <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                      {{ viewModel().dictionary.books.quoteLabel }}
                    </p>
                    <p class="mt-3 text-sm font-semibold leading-7 text-[color:var(--ink)]">
                      “{{ book.quote }}”
                    </p>
                  </div>
                }
                <div class="p-4">
                  <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
                    {{ book.category }}
                  </p>
                  <h3 class="mt-2 text-lg font-semibold text-[color:var(--ink)]">{{ book.title }}</h3>
                  <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ book.takeaway }}</p>
                </div>
              </article>
            }
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-[color:var(--border-color)] px-5 py-5 md:px-8 md:py-6">
        <div>
          <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)] md:text-xs md:tracking-[0.32em]">Recent Writing</p>
          <h2 class="mt-2 font-[var(--font-display)] text-2xl font-semibold md:mt-3 md:text-3xl">{{ viewModel().dictionary.home.recentLabel }}</h2>
        </div>
        <a [routerLink]="['/', locale(), 'blog']" class="text-sm text-[color:var(--accent)]">
          {{ viewModel().dictionary.nav.blog }}
        </a>
      </div>

      <div class="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div class="divide-y divide-[color:var(--border-color)]">
          @for (post of viewModel().featured.recentPosts; track post.id) {
            <a
              [routerLink]="['/', locale(), 'blog', post.slug]"
              class="grid gap-3 px-5 py-5 transition hover:bg-[color:var(--panel)] md:grid-cols-[8rem_minmax(0,1fr)] md:px-8 md:py-6"
            >
              <div class="flex flex-wrap gap-x-3 gap-y-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)] md:block md:tracking-[0.28em]">
                <p>{{ post.updatedAt }}</p>
                @if (post.series) {
                  <p class="text-[color:var(--accent)] md:mt-2">{{ post.series }}</p>
                }
              </div>
              <div>
                <h3 class="text-xl font-semibold leading-snug text-[color:var(--ink)] md:text-2xl">{{ post.title }}</h3>
                <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ post.summary }}</p>
                <div class="mt-4 hidden flex-wrap gap-x-3 gap-y-2 text-xs text-[color:var(--muted)] sm:flex">
                  @for (tag of post.tags; track tag) {
                    <span>{{ tag }}</span>
                  }
                </div>
              </div>
            </a>
          }
        </div>

        <aside class="hidden border-t border-[color:var(--border-color)] bg-[rgba(255,252,246,0.84)] p-6 lg:block lg:border-l lg:border-t-0 md:p-8">
          <p class="font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Topics</p>
          <div class="mt-4 flex flex-wrap gap-2">
            @for (topic of viewModel().blogTopics; track topic.name) {
              <span class="border border-[color:var(--border-color)] bg-white px-3 py-2 text-xs text-[color:var(--muted)]">
                {{ topic.name }} / {{ topic.count }}
              </span>
            }
          </div>
          @if (viewModel().blogSeries.length > 0) {
            <p class="mt-7 font-[var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Series</p>
            <div class="mt-4 grid gap-3 text-sm">
              @for (item of viewModel().blogSeries; track item.name) {
                <div class="flex items-center justify-between gap-4">
                  <span class="font-medium">{{ item.name }}</span>
                  <span class="font-[var(--font-mono)] text-xs text-[color:var(--muted)]">{{ item.count }}</span>
                </div>
              }
            </div>
          }
        </aside>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly parentParamMap = toSignal((this.route.parent?.paramMap ?? this.route.paramMap), {
    initialValue: (this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap),
  });

  readonly locale = computed(() => getLocale(this.parentParamMap().get('locale')));
  readonly viewModel = computed(() => getHomeViewModel(this.locale()));

  topicHref(slug: string) {
    return withLocalePath(this.locale(), slug);
  }
}
