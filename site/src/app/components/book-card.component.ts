import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { BookRecommendation } from '@devfolio-blog/shared-types';

@Component({
  standalone: true,
  selector: 'app-book-card',
  host: {
    class: 'block h-full',
  },
  template: `
    @let isFeatured = variant === 'featured';

    <article
      [class]="isFeatured
        ? 'flex h-full flex-col overflow-hidden border border-(--border-color) bg-[rgba(255,252,246,0.86)] sm:rounded-3xl'
        : 'flex h-full flex-col overflow-hidden border border-(--border-color) bg-(--panel) sm:rounded-[22px]'"
    >
      <div [class]="isFeatured ? 'flex h-full flex-col p-5 md:p-6' : 'flex h-full flex-col p-4'">
        @if (isFeatured && book.category) {
          <p class="font-(--font-mono) text-[10px] uppercase tracking-[0.28em] text-(--accent)">
            {{ book.category }}
          </p>
        }

        <div class="flex items-start" [class]="isFeatured ? 'mt-3 gap-4' : 'gap-3'">
          @if (book.coverImage) {
            <img
              [src]="book.coverImage"
              [alt]="book.title"
              [class]="isFeatured
                ? 'h-44 w-28 shrink-0 rounded-[12px] border border-(--border-color) bg-white object-cover shadow-sm'
                : 'h-40 w-28 shrink-0 rounded-[10px] border border-(--border-color) bg-white object-cover shadow-sm'"
              loading="lazy"
              referrerpolicy="no-referrer"
            />
          }

          <div class="min-w-0">
            <h3 [class]="isFeatured ? 'text-2xl font-semibold leading-8 text-(--ink)' : 'text-lg font-semibold leading-7 text-(--ink)'">
              {{ book.title }}
            </h3>

            @if (book.originalTitle) {
              <p
                [class]="isFeatured
                  ? 'mt-1 text-sm leading-6 text-(--muted)'
                  : 'mt-1 text-xs uppercase tracking-[0.14em] text-(--muted)'"
              >
                {{ book.originalTitle }}
              </p>
            }

            @if (!isFeatured && book.summary) {
              <p class="mt-2 text-sm leading-7 text-(--muted)">
                {{ book.summary }}
              </p>
            }
          </div>
        </div>

        <div
          [class]="isFeatured
            ? 'mt-5'
            : 'mt-4 flex-1 rounded-[16px] bg-white/45 p-4'"
        >
          <div class="grid gap-4">
            <section class="border-l-2 border-(--accent) pl-4">
              <p class="font-(--font-mono) text-[10px] uppercase tracking-[0.28em] text-(--muted)">
                {{ takeawayLabel }}
              </p>

              <p class="mt-2 text-sm leading-7 text-(--muted)">
                {{ book.takeaway }}
              </p>
            </section>

            <section class="border-l-2 border-(--highlight) pl-4">
              <p class="font-(--font-mono) text-[10px] uppercase tracking-[0.28em] text-(--muted)">
                {{ recommendationLabel }}
              </p>

              <p class="mt-2 text-sm leading-7 text-(--muted)">
                {{ book.recommendation }}
              </p>
            </section>

            @if (book.quote) {
              <section class="border-l-2 border-(--ink) pl-4">
                <p class="font-(--font-mono) text-[10px] uppercase tracking-[0.28em] text-(--muted)">
                  {{ quoteLabel }}
                </p>

                <p class="mt-2 text-sm leading-7 text-(--muted)">
                  {{ book.quote }}
                </p>
              </section>
            }
          </div>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCardComponent {
  @Input({ required: true }) book!: BookRecommendation;
  @Input({ required: true }) quoteLabel!: string;
  @Input({ required: true }) takeawayLabel!: string;
  @Input({ required: true }) recommendationLabel!: string;
  @Input() variant: 'featured' | 'grouped' = 'featured';
}
