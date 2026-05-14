import {
  architectureCaseSchema,
  assertSchema,
  postSchema,
  topicShowcaseSchema,
} from '@devfolio-blog/content-schema';
import type {
  ArchitectureCase,
  FeaturedPayload,
  Locale,
  PublicPost,
  ResumeProfile,
  TopicShowcase,
} from '@devfolio-blog/shared-types';

export const resumeProfiles: Record<Locale, ResumeProfile> = {
  zh: {
    locale: 'zh',
    headline: '高级全栈工程师 / 架构设计实践者',
    location: 'Shanghai / Remote',
    contactEmail: 'moon@example.dev',
    intro:
      '4+ 年围绕 Angular、TypeScript、NestJS 与 Node.js 构建业务产品，持续聚焦模块化设计、可维护服务边界和工程交付质量。',
    heroMetrics: [
      { label: 'Experience', value: '4+ Years' },
      { label: 'Primary Stack', value: 'Angular + NestJS' },
      { label: 'Delivery Style', value: 'Monorepo / Self-hosted' },
    ],
    experiences: [
      {
        company: 'Product Engineering',
        role: 'Full-stack Developer',
        period: '2022 - Present',
        summary: '负责业务中台、管理后台和内容平台的前后端设计与交付。',
        highlights: [
          '使用 Nx Monorepo 统一前端、API 与共享类型',
          '参与微服务拆分、接口契约和部署流程设计',
          '持续推动单元测试、代码审查和工程规范',
        ],
      },
      {
        company: 'Architecture Practice',
        role: 'System Design Contributor',
        period: '2021 - 2022',
        summary: '围绕可扩展系统设计沉淀案例，包括权限、内容与监控链路。',
        highlights: [
          '设计模块边界与领域建模',
          '优化 API 设计与数据库访问模式',
          '将原型落地为可维护的生产功能',
        ],
      },
    ],
    skillGroups: [
      {
        title: 'Frontend',
        items: ['Angular', 'TypeScript', 'SCSS', 'TailwindCSS', 'SSR'],
      },
      {
        title: 'Backend',
        items: ['Node.js', 'NestJS', 'Express.js', 'REST API', 'Auth'],
      },
      {
        title: 'Architecture',
        items: ['Nx Monorepo', 'Microservices', 'TypeORM', 'PostgreSQL', 'Unraid'],
      },
    ],
  },
  en: {
    locale: 'en',
    headline: 'Senior Full-stack Engineer / Architecture Practitioner',
    location: 'Shanghai / Remote',
    contactEmail: 'moon@example.dev',
    intro:
      '4+ years building business products with Angular, TypeScript, NestJS, and Node.js, with a strong focus on modular systems and dependable delivery.',
    heroMetrics: [
      { label: 'Experience', value: '4+ Years' },
      { label: 'Primary Stack', value: 'Angular + NestJS' },
      { label: 'Delivery Style', value: 'Monorepo / Self-hosted' },
    ],
    experiences: [
      {
        company: 'Product Engineering',
        role: 'Full-stack Developer',
        period: '2022 - Present',
        summary: 'Designed and shipped internal platforms, admin apps, and content systems.',
        highlights: [
          'Unified frontend, API, and shared contracts with Nx monorepos',
          'Contributed to service boundaries and deployment workflows',
          'Improved testing, reviews, and delivery standards',
        ],
      },
      {
        company: 'Architecture Practice',
        role: 'System Design Contributor',
        period: '2021 - 2022',
        summary: 'Documented architecture decisions across permissions, content, and observability.',
        highlights: [
          'Defined modular service boundaries',
          'Improved API design and relational data access',
          'Turned prototypes into maintainable production features',
        ],
      },
    ],
    skillGroups: [
      {
        title: 'Frontend',
        items: ['Angular', 'TypeScript', 'SCSS', 'TailwindCSS', 'SSR'],
      },
      {
        title: 'Backend',
        items: ['Node.js', 'NestJS', 'Express.js', 'REST API', 'Auth'],
      },
      {
        title: 'Architecture',
        items: ['Nx Monorepo', 'Microservices', 'TypeORM', 'PostgreSQL', 'Unraid'],
      },
    ],
  },
};

