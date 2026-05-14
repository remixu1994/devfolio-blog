import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SiteShellComponent } from '@devfolio-blog/ui';
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

  readonly locale = computed(() => getLocale(this.route.snapshot.paramMap.get('locale')));
  readonly dictionary = computed(() => getDictionary(this.locale()));
  readonly links = computed(() => getShellLinks(this.locale()));
  readonly localeSwitch = computed(() => getLocaleSwitch(this.locale(), this.router.url || `/${this.locale()}`));
}
