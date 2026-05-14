# Devfolio Blog

个人技术作品集博客，围绕 `Angular + NestJS + Nx Monorepo + PostgreSQL + TypeORM` 搭建，首发包含：

- 在线简历
- 架构设计案例
- Unraid NAS 专题
- 健身 AI Agent 产品案例
- 轻量博客后台

## Workspace

- `site/`: Angular SSR 公共站点
- `admin/`: Angular 内容后台
- `api/`: NestJS REST API
- `libs/`: 共享类型、内容数据、i18n、Markdown 与 UI 基础组件

## Start

1. 复制 `.env.example` 为 `.env`
2. 安装依赖：`npm install`
3. 启动 API：`npm run start:api`
4. 启动站点：`npm run start:site`
5. 启动后台：`npm run start:admin`

默认地址：

- Site: `http://localhost:4200`
- Admin: `http://localhost:4300`
- API: `http://localhost:3000/api`

## Key Routes

- `/:locale`
- `/:locale/resume`
- `/:locale/architecture`
- `/:locale/architecture/:slug`
- `/:locale/unraid`
- `/:locale/fitness-ai-agent`
- `/:locale/blog`
- `/:locale/blog/:slug`

## API

公共接口：

- `GET /api/public/posts`
- `GET /api/public/posts/:slug`
- `GET /api/public/series`
- `GET /api/public/tags`
- `GET /api/public/featured`

后台接口：

- `GET /api/admin/posts`
- `POST /api/admin/posts`
- `PATCH /api/admin/posts/:id`
- `POST /api/admin/media`
- `GET /api/auth/github`
- `GET /api/auth/github/callback`

## Notes

- 当前博客静态专题内容由仓库内共享内容数据提供。
- 动态文章通过 API 内存存储演示管理链路，后续可继续接入 PostgreSQL 持久化仓储。
- GitHub OAuth 已预留接口与环境变量，当前为可配置占位流程。