export const architectureCases: Record<Locale, ArchitectureCase[]> = {
  zh: [
    {
      slug: 'content-platform-evolution',
      locale: 'zh',
      title: '内容平台从单体到模块化服务的演进',
      summary: '拆分编辑、发布、鉴权和媒体处理边界，让团队能并行交付。',
      heroImage: '/assets/architecture/content-platform.svg',
      updatedAt: '2026-05-14',
      tags: ['NestJS', 'TypeORM', 'Microservices'],
      published: true,
      challenge: '旧系统耦合严重，发布链路和权限逻辑互相缠绕。',
      stack: ['Nx', 'NestJS', 'PostgreSQL', 'TypeORM', 'Angular'],
      outcomes: ['发布效率提升', '模块依赖收敛', 'API 契约更稳定'],
      body: `## 设计目标

- 将内容编辑、发布和媒体管理拆成清晰模块
- 统一共享 DTO，减少前后端错配
- 为后续独立服务拆分保留边界

## 关键判断

通过模块化单体先收敛边界，再把高变更频模块预留为独立服务候选。`,
    },
    {
      slug: 'observability-dashboard',
      locale: 'zh',
      title: '运营监控大盘的聚合接口设计',
      summary: '通过聚合层把离散服务指标编排成单一业务视图。',
      heroImage: '/assets/architecture/observability.svg',
      updatedAt: '2026-05-10',
      tags: ['Angular', 'API Design', 'Observability'],
      published: true,
      challenge: '多个服务各自暴露指标，前端拼装成本高且不稳定。',
      stack: ['Angular', 'NestJS', 'Redis', 'PostgreSQL'],
      outcomes: ['首屏响应更稳定', '前端查询数下降', '指标语义统一'],
      body: `## 聚合策略

围绕业务动作而不是数据库表组织接口，让首页卡片、趋势图和告警列表都能稳定复用。`,
    },
  ].map((item) => assertSchema(architectureCaseSchema, item)),
  en: [
    {
      slug: 'content-platform-evolution',
      locale: 'en',
      title: 'Evolving a content platform from monolith to modular services',
      summary: 'Separated editing, publishing, auth, and media concerns so teams could ship in parallel.',
      heroImage: '/assets/architecture/content-platform.svg',
      updatedAt: '2026-05-14',
      tags: ['NestJS', 'TypeORM', 'Microservices'],
      published: true,
      challenge: 'The legacy stack mixed publishing, permissions, and media behavior in one place.',
      stack: ['Nx', 'NestJS', 'PostgreSQL', 'TypeORM', 'Angular'],
      outcomes: ['Faster releases', 'Clearer boundaries', 'More reliable API contracts'],
      body: `## Goals

- Separate editing, publishing, and media responsibilities
- Share DTOs between frontend and backend
- Preserve boundaries for future service extraction`,
    },
    {
      slug: 'observability-dashboard',
      locale: 'en',
      title: 'Designing an aggregated operations dashboard API',
      summary: 'Introduced an aggregation layer that turned fragmented metrics into one business-facing view.',
      heroImage: '/assets/architecture/observability.svg',
      updatedAt: '2026-05-10',
      tags: ['Angular', 'API Design', 'Observability'],
      published: true,
      challenge: 'Metrics lived in separate services and forced the frontend to stitch everything together.',
      stack: ['Angular', 'NestJS', 'Redis', 'PostgreSQL'],
      outcomes: ['Steadier first paint', 'Fewer frontend requests', 'Clearer metric semantics'],
      body: `## Aggregation strategy

Organize APIs around user decisions instead of tables so cards, charts, and alerts can evolve without breaking the UI.`,
    },
  ].map((item) => assertSchema(architectureCaseSchema, item)),
};

