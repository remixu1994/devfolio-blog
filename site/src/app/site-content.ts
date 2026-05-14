import {
  getArchitectureCase,
  getArchitectureCases,
  getFeaturedPayload,
  getTopicBySlug,
  resumeProfiles,
  seedPosts,
} from '@devfolio-blog/content-data';
import { dictionaries, normalizeLocale, switchLocale, withLocalePath } from '@devfolio-blog/i18n';
import { renderMarkdown } from '@devfolio-blog/markdown';
import type { Locale } from '@devfolio-blog/shared-types';

export function getDictionary(locale: string) {
  return dictionaries[normalizeLocale(locale)];
}

export function getLocale(value: string | null | undefined): Locale {
  return normalizeLocale(value);
}

export function getShellLinks(locale: Locale) {
  return [
    { label: dictionaries[locale].nav.home, href: withLocalePath(locale) },
    { label: dictionaries[locale].nav.resume, href: withLocalePath(locale, 'resume') },
    { label: dictionaries[locale].nav.architecture, href: withLocalePath(locale, 'architecture') },
    { label: dictionaries[locale].nav.unraid, href: withLocalePath(locale, 'unraid') },
    { label: dictionaries[locale].nav.fitness, href: withLocalePath(locale, 'fitness-ai-agent') },
    { label: dictionaries[locale].nav.blog, href: withLocalePath(locale, 'blog') },
  ];
}

export function getHomeViewModel(locale: Locale) {
  return {
    dictionary: dictionaries[locale],
    featured: getFeaturedPayload(locale),
  };
}

export function getResumeViewModel(locale: Locale) {
  return {
    dictionary: dictionaries[locale],
    resume: resumeProfiles[locale],
  };
}

export function getArchitectureListViewModel(locale: Locale) {
  return {
    dictionary: dictionaries[locale],
    items: getArchitectureCases(locale),
  };
}

export function getArchitectureDetailViewModel(locale: Locale, slug: string) {
  const item = getArchitectureCase(locale, slug);
  return item
    ? {
        dictionary: dictionaries[locale],
        item,
        html: renderMarkdown(item.body),
      }
    : null;
}

export function getTopicViewModel(locale: Locale, slug: string) {
  const item = getTopicBySlug(locale, slug);
  return item
    ? {
        dictionary: dictionaries[locale],
        item,
        html: renderMarkdown(item.body),
      }
    : null;
}

export function getBlogListViewModel(locale: Locale) {
  return {
    dictionary: dictionaries[locale],
    items: seedPosts.filter((post) => post.locale === locale && post.published),
  };
}

export function getBlogDetailViewModel(locale: Locale, slug: string) {
  const item = seedPosts.find((post) => post.locale === locale && post.slug === slug && post.published);
  return item
    ? {
        dictionary: dictionaries[locale],
        item,
        html: renderMarkdown(item.body),
      }
    : null;
}

export function getLocaleSwitch(locale: Locale, currentPath: string) {
  const nextLocale = switchLocale(locale);
  const localizedPrefix = `/${locale}`;
  const suffix = currentPath.startsWith(localizedPrefix) ? currentPath.slice(localizedPrefix.length) : '';

  return {
    label: nextLocale.toUpperCase(),
    href: withLocalePath(nextLocale, suffix || ''),
  };
}
