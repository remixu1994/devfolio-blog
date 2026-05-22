import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { getHomeViewModel, getLocale } from '../site-content';

type SelectedWork = {
  eyebrow: string;
  title: string;
  summary: string;
};

type HomeCopy = {
  subHeadline: string;
  heroTitle: string;
  heroDescription: string;
  ctaResume: string;
  ctaArchitecture: string;
  ctaBlog: string;
  focusEyebrow: string;
  focusTitle: string;
  engineeringFocus: string[];
  selectedWorkEyebrow: string;
  selectedWorkTitle: string;
  selectedWork: SelectedWork[];
  latestArticlesEyebrow: string;
  latestArticlesTitle: string;
  readingEyebrow: string;
  readingTitle: string;
  readingCta: string;
  readingDirections: string[];
  contactEyebrow: string;
  contactTitle: string;
  contactResume: string;
};

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="grid gap-6 lg:grid-cols-[1.22fr_0.78fr]">
      <article class="border border-[color:var(--border-color)] bg-[linear-gradient(135deg,rgba(255,250,243,0.96),rgba(234,239,247,0.94))] p-6 shadow-[0_22px_60px_rgba(23,24,28,0.08)] sm:rounded-[28px] md:p-10">
        <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent)]">{{ homeCopy().subHeadline }}</p>
        <h1 class="mt-4 max-w-4xl font-[var(--font-display)] text-[1.95rem] font-semibold leading-[1.15] text-[color:var(--ink)] sm:text-4xl md:text-6xl">
          {{ homeCopy().heroTitle }}
        </h1>
        <p class="mt-5 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base md:leading-8">{{ homeCopy().heroDescription }}</p>

        <div class="mt-7 flex flex-wrap gap-3">
          <a
            [routerLink]="['/', locale(), 'resume']"
            class="rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_28px_rgba(15,91,216,0.18)] transition hover:bg-[color:var(--accent-strong)]"
          >
            {{ homeCopy().ctaResume }}
          </a>
          <a
            [routerLink]="['/', locale(), 'architecture']"
            class="rounded-full border border-[color:var(--border-color)] bg-white/70 px-5 py-3 text-sm font-medium text-[color:var(--ink)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          >
            {{ homeCopy().ctaArchitecture }}
          </a>
          <a
            [routerLink]="['/', locale(), 'blog']"
            class="rounded-full border border-[color:var(--border-color)] bg-white/70 px-5 py-3 text-sm font-medium text-[color:var(--ink)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
          >
            {{ homeCopy().ctaBlog }}
          </a>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          @for (metric of viewModel().featured.metrics; track metric.label) {
            <div class="border border-[color:var(--border-color)] bg-white/72 p-4 sm:rounded-[18px]">
              <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ metric.label }}</p>
              <p class="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{{ metric.value }}</p>
            </div>
          }
        </div>
      </article>

      <aside class="grid gap-6">
        <article class="border border-[color:var(--border-color)] bg-[color:var(--ink)] p-6 text-white sm:rounded-[28px]">
          <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-white/60">{{ homeCopy().focusEyebrow }}</p>
          <h2 class="mt-3 font-[var(--font-display)] text-2xl font-semibold">{{ homeCopy().focusTitle }}</h2>
          <div class="mt-5 grid gap-3">
            @for (item of homeCopy().engineeringFocus; track item) {
              <div class="border border-white/12 bg-white/6 px-4 py-3 sm:rounded-[16px]">
                <p class="text-sm font-medium">{{ item }}</p>
              </div>
            }
          </div>
        </article>

        <article class="border border-[color:var(--border-color)] bg-white/86 p-6 sm:rounded-[28px]">
          <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ homeCopy().contactEyebrow }}</p>
          <h2 class="mt-3 text-xl font-semibold text-[color:var(--ink)]">{{ homeCopy().contactTitle }}</h2>
          <div class="mt-5 grid gap-3 text-sm">
            <a [routerLink]="['/', locale(), 'resume']" class="border border-[color:var(--border-color)] bg-[color:var(--panel)] px-4 py-3 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] sm:rounded-[14px]">
              {{ homeCopy().contactResume }}
            </a>
            <a href="https://github.com/remixu1994" target="_blank" rel="noopener noreferrer" class="border border-[color:var(--border-color)] bg-[color:var(--panel)] px-4 py-3 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] sm:rounded-[14px]">GitHub</a>
            <a href="mailto:yueming.xu@afry.com" class="border border-[color:var(--border-color)] bg-[color:var(--panel)] px-4 py-3 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] sm:rounded-[14px]">Email</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" class="border border-[color:var(--border-color)] bg-[color:var(--panel)] px-4 py-3 transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] sm:rounded-[14px]">LinkedIn</a>
          </div>
        </article>
      </aside>
    </section>

    <section class="mt-8 border border-[color:var(--border-color)] bg-[rgba(255,249,240,0.8)] p-5 sm:rounded-[28px] md:mt-10 md:p-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ homeCopy().selectedWorkEyebrow }}</p>
          <h2 class="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[color:var(--ink)] md:text-3xl">{{ homeCopy().selectedWorkTitle }}</h2>
        </div>
        <a [routerLink]="['/', locale(), 'architecture']" class="text-sm text-[color:var(--accent)]">{{ viewModel().dictionary.nav.architecture }}</a>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        @for (item of homeCopy().selectedWork; track item.title) {
          <article class="border border-[color:var(--border-color)] bg-white/82 p-5 sm:rounded-[18px]">
            <p class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.26em] text-[color:var(--accent)]">{{ item.eyebrow }}</p>
            <h3 class="mt-2 text-lg font-semibold text-[color:var(--ink)]">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ item.summary }}</p>
          </article>
        }
      </div>

      <div class="mt-6 grid gap-5">
        @for (item of viewModel().featured.featuredCases; track item.slug) {
          <a
            [routerLink]="['/', locale(), 'architecture', item.slug]"
            class="grid gap-3 border border-[color:var(--border-color)] bg-white/86 px-5 py-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(23,24,28,0.08)] sm:rounded-[18px] md:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div>
              <h3 class="text-xl font-semibold text-[color:var(--ink)]">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ item.summary }}</p>
            </div>
            <span class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.26em] text-[color:var(--muted)]">{{ item.updatedAt }}</span>
          </a>
        }
      </div>
    </section>

    <section class="mt-8 border border-[color:var(--border-color)] bg-white sm:rounded-[28px] md:mt-10">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-[color:var(--border-color)] px-5 py-5 md:px-8 md:py-6">
        <div>
          <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ homeCopy().latestArticlesEyebrow }}</p>
          <h2 class="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[color:var(--ink)] md:text-3xl">{{ homeCopy().latestArticlesTitle }}</h2>
        </div>
        <a [routerLink]="['/', locale(), 'blog']" class="text-sm text-[color:var(--accent)]">{{ viewModel().dictionary.nav.blog }}</a>
      </div>

      <div class="divide-y divide-[color:var(--border-color)]">
        @for (post of viewModel().featured.recentPosts; track post.id) {
          <a
            [routerLink]="['/', locale(), 'blog', post.slug]"
            class="grid gap-3 px-5 py-5 transition hover:bg-[color:var(--panel)] md:grid-cols-[8rem_minmax(0,1fr)] md:px-8 md:py-6"
          >
            <div class="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
              <p>{{ post.updatedAt }}</p>
              @if (post.series) {
                <p class="mt-2 text-[color:var(--accent)]">{{ post.series }}</p>
              }
            </div>
            <div>
              <h3 class="text-xl font-semibold text-[color:var(--ink)]">{{ post.title }}</h3>
              <p class="mt-2 text-sm leading-7 text-[color:var(--muted)]">{{ post.summary }}</p>
            </div>
          </a>
        }
      </div>
    </section>

    <section class="mt-8 border border-[color:var(--border-color)] bg-[rgba(255,252,246,0.86)] p-5 sm:rounded-[28px] md:mt-10 md:p-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)]">{{ homeCopy().readingEyebrow }}</p>
          <h2 class="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[color:var(--ink)] md:text-3xl">{{ homeCopy().readingTitle }}</h2>
        </div>
        <a [routerLink]="['/', locale(), 'books']" class="rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[color:var(--accent)]">
          {{ homeCopy().readingCta }}
        </a>
      </div>

      <div class="mt-5 grid gap-3 md:grid-cols-2">
        @for (item of homeCopy().readingDirections; track item) {
          <div class="border border-[color:var(--border-color)] bg-white px-4 py-3 text-sm text-[color:var(--muted)] sm:rounded-[14px]">{{ item }}</div>
        }
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

  readonly homeCopy = computed<HomeCopy>(() => {
    if (this.locale() === 'en') {
      return {
        subHeadline: 'Backend Engineer · Architecture · AI Engineering',
        heroTitle: 'Building stable, evolvable complex business systems',
        heroDescription:
          'I am a backend engineer focused on complex business systems, microservice governance, system reliability, architecture refactoring, and AI-assisted engineering. This site captures my project work, fitness notes, recipe sharing, technical writing, and resume.',
        ctaResume: 'View Resume',
        ctaArchitecture: 'Architecture Cases',
        ctaBlog: 'Technical Blog',
        focusEyebrow: 'Engineering Focus',
        focusTitle: 'What I optimize for in delivery',
        engineeringFocus: [
          'Microservice Governance',
          'System Reliability',
          'Architecture Refactoring',
          'AI-assisted Engineering',
        ],
        selectedWorkEyebrow: 'Selected Work',
        selectedWorkTitle: 'Representative engineering outcomes',
        selectedWork: [
          {
            eyebrow: 'Case 01',
            title: 'Microservice Reliability Governance',
            summary: 'Service boundaries, observability, and runtime stability tuning across distributed workloads.',
          },
          {
            eyebrow: 'Case 02',
            title: 'Tenant Isolation and Queue Optimization',
            summary: 'Isolation strategy and queue model refinement to reduce contention and improve throughput.',
          },
          {
            eyebrow: 'Case 03',
            title: 'Web / WCF Unified Domain Model',
            summary: 'Consolidated shared contracts to keep migration-stage systems and tests consistent.',
          },
          {
            eyebrow: 'Case 04',
            title: 'CI/CD and Engineering Workflow Governance',
            summary: 'Unified branch policy, build process, and release controls for safer parallel delivery.',
          },
        ],
        latestArticlesEyebrow: 'Latest Articles',
        latestArticlesTitle: 'Recent writing from the engineering log',
        readingEyebrow: 'Reading & Thinking',
        readingTitle: 'Core reading directions',
        readingCta: 'View Bookshelf',
        readingDirections: [
          'Architecture and domain modeling',
          'Refactoring and code quality',
          'System reliability and observability',
          'AI engineering and product loops',
        ],
        contactEyebrow: 'Contact / Resume',
        contactTitle: 'Open to architecture and engineering collaboration',
        contactResume: 'Open Resume',
      };
    }

    return {
      subHeadline: '后端工程师 · 架构实践 · AI Engineering',
      heroTitle: '构建稳定、可演进的复杂业务系统',
      heroDescription:
        '我是一名后端工程师，长期关注复杂业务系统、微服务治理、系统稳定性、架构重构与 AI 工具化实践。这个站点用于沉淀我的项目经验、健身记录、食谱分享、技术博客和职业简历。',
      ctaResume: '查看简历',
      ctaArchitecture: '架构案例',
      ctaBlog: '技术博客',
      focusEyebrow: '工程能力',
      focusTitle: '当前重点投入的工程方向',
      engineeringFocus: ['Microservice Governance', 'System Reliability', 'Architecture Refactoring', 'AI-assisted Engineering'],
      selectedWorkEyebrow: '精选项目',
      selectedWorkTitle: '代表性的工程实践',
      selectedWork: [
        {
          eyebrow: '案例 01',
          title: '微服务稳定性治理',
          summary: '围绕服务边界、可观测性与运行时指标，持续优化分布式系统稳定性。',
        },
        {
          eyebrow: '案例 02',
          title: '租户隔离与消息队列优化',
          summary: '通过隔离策略和队列模型调优，降低资源竞争并提升吞吐。',
        },
        {
          eyebrow: '案例 03',
          title: 'Web / WCF 模型统一',
          summary: '统一迁移期共享模型与接口契约，降低新旧系统协作与测试成本。',
        },
        {
          eyebrow: '案例 04',
          title: 'CI/CD 与工程流程治理',
          summary: '通过分支策略、构建链路和发布流程约束，提升协作交付质量。',
        },
      ],
      latestArticlesEyebrow: '最新博客',
      latestArticlesTitle: '最近沉淀的工程与架构文章',
      readingEyebrow: 'Reading & Thinking',
      readingTitle: '核心阅读方向',
      readingCta: '查看书单',
      readingDirections: ['架构设计与领域建模', '重构与代码质量', '系统稳定性与可观测性', 'AI 工程实践与产品化'],
      contactEyebrow: '联系 / 简历',
      contactTitle: '欢迎交流复杂系统与工程实践',
      contactResume: '打开简历',
    };
  });
}
