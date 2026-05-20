import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { getBooksViewModel, getLocale } from '../site-content';
import { BookCardComponent } from '../components/book-card.component';

@Component({
  standalone: true,
  imports: [BookCardComponent],
  template: `
    <section class="grid gap-8">
      <!-- Hero: intro + quote + category chips -->
      <section class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="border border-(--border-color) bg-[rgba(255,250,243,0.92)] p-6 sm:rounded-[28px] md:p-8">
          <p class="font-(--font-mono) text-[11px] uppercase tracking-[0.32em] text-(--accent)">
            {{ viewModel().module.eyebrow }}
          </p>
          <h1 class="mt-4 font-(family-name:--font-display) text-4xl font-semibold text-(--ink) md:text-6xl">
            {{ viewModel().module.title }}
          </h1>
          <p class="mt-4 max-w-3xl text-base leading-8 text-(--muted)">
            {{ viewModel().module.summary }}
          </p>
          <article class="mt-6 rounded-3xl border border-(--border-color) bg-white/80 p-5 text-sm leading-8 text-(--muted)">
            {{ viewModel().module.philosophy }}
          </article>
        </div>

        <div class="grid gap-4">
          <section class="rounded-[28px] border border-(--border-color) bg-white p-6 md:p-8">
            <p class="font-(--font-mono) text-base uppercase tracking-[0.3em] text-(--muted)">
              {{ viewModel().dictionary.books.quoteLabel }}
            </p>
            <p class="mt-4 font-(family-name:--font-display) text-3xl font-semibold leading-[1.3] text-(--ink)">
              "{{ mythicalQuote() }}"
            </p>
            <div class="mt-5 flex items-center gap-3 text-sm text-(--muted)">
              <span class="h-px w-8 bg-(--border-color)"></span>
              <span>Kent Beck</span>
            </div>
          </section>

          <section class="rounded-[28px] border border-(--border-color) bg-white p-6">
            <p class="font-(--font-mono) text-[10px] uppercase tracking-[0.28em] text-(--muted)">
              {{ viewModel().dictionary.books.groups }}
            </p>
            <div class="mt-4 flex flex-wrap gap-3">
              @for (group of viewModel().groupedBooks; track group.category) {
                <span class="rounded-full border border-(--border-color) bg-(--panel) px-4 py-2 text-sm text-(--ink)">
                  {{ group.title }}
                </span>
              }
            </div>
          </section>
        </div>
      </section>

      <!-- Featured books: highlighted picks with quotes -->
      <section class="border border-(--border-color) bg-white p-6 sm:rounded-[28px] md:p-8">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="font-(--font-mono) text-[11px] uppercase tracking-[0.28em] text-(--muted)">
              {{ viewModel().dictionary.books.featured }}
            </p>
            <h2 class="mt-2 font-(family-name:--font-display) text-3xl font-semibold text-(--ink)">
              {{ viewModel().dictionary.books.featuredTitle }}
            </h2>
          </div>
        </div>

        <div class="mt-6 grid auto-rows-fr gap-5 lg:grid-cols-2">
          @for (book of viewModel().featuredBooks; track book.slug) {
            <app-book-card class="block h-full"
              variant="featured"
              [book]="book"
              [quoteLabel]="viewModel().dictionary.books.quoteLabel"
              [takeawayLabel]="viewModel().dictionary.books.takeawayLabel"
              [recommendationLabel]="viewModel().dictionary.books.recommendationLabel"
            />
          }
        </div>
      </section>

      <!-- Book groups: categorized grid of all books -->
      <section class="grid gap-6">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="font-(--font-mono) text-[11px] uppercase tracking-[0.28em] text-(--muted)">
              {{ viewModel().dictionary.books.groups }}
            </p>
            <h2 class="mt-2 font-(family-name:--font-display) text-3xl font-semibold text-(--ink)">
              {{ viewModel().dictionary.books.groupsTitle }}
            </h2>
          </div>
          <p class="max-w-xl text-sm leading-7 text-(--muted)">{{ viewModel().module.philosophy }}</p>
        </div>

        <div class="grid gap-6">
          @for (group of viewModel().groupedBooks; track group.category) {
            <section class="border border-(--border-color) bg-white p-6 sm:rounded-[28px] md:p-8">
              <div class="max-w-3xl">
                <h3 class="text-2xl font-semibold text-(--ink)">{{ group.title }}</h3>
                <p class="mt-3 text-sm leading-7 text-(--muted)">{{ group.description }}</p>
              </div>

              <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                @for (book of group.books; track book.slug) {
                  <app-book-card
                    variant="grouped"
                    [book]="book"
                    [quoteLabel]="viewModel().dictionary.books.quoteLabel"
                    [takeawayLabel]="viewModel().dictionary.books.takeawayLabel"
                    [recommendationLabel]="viewModel().dictionary.books.recommendationLabel"
                  />
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
    initialValue: this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap,
  });

  readonly locale = computed(() => getLocale(this.parentParamMap().get('locale')));
  readonly viewModel = computed(() => getBooksViewModel(this.locale()));
  readonly mythicalQuote = computed(
    () => this.viewModel().featuredBooks.find((book) => !!book.quote)?.quote ?? null,
  );
}
