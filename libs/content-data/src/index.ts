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
    name: 'Yueming Xu',
    title: '全栈工程师',
    headline: '10 年软件开发经验 / 5 年系统架构设计经验的全栈工程师',
    location: '成都',
    gender: '男',
    age: '32 岁',
    contactEmail: '',
    intro:
      '专注企业级应用、分布式系统与跨平台 Web 解决方案，擅长用清晰架构、持续重构、自动化交付和 AI 辅助工程实践构建可维护、可扩展、安全的软件系统。',
    heroMetrics: [
      { label: '软件开发经验', value: '10 年' },
      { label: '架构设计经验', value: '5 年' },
      { label: '核心技术栈', value: 'C# / ASP.NET Core' },
    ],
    summaryPoints: [
      '具备 C#、ASP.NET Core、RESTful API 设计与 SQL 数据方案的扎实工程经验。',
      '覆盖 Blazor、React、Next.js、Vue、JavaScript 等多种前端与跨平台 Web 技术。',
      '熟悉微服务、回归测试、云原生开发、CI/CD 自动化与工程最佳实践。',
      '持续使用 Codex、Claude Code 等 AI 辅助工具提升研发效率、代码质量和重构节奏。',
    ],
    projects: [
      {
        title: 'Afry - TCAWeb System',
        role: '全栈开发工程师',
        period: '2023-10 - 至今',
        summary: '为嵌入式系统设计并交付跨平台 Web 服务架构，支持 Linux ARM、Linux x64 与 Windows 环境。',
        stack: ['ASP.NET Core', 'REST API', 'Blazor', 'WCF'],
        highlights: [
          '开发 ASP.NET Core RESTful API 与基于 Blazor 的 Web GUI，并沉淀可复用前端组件。',
          '设计内部 HTTPS/SSL 证书签发方案，用于内部环境下的安全通信。',
          '通过标准化共享接口和可复用测试流程，为遗留 WCF 服务与新 Web API 构建回归测试方案。',
        ],
      },
      {
        title: '北森云 - 客开服务稳定性巡检',
        role: '稳定性改进负责人',
        period: '2022-03 - 2023-03',
        summary: '围绕客开效能组与开放平台相关服务开展稳定性巡检，覆盖 100+ 服务的指标监控、风险分析、异常定位与事故复盘。',
        stack: ['Elasticsearch', 'Kafka', 'Docker', 'Redis', 'Cassandra', 'ASP.NET C#', 'SQL', 'Grafana', 'Kibana'],
        highlights: [
          '基于服务监控报警、Grafana 服务指标与 Kibana 查询服务链路 Trace 日志，分析服务潜在风险。',
          '在服务异常时进行 Dump 分析、异常定位和事故复盘，形成稳定性改进闭环。',
          '参与开放平台接口升级，集成 Kong 网关统一的鉴权、限频和限流策略。',
          '升级共享框架与基础组件，提升平台可靠性、可维护性和分布式服务协同能力。',
        ],
      },
      {
        title: '北森云 - 框架搭建和 Infrastructure 设计',
        role: '基础框架设计与开发',
        period: '2020-03 - 2022-03',
        summary: '面向客开定制化交付场景搭建基础层框架，封装通用 Infrastructure 能力，提升多租户场景下的开发一致性、运行可靠性和问题定位效率。',
        stack: ['ASP.NET Core', 'Microservices', 'Infrastructure', 'Tenant Isolation', 'Logging', 'Distributed Lock'],
        highlights: [
          '负责框架搭建、租户隔离、上下文管理和日志跟踪，支撑客开场景下的工程一致性。',
          '封装 Infrastructure 层，沉淀弹性策略、分布式锁和通用基础设施能力。',
          '统一请求上下文、租户上下文和日志链路，降低跨模块开发和排障成本。',
          '为后续定制开发、服务重构和任务编排提供可复用的基础能力。',
        ],
      },
      {
        title: '北森云 - 客开定制化开发与重构',
        role: '高级软件工程师',
        period: '2020-03 - 2022-03',
        summary: '参与客户定制 HR SaaS 项目的评估、架构设计、开发与交付，覆盖组织、绩效、目标管理、数据集成和财务凭证等业务场景。',
        stack: ['Unit Testing', 'ORM', 'Microservices', 'Kafka', 'Redis', 'CI/CD'],
        highlights: [
          '设计 Kafka 数据变化 Trigger 封装，解决业务触发口场景缺失问题。',
          '标准化产品财务凭证开发，设计任务调度组件与 Kafka、Redis 协同的任务阶段编排和分发机制。',
          '重构服务架构和基础设施组件，应对业务复杂度并提升服务稳定性。',
          '标准化单元测试、开发、测试、发布和 CI/CD 流程，提升交付质量与工程效率。',
        ],
      },
      {
        title: '北森云 - 集成服务重构',
        role: '后端工程师',
        period: '2019-03 - 2021-03',
        summary: '重构主数据同步、消息集成和任务调度链路，提升跨系统数据一致性、异步处理能力和服务稳定性。',
        stack: ['Kafka', 'Redis', 'OAuth 2.0', 'OIDC', 'SSO', 'DataCenter'],
        highlights: [
          '优化主数据同步流程，降低跨服务数据不一致风险。',
          '重构 Kafka 消息集成系统和租户级路由策略，解决上下游服务生产消费不对等导致的超时无响应问题。',
          '参与外部系统单点到北森技术方案设计，熟悉 OAuth 2.0、OIDC 授权协议，并参与非标准厂商客户自研服务的单点场景设计。',
          '参与 DataCenter 数据集成连接项目的任务调度组件设计，使客户或开发人员可以基于页面配置完成定时任务设置，解决数据孤岛问题。',
          '设计 SSO 云迁移方案，并封装北森 SSO SDK 以标准化认证集成。',
        ],
      },
      {
        title: '北森云 - 目标管理系统开发与重构',
        role: '后端工程师',
        period: '2019-03 - 2020-03',
        summary: '负责北森 HR SaaS 平台中目标管理系统的开发迭代与遗留模块重构。',
        stack: ['C#', 'ASP.NET Core', 'IoC', 'Unit Testing', 'Refactoring'],
        highlights: [
          '引入 IoC 框架和单元测试保护，支持遗留代码更安全地重构。',
          '重构业务模块，提升系统可维护性、可扩展性和交付质量。',
          '围绕目标管理业务持续迭代后端能力与服务接口。',
        ],
      },
      {
        title: 'Renwoxing - 签到通外勤考勤系统',
        role: '全栈开发工程师',
        period: '2016-08 - 2019-02',
        summary: '开发外勤人员管理系统，支持户外考勤签到、位置轨迹和外勤活动记录。',
        stack: ['Vue.js', 'ASP.NET MVC', 'ORM', 'WCF', 'MySQL', 'HTML/CSS'],
        highlights: [
          '构建 Vue/HTML 前端页面、ASP.NET MVC 后端功能和 WCF 服务接口。',
          '使用 Dapper ORM 完成 MySQL 数据访问与业务数据持久化。',
          '覆盖从前端交互、后端服务到数据库访问的完整全栈交付。',
        ],
      },
    ],
    experiences: [
      {
        company: '企业级应用交付',
        role: '全栈工程师 / 架构设计参与者',
        period: '2023 - 至今',
        summary: '围绕企业应用、分布式系统和跨平台 Web 产品进行全栈交付，并持续强化系统可维护性与工程自动化。',
        highlights: [
          '使用 C#、ASP.NET Core 与 RESTful API 支撑核心业务服务。',
          '结合 Blazor、React、Next.js、Vue 等技术完成多形态 Web 前端交付。',
          '引入 Codex、Claude Code 等 AI 辅助工程实践，加速重构、测试和文档沉淀。',
        ],
      },
      {
        company: '北森云',
        role: '客开效能组 效能工程师',
        period: '2019 - 2023',
        summary: '负责客开服务稳定性巡检、定制化交付工程化、开放平台能力升级、消息集成重构和任务调度组件设计。',
        highlights: [
          '参与开放平台接口升级，集成 Kong 网关统一的鉴权、限频和限流策略。',
          '参与外部系统单点登录方案设计，覆盖 OAuth 2.0、OIDC 授权协议和客户自研服务单点场景。',
          '重构 Kafka 消息集成、租户级路由和主数据同步链路，提升异步处理稳定性和数据一致性。',
          '设计 DataCenter 数据集成任务调度组件、延迟队列和财务凭证任务编排能力。',
          '负责 100+ 服务稳定性巡检，通过 Grafana 指标、Kibana Trace 日志、Dump 分析和事故复盘定位风险。',
        ],
      },
      {
        company: '软件工程基础',
        role: '软件工程师',
        period: '2016 - 2019',
        summary: '建立企业软件开发基础能力，覆盖后端服务、数据库、Web 交互与交付质量。',
        highlights: [
          '使用 .NET Framework、C#、SQL 等技术完成业务系统开发。',
          '积累从需求理解、功能实现、缺陷修复到上线维护的完整交付经验。',
          '形成对可读代码、可测试设计和持续重构的长期工程偏好。',
        ],
      },
    ],
    skillGroups: [
      {
        title: '后端与架构',
        items: ['C#', '.NET Framework', 'ASP.NET Core', 'RESTful API', '清晰架构', '微服务'],
      },
      {
        title: '前端与 Web',
        items: ['Blazor', 'React', 'Next.js', 'Vue', 'JavaScript', 'Angular'],
      },
      {
        title: '平台与数据',
        items: ['SQL', 'Docker', 'Kubernetes', 'Redis', 'Elasticsearch', 'CI/CD'],
      },
      {
        title: 'AI 辅助工程',
        items: ['Codex', 'Claude Code', '回归测试', '持续重构', '工程文档'],
      },
    ],
    education: [
      {
        school: '成都信息工程大学',
        degree: '软件工程，本科',
        period: '2012 - 2016',
      },
    ],
    languages: [
      { name: '普通话', proficiency: '母语或双语水平' },
      { name: '英语', proficiency: '有限工作能力' },
    ],
    labels: {
      profile: '个人资料',
      location: '所在地',
      gender: '性别',
      age: '年龄',
      drivingLicense: '驾照',
      professionalSummary: '专业摘要',
      projectExperience: '项目经历',
      employmentHistory: '工作经历',
      competences: '能力矩阵',
      education: '教育经历',
      languages: '语言能力',
      focus: '聚焦方向',
    },
    focus: '企业级系统、架构设计、全栈交付与 AI 辅助工程。',
    drivingLicense: 'C',
  },
  en: {
    locale: 'en',
    name: 'Yueming Xu',
    title: 'Full-Stack Engineer',
    headline: 'Full-stack engineer with 10 years in software development and 5 years in architecture design',
    location: 'Chengdu',
    gender: 'Male',
    age: '32',
    contactEmail: '',
    intro:
      'Specialized in enterprise applications, distributed systems, and cross-platform web solutions, with a strong focus on maintainable, scalable, and secure software through clean architecture and engineering best practices.',
    heroMetrics: [
      { label: 'Software Development', value: '10 Years' },
      { label: 'Architecture Design', value: '5 Years' },
      { label: 'Primary Stack', value: 'C# / ASP.NET Core' },
    ],
    summaryPoints: [
      'Strong expertise in C#, ASP.NET Core, RESTful API design, and SQL-based data solutions.',
      'Full-stack web development across Blazor, React, Next.js, Vue, JavaScript, and Angular.',
      'Experienced in microservices, regression testing, cloud-native development, CI/CD automation, and continuous refactoring.',
      'Uses Codex and Claude Code to improve delivery speed, code quality, documentation, and refactoring workflows.',
    ],
    projects: [
      {
        title: 'Afry - TCAWeb System',
        role: 'Full-Stack Developer',
        period: '2023-10 - Present',
        summary: 'Designed a cross-platform web service architecture for embedded systems, supporting Linux ARM, Linux x64, and Windows environments.',
        stack: ['ASP.NET Core', 'REST API', 'Blazor', 'WCF'],
        highlights: [
          'Developed ASP.NET Core RESTful APIs and a Blazor-based web GUI with reusable frontend components.',
          'Designed an internal HTTPS/SSL certificate issuance solution for secure communication in internal environments.',
          'Built regression test solutions for legacy WCF services and new Web APIs by standardizing shared interfaces and reusable test workflows.',
        ],
      },
      {
        title: 'Beisen Cloud - Custom Service Stability Inspection',
        role: 'Stability Inspection Lead',
        period: '2022-03 - 2023-03',
        summary: 'Led stability inspection for custom development services by analyzing potential risks from service metrics, dump analysis, and incident reviews.',
        stack: ['Elasticsearch', 'Kafka', 'Docker', 'Redis', 'Cassandra', 'ASP.NET C#', 'SQL'],
        highlights: [
          'Analyzed service metrics to identify potential risks and drive early issue tracking.',
          'Performed dump analysis, exception investigation, and incident reviews when service issues occurred.',
          'Upgraded shared frameworks and components to improve reliability, maintainability, and distributed service coordination.',
        ],
      },
      {
        title: 'Beisen Cloud - Framework and Infrastructure Design',
        role: 'Foundation Framework Design and Development',
        period: '2020-03 - 2022-03',
        summary: 'Built foundational framework capabilities for customer-specific delivery scenarios and encapsulated reusable Infrastructure patterns for multi-tenant consistency, runtime reliability, and easier troubleshooting.',
        stack: ['ASP.NET Core', 'Microservices', 'Infrastructure', 'Tenant Isolation', 'Logging', 'Distributed Lock'],
        highlights: [
          'Built framework foundations for tenant isolation, context management, and log tracing in custom development scenarios.',
          'Encapsulated the Infrastructure layer to provide resilience policies, distributed locks, and reusable platform capabilities.',
          'Standardized request context, tenant context, and log tracing to reduce cross-module development and troubleshooting cost.',
          'Provided reusable foundations for later custom development, service refactoring, and task orchestration work.',
        ],
      },
      {
        title: 'Beisen Cloud - Custom Development and Refactoring',
        role: 'Senior Software Engineer',
        period: '2020-03 - 2022-03',
        summary: 'Participated in the assessment, development, and delivery of customer-specific HR SaaS projects covering organization, performance, and goal management modules.',
        stack: ['Unit Testing', 'Object-relational mapping (ORM)', 'Microservices', 'Kafka', 'CI/CD'],
        highlights: [
          'Designed Kafka data-change trigger abstractions to cover missing business trigger scenarios.',
          'Refactored service architecture and infrastructure components to address business complexity and improve service stability.',
          'Standardized unit testing, development, testing, release, and CI/CD workflows to improve delivery quality and engineering efficiency.',
        ],
      },
      {
        title: 'Beisen Cloud - Integration Services Refactoring',
        role: 'Backend Engineer',
        period: '2019-03 - 2021-03',
        summary: 'Refactored master data synchronization and Kafka-based messaging to improve data consistency, asynchronous processing, and service stability.',
        stack: ['Kafka', 'Redis'],
        highlights: [
          'Optimized master data synchronization to reduce cross-service consistency risks.',
          'Improved Kafka-based messaging workflows for asynchronous processing and task scheduling.',
          'Designed SSO cloud migration solutions and encapsulated the Beisen SSO SDK to standardize authentication integration.',
        ],
      },
      {
        title: 'Beisen Cloud - Goal Management System Development and Refactoring',
        role: 'Backend Engineer',
        period: '2019-03 - 2020-03',
        summary: 'Developed and iterated the goal management system within Beisen’s HR SaaS platform.',
        stack: ['C#', 'ASP.NET Core', 'IoC', 'Unit Testing', 'Refactoring'],
        highlights: [
          'Introduced an IoC framework and unit test protection to support safer legacy code refactoring.',
          'Refactored business modules to improve maintainability, extensibility, and delivery quality.',
          'Continued backend capability and service API iteration around goal management workflows.',
        ],
      },
      {
        title: 'Renwoxing - Qiandaotong Field Attendance System',
        role: 'Full-Stack Developer',
        period: '2016-08 - 2019-02',
        summary: 'Developed a full-stack field workforce management system supporting outdoor attendance check-in, location tracking, and field activity records.',
        stack: ['Vue.js', 'ASP.NET MVC', 'Object-relational mapping (ORM)', 'WCF', 'MySQL', 'HTML/CSS'],
        highlights: [
          'Built Vue/HTML frontend pages, ASP.NET MVC backend features, and WCF service interfaces.',
          'Implemented MySQL data access with Dapper ORM.',
          'Covered full-stack delivery across frontend interactions, backend services, and database access.',
        ],
      },
    ],
    experiences: [
      {
        company: 'Enterprise Application Delivery',
        role: 'Full-Stack Engineer / Architecture Contributor',
        period: '2023 - Present',
        summary: 'Delivering enterprise applications, distributed systems, and cross-platform web products with a focus on maintainability and automation.',
        highlights: [
          'Builds business services with C#, ASP.NET Core, and RESTful API patterns.',
          'Ships web experiences using Blazor, React, Next.js, Vue, and related frontend stacks.',
          'Applies Codex and Claude Code to accelerate refactoring, testing, and engineering documentation.',
        ],
      },
      {
        company: 'Distributed Systems & Platform Engineering',
        role: 'Senior Software Engineer',
        period: '2019 - 2023',
        summary: 'Contributed to architecture design, service boundaries, regression testing, and cloud-native engineering workflows.',
        highlights: [
          'Designed scalable runtime patterns with microservices, Docker, Kubernetes, Redis, and Elasticsearch.',
          'Improved clean architecture boundaries, modular contracts, and API governance.',
          'Reduced release risk through CI/CD automation and regression testing practices.',
        ],
      },
      {
        company: 'Software Engineering Foundation',
        role: 'Software Engineer',
        period: '2016 - 2019',
        summary: 'Built a foundation in enterprise software delivery across backend services, databases, web interactions, and production support.',
        highlights: [
          'Developed business systems with .NET Framework, C#, and SQL.',
          'Covered the full delivery loop from requirements and implementation to bug fixing and maintenance.',
          'Built long-term habits around readable code, testable design, and continuous refactoring.',
        ],
      },
    ],
    skillGroups: [
      {
        title: 'Backend & Architecture',
        items: ['C#', '.NET Framework', 'ASP.NET Core', 'RESTful API', 'Clean Architecture', 'Microservices'],
      },
      {
        title: 'Frontend & Web',
        items: ['Blazor', 'React', 'Next.js', 'Vue', 'JavaScript', 'Angular'],
      },
      {
        title: 'Platform & Data',
        items: ['SQL', 'Docker', 'Kubernetes', 'Redis', 'Elasticsearch', 'CI/CD'],
      },
      {
        title: 'AI-Assisted Engineering',
        items: ['Codex', 'Claude Code', 'Regression Testing', 'Continuous Refactoring', 'Engineering Documentation'],
      },
    ],
    education: [
      {
        school: 'Chengdu University of Information Technology',
        degree: 'Software Engineering, Bachelor',
        period: '2012 - 2016',
      },
    ],
    languages: [
      { name: 'Mandarin', proficiency: 'Native or bilingual proficiency' },
      { name: 'English', proficiency: 'Limited working proficiency' },
    ],
    labels: {
      profile: 'Profile',
      location: 'Location',
      gender: 'Gender',
      age: 'Age',
      drivingLicense: 'Driving license',
      professionalSummary: 'Professional summary',
      projectExperience: 'Project experience',
      employmentHistory: 'Employment history',
      competences: 'Competences',
      education: 'Education',
      languages: 'Languages',
      focus: 'Focus',
    },
    focus: 'Enterprise systems, architecture, full-stack delivery, and AI-assisted engineering.',
    drivingLicense: 'C',
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
