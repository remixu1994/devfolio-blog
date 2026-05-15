import type { Locale } from '@devfolio-blog/shared-types';

export interface SiteDictionary {
  brand: string;
  tagline: string;
  nav: {
    home: string;
    resume: string;
    architecture: string;
    unraid: string;
    fitness: string;
    blog: string;
    admin: string;
  };
  home: {
    heroTitle: string;
    heroBody: string;
    featuredLabel: string;
    recentLabel: string;
    contactLabel: string;
  };
  resume: {
    title: string;
    download: string;
  };
  architecture: {
    title: string;
    intro: string;
  };
  blog: {
    title: string;
    intro: string;
    empty: string;
  };
  topic: {
    sections: string;
    stack: string;
  };
  footer: string;
}

export const dictionaries: Record<Locale, SiteDictionary> = {
  zh: {
    brand: 'Moon Devfolio',
    tagline: '全栈工程、系统架构、自托管实践与 AI 产品化',
    nav: {
      home: '首页',
      resume: '简历',
      architecture: '架构设计',
      unraid: 'Unraid NAS',
      fitness: '健身 AI Agent',
      blog: '技术博客',
      admin: '后台',
    },
    home: {
      heroTitle: '把复杂系统做成可靠产品的全栈工程师',
      heroBody:
        '围绕 Angular、NestJS、Nx Monorepo、微服务与自托管基础设施，持续沉淀可交付的工程能力与设计方法。',
      featuredLabel: '代表架构',
      recentLabel: '最新写作',
      contactLabel: '联系与协作',
    },
    resume: {
      title: '在线简历',
      download: '下载 PDF 简历',
    },
    architecture: {
      title: '过往架构设计',
      intro: '从业务拆解、服务边界到可观测性与交付流程，记录关键设计判断。',
    },
    blog: {
      title: '技术博客',
      intro: '围绕架构、工程效率、NAS 自托管和 AI Agent 实战进行沉淀。',
      empty: '暂时还没有符合条件的文章。',
    },
    topic: {
      sections: '专题章节',
      stack: '技术栈',
    },
    footer: '基于 Angular、NestJS 与 Nx 构建，记录全栈工程、系统架构和自托管实践。',
  },
  en: {
    brand: 'Moon Devfolio',
    tagline: 'Full-stack engineering, architecture, self-hosting, and AI product work',
    nav: {
      home: 'Home',
      resume: 'Resume',
      architecture: 'Architecture',
      unraid: 'Unraid NAS',
      fitness: 'Fitness AI Agent',
      blog: 'Blog',
      admin: 'Admin',
    },
    home: {
      heroTitle: 'A full-stack engineer who turns complex systems into reliable products',
      heroBody:
        'Focused on Angular, NestJS, Nx monorepos, microservice architecture, and self-hosted infrastructure that ships.',
      featuredLabel: 'Featured architecture',
      recentLabel: 'Recent writing',
      contactLabel: 'Contact',
    },
    resume: {
      title: 'Resume',
      download: 'Download PDF resume',
    },
    architecture: {
      title: 'Architecture Cases',
      intro: 'A record of system design choices across domain boundaries, observability, and delivery workflows.',
    },
    blog: {
      title: 'Technical Blog',
      intro: 'Notes on architecture, delivery quality, NAS self-hosting, and AI agent experiments.',
      empty: 'No published posts yet.',
    },
    topic: {
      sections: 'Topic sections',
      stack: 'Tech stack',
    },
    footer: 'Built with Angular, NestJS, and Nx to document full-stack engineering, architecture, and self-hosted practice.',
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'zh' || value === 'en';
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : 'zh';
}

export function switchLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'en' : 'zh';
}

export function withLocalePath(locale: Locale, path = ''): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`;
}
