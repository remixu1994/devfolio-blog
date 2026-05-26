# Devfolio Blog (Archived)

## 项目状态

本仓库目前 **不再维护**，仅作为历史学习记录保留。

个人技术作品集博客，围绕 `Angular + NestJS + Nx Monorepo + PostgreSQL + TypeORM` 搭建，首发包含：

- 在线简历
- 架构设计案例
- Unraid NAS 专题
- 健身 AI Agent 产品案例
- 轻量博客后台
这个项目用于学习和实践 Angular 框架搭建（包含 `Angular + NestJS + Nx` 的工程组织）。


## Workspace

- `apps/site/`: Angular SSR 公共站点
- `apps/admin/`: Admin + API 统一后台服务
  - `apps/admin/ui/`: Angular 内容后台
  - `apps/admin/api/`: NestJS REST API
- `apps/site-e2e/`: Playwright E2E tests
- `libs/`: 共享类型、内容数据、i18n、Markdown 与 UI 基础组件


## 新项目

新的项目已迁移到：

- [remixu1994/resume.blog](https://github.com/remixu1994/resume.blog)

新项目基于 **Next.js + React** 实现，并持续更新。