export const topicShowcases: Record<Locale, TopicShowcase[]> = {
  zh: [
    {
      slug: 'unraid',
      locale: 'zh',
      title: 'Unraid NAS 分享',
      summary: '围绕个人基础设施、自托管服务编排、备份与家庭实验室实践展开。',
      heroImage: '/assets/topics/unraid.svg',
      updatedAt: '2026-05-14',
      tags: ['Unraid', 'NAS', 'Self-hosting'],
      published: true,
      eyebrow: 'Self-hosted Lab',
      cta: '查看 Unraid 专题',
      sections: [
        {
          title: '容器编排',
          description: '整理博客、数据库、监控与工具链在 Unraid 上的运行方式。',
        },
        {
          title: '备份策略',
          description: '记录关键数据、媒体目录与配置文件的分层备份思路。',
        },
      ],
      body: `## 为什么选择 Unraid

它非常适合作为个人产品、内容站和实验服务的统一宿主环境。`,
    },
    {
      slug: 'fitness-ai-agent',
      locale: 'zh',
      title: '健身 AI Agent',
      summary: '展示一个围绕训练计划、动作记录和反馈建议设计的 AI 产品案例。',
      heroImage: '/assets/topics/fitness-agent.svg',
      updatedAt: '2026-05-14',
      tags: ['AI Agent', 'Fitness', 'Product Design'],
      published: true,
      eyebrow: 'AI Product Case',
      cta: '查看 AI Agent 案例',
      sections: [
        {
          title: '问题定义',
          description: '从训练记录碎片化和反馈滞后切入，定义智能教练角色。',
        },
        {
          title: '系统流程',
          description: '覆盖输入采集、计划生成、执行追踪和复盘建议的端到端链路。',
        },
      ],
      body: `## 价值主张

把训练记录、恢复节奏和反馈建议做成可持续使用的智能产品，而不是一次性 demo。`,
    },
  ].map((item) => assertSchema(topicShowcaseSchema, item)),
  en: [
    {
      slug: 'unraid',
      locale: 'en',
      title: 'Unraid NAS Notes',
      summary: 'A home for self-hosted infrastructure, service orchestration, backups, and homelab patterns.',
      heroImage: '/assets/topics/unraid.svg',
      updatedAt: '2026-05-14',
      tags: ['Unraid', 'NAS', 'Self-hosting'],
      published: true,
      eyebrow: 'Self-hosted Lab',
      cta: 'Explore the Unraid topic',
      sections: [
        {
          title: 'Container orchestration',
          description: 'How the blog, database, monitoring, and tooling run together on Unraid.',
        },
        {
          title: 'Backup strategy',
          description: 'A layered backup model for content, media, and configuration files.',
        },
      ],
      body: `## Why Unraid

It is a practical host for personal products, content systems, and experiments that still need reliability.`,
    },
    {
      slug: 'fitness-ai-agent',
      locale: 'en',
      title: 'Fitness AI Agent',
      summary: 'A case study for an AI product shaped around workout planning, tracking, and feedback loops.',
      heroImage: '/assets/topics/fitness-agent.svg',
      updatedAt: '2026-05-14',
      tags: ['AI Agent', 'Fitness', 'Product Design'],
      published: true,
      eyebrow: 'AI Product Case',
      cta: 'Explore the AI agent case',
      sections: [
        {
          title: 'Problem framing',
          description: 'Start from fragmented workout logs and delayed coaching feedback.',
        },
        {
          title: 'System flow',
          description: 'Cover data intake, plan generation, execution tracking, and retrospectives.',
        },
      ],
      body: `## Product direction

The goal is a durable coaching experience, not a throwaway AI demo.`,
    },
  ].map((item) => assertSchema(topicShowcaseSchema, item)),
};

export const seedPosts: PublicPost[] = [
  {
    id: 'post-1',
    slug: 'nx-monorepo-for-content-platforms',
    locale: 'zh',
    title: '为什么内容平台适合用 Nx Monorepo',
    summary: '从共享类型、统一构建和跨应用协作的角度总结 Nx 的实际收益。',
    heroImage: '/assets/blog/nx-monorepo.svg',
    updatedAt: '2026-05-13',
    tags: ['Nx', 'Monorepo', 'Angular', 'NestJS'],
    published: true,
    body: `## 核心原因

当站点、后台、API 和共享模型需要一起演进时，Monorepo 能显著降低协作摩擦。`,
    status: 'published',
    series: 'engineering-foundations',
  },
  {
    id: 'post-2',
    slug: 'designing-a-fitness-agent-loop',
    locale: 'en',
    title: 'Designing a feedback loop for a fitness AI agent',
    summary: 'A walkthrough of logging, recovery signals, and guidance generation.',
    heroImage: '/assets/blog/fitness-loop.svg',
    updatedAt: '2026-05-12',
    tags: ['AI Agent', 'Fitness', 'Product'],
    published: true,
    body: `## Loop design

Reliable coaching depends on the quality of the loop: data intake, context building, recommendation, and reflection.`,
    status: 'published',
    series: 'fitness-agent',
  },
  {
    id: 'post-3',
    slug: 'unraid-service-layout',
    locale: 'zh',
    title: '我的 Unraid 服务布局与目录规范',
    summary: '记录博客、数据库、监控和媒体目录如何在 NAS 上协同运作。',
    heroImage: '/assets/blog/unraid-layout.svg',
    updatedAt: '2026-05-11',
    tags: ['Unraid', 'Self-hosting'],
    published: true,
    body: `## 目录思路

把运行时、持久化数据和备份目录分开，能显著降低迁移成本。`,
    status: 'published',
    series: 'unraid-notes',
  },
].map((item) => assertSchema(postSchema, item));

export function getArchitectureCases(locale: Locale): ArchitectureCase[] {
  return architectureCases[locale];
}

export function getArchitectureCase(locale: Locale, slug: string): ArchitectureCase | undefined {
  return architectureCases[locale].find((item) => item.slug === slug);
}

export function getTopicBySlug(locale: Locale, slug: string): TopicShowcase | undefined {
  return topicShowcases[locale].find((item) => item.slug === slug);
}

export function getFeaturedPayload(locale: Locale): FeaturedPayload {
  return {
    metrics: resumeProfiles[locale].heroMetrics,
    featuredCases: architectureCases[locale].slice(0, 2),
    recentPosts: seedPosts.filter((post) => post.locale === locale).slice(0, 3),
    topicCards: topicShowcases[locale],
  };
}
