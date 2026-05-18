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

## 服务启动与加载说明

### 1. 本地准备

复制环境变量文件：

```powershell
Copy-Item .env.example .env
```

安装依赖：

```powershell
npm install
```

默认本地开发使用 SQLite，数据文件会写入：

```text
DATABASE_TYPE=sqlite
SQLITE_DATABASE=storage/devfolio.sqlite
```

如果要切换到 PostgreSQL，把 `.env` 改为：

```text
DATABASE_TYPE=postgres
DATABASE_URL=postgres://postgres:postgres@localhost:5432/devfolio_blog
```

`DATABASE_SYNCHRONIZE=true` 会让 TypeORM 在启动时同步表结构，适合本地开发；生产环境建议改为迁移脚本管理。

### 2. 开发模式启动

开发模式适合日常改代码，支持 Angular / NestJS 的开发构建与自动刷新。建议分别打开三个终端：

```powershell
npm run start:api
```

```powershell
npm run start:site
```

```powershell
node .nx/nxw.js serve admin --port=4300
```

默认访问地址：

- Site dev server (HMR): `http://localhost:4200`
- Admin: `http://localhost:4300`
- API: `http://localhost:3000/api`

加载关系：

- `site` 是公共站点，加载仓库内共享内容数据，并可调用 `api` 的公共文章接口。
- `admin` 是内容后台，主要调用 `api` 的后台文章、媒体和认证接口。
- `api` 是 NestJS 服务，读取 `.env` 配置；本地默认连接 SQLite，也可以通过 `DATABASE_TYPE=postgres` 切换到 PostgreSQL。

### 3. 构建后静态预览

如果要验证生产构建产物，先构建：

```powershell
npm run build
```

然后启动静态预览：

```powershell
npm run preview:site
```

```powershell
npm run preview:admin
```

预览地址：

- Site preview: `http://localhost:4210`
- Admin preview: `http://localhost:4300`

注意：静态预览读取 `dist/site/browser` 和 `dist/admin/browser`。修改源码后需要重新运行 `npm run build`，预览页面才会加载新的构建产物。

### 4. Docker Compose 启动

整套服务也可以通过 Docker Compose 启动：

```powershell
docker compose up
```

只启动 PostgreSQL：

```powershell
docker compose up -d postgres
```

Docker Compose 会覆盖 API 的数据库配置为 PostgreSQL，服务端口：

- Postgres: `localhost:5432`
- API: `http://localhost:3000/api`
- Site: `http://localhost:4200`
- Admin: `http://localhost:4300`

### 5. 常用校验

```powershell
npm run lint
```

```powershell
npm run build
```

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
