import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteShellComponent } from '@devfolio-blog/ui';
import { filter, map, startWith } from 'rxjs';
import { getDictionary, getLocale, getLocaleSwitch, getShellLinks } from '../site-content';

@Component({
  standalone: true,
  imports: [RouterOutlet, SiteShellComponent],
  template: `
    <df-site-shell
      [brand]="dictionary().brand"
      [tagline]="dictionary().tagline"
      [links]="links()"
      [homeHref]="links()[0]?.href ?? '/zh'"
      [switchHref]="localeSwitch().href"
      [switchLabel]="localeSwitch().label"
      [footer]="dictionary().footer"
    >
      <router-outlet />
    </df-site-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocaleShellPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event.constructor.name === 'NavigationEnd'),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly locale = computed(() => getLocale(this.paramMap().get('locale')));
  readonly dictionary = computed(() => getDictionary(this.locale()));
  readonly links = computed(() => getShellLinks(this.locale()));
  readonly localeSwitch = computed(() => getLocaleSwitch(this.locale(), this.currentUrl() || `/${this.locale()}`));
}
