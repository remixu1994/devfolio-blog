import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { getBooksViewModel, getLocale } from '../site-content';

@Component({
  standalone: true,
  template: `
    <section class="grid gap-8">
      <section class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="border border-[color:var(--border-color)] bg-[rgba(255,250,243,0.92)] p-6 sm:rounded-[28px] md:p-8">
          <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent)]">
            {{ viewModel().module.eyebrow }}
          </p>
          <h1 class="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[color:var(--ink)] md:text-6xl">
            {{ viewModel().module.title }}
          </h1>
          <p class="mt-4 max-w-3xl text-base leading-8 text-[color:var(--muted)]">
            {{ viewModel().module.summary }}
          </p>
          <article class="mt-6 rounded-[24px] border border-[color:var(--border-color)] bg-white/80 p-5 text-sm leading-8 text-[color:var(--muted)]">
            {{ viewModel().module.philosophy }}
          </article>
        </div>

        <div class="grid gap-4">
          <section class="rounded-[28px] border border-[color:var(--border-color)] bg-[linear-gradient(140deg,rgba(17,27,43,0.98),rgba(27,72,143,0.94))] p-6 text-white md:p-8">
            <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-white/60">
              {{ viewModel().dictionary.books.quoteLabel }}
            </p>
            <p class="mt-4 font-[var(--font-display)] text-3xl font-semibold leading-[1.3]">
              “{{ mythicalQuote() }}”
            </p>
            <p class="mt-5 max-w-xl text-sm leading-7 text-white/72">
              {{ viewModel().module.summary }}
            </p>
          </section>

          <section class="rounded-[28px] border border-[color:var(--border-color)] bg-white p-6">
            <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
              {{ viewModel().dictionary.books.groups }}
            </p>
            <div class="mt-4 flex flex-wrap gap-3">
              @for (group of viewModel().groupedBooks; track group.category) {
                <span class="rounded-full border border-[color:var(--border-color)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--ink)]">
                  {{ group.title }}
                </span>
              }
            </div>
          </section>
        </div>
      </section>

      <section class="border border-[color:var(--border-color)] bg-white p-6 sm:rounded-[28px] md:p-8">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
              {{ viewModel().dictionary.books.featured }}
            </p>
            <h2 class="mt-2 font-[var(--font-display)] text-3xl font-semibold text-[color:var(--ink)]">
              {{ viewModel().dictionary.books.featuredTitle }}
            </h2>
          </div>
          @if (mythicalQuote(); as quote) {
            <div class="max-w-md rounded-[22px] bg-[color:var(--ink)] px-5 py-4 text-white">
              <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-white/60">
                {{ viewModel().dictionary.books.quoteLabel }}
              </p>
              <p class="mt-2 text-lg font-semibold">{{ quote }}</p>
            </div>
          }
        </div>

        <div class="mt-6 grid gap-5 lg:grid-cols-2">
          @for (book of viewModel().featuredBooks; track book.slug) {
            <article class="overflow-hidden border border-[color:var(--border-color)] bg-[rgba(255,252,246,0.86)] sm:rounded-[24px]">
              @if (book.quote) {
                <section class="relative bg-[linear-gradient(135deg,rgba(18,27,44,0.98),rgba(27,72,143,0.94))] px-5 py-6 text-white md:px-6">
                  <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-white/55">
                    {{ viewModel().dictionary.books.quoteLabel }}
                  </p>
                  <p class="mt-4 max-w-xl font-[var(--font-display)] text-2xl font-semibold leading-[1.35] md:text-[1.85rem]">
                    “{{ book.quote }}”
                  </p>
                  <div class="mt-5 flex items-center gap-3 text-sm text-white/68">
                    <span class="h-px w-8 bg-white/30"></span>
                    <span>{{ book.title }}</span>
                  </div>
                </section>
              }

              <div class="p-5 md:p-6">
                <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
                  {{ book.category }}
                </p>
                <h3 class="mt-3 text-2xl font-semibold text-[color:var(--ink)]">{{ book.title }}</h3>
                @if (book.originalTitle) {
                  <p class="mt-1 text-sm leading-6 text-[color:var(--muted)]">{{ book.originalTitle }}</p>
                }
                <div class="mt-5 grid gap-4">
                  <section class="border-l-2 border-[color:var(--accent)] pl-4">
                    <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                      {{ viewModel().dictionary.books.takeawayLabel }}
                    </p>
                    <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ book.takeaway }}</p>
                  </section>
                  <section class="border-l-2 border-[color:var(--highlight)] pl-4">
                    <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                      {{ viewModel().dictionary.books.recommendationLabel }}
                    </p>
                    <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ book.recommendation }}</p>
                  </section>
                </div>
              </div>
            </article>
          }
        </div>
      </section>

      <section class="grid gap-6">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
              {{ viewModel().dictionary.books.groups }}
            </p>
            <h2 class="mt-2 font-[var(--font-display)] text-3xl font-semibold text-[color:var(--ink)]">
              {{ viewModel().dictionary.books.groupsTitle }}
            </h2>
          </div>
          <p class="max-w-xl text-sm leading-7 text-[color:var(--muted)]">{{ viewModel().module.philosophy }}</p>
        </div>

        <div class="grid gap-6">
          @for (group of viewModel().groupedBooks; track group.category) {
            <section class="border border-[color:var(--border-color)] bg-white p-6 sm:rounded-[28px] md:p-8">
              <div class="max-w-3xl">
                <h3 class="text-2xl font-semibold text-[color:var(--ink)]">{{ group.title }}</h3>
                <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">{{ group.description }}</p>
              </div>

              <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                @for (book of group.books; track book.slug) {
                  <article class="overflow-hidden border border-[color:var(--border-color)] bg-[color:var(--panel)] sm:rounded-[22px]">
                    @if (book.quote) {
                      <section class="bg-[linear-gradient(180deg,rgba(255,248,236,0.96),rgba(241,246,255,0.9))] px-4 py-4">
                        <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                          {{ viewModel().dictionary.books.quoteLabel }}
                        </p>
                        <p class="mt-3 text-base font-semibold leading-7 text-[color:var(--ink)]">
                          “{{ book.quote }}”
                        </p>
                      </section>
                    }

                    <div class="p-4">
                      <h4 class="text-lg font-semibold text-[color:var(--ink)]">{{ book.title }}</h4>
                      @if (book.originalTitle) {
                        <p class="mt-1 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">{{ book.originalTitle }}</p>
                      }
                      <p class="mt-3 text-sm leading-7 text-[color:var(--muted)]">{{ book.summary }}</p>
                      <div class="mt-4 grid gap-3">
                        <section>
                          <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                            {{ viewModel().dictionary.books.takeawayLabel }}
                          </p>
                          <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ book.takeaway }}</p>
                        </section>
                        <section>
                          <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                            {{ viewModel().dictionary.books.recommendationLabel }}
                          </p>
                          <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ book.recommendation }}</p>
                        </section>
                      </div>
                    </div>
                  </article>
                }
              </div>
            </section>
          }
        </div>
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly parentParamMap = toSignal((this.route.parent?.paramMap ?? this.route.paramMap), {
    initialValue: (this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap),
  });

  readonly locale = computed(() => getLocale(this.parentParamMap().get('locale')));
  readonly viewModel = computed(() => getBooksViewModel(this.locale()));
  readonly mythicalQuote = computed(
    () => this.viewModel().featuredBooks.find((book) => !!book.quote)?.quote ?? null,
  );
}
