# PR #7 Codex Review 问题记录

## Overview

本文档记录 [remixu1994/devfolio-blog#7](https://github.com/remixu1994/devfolio-blog/pull/7)
中 Codex code review 提出的最新问题，并沉淀对应解决方向。

Review 元信息：

- 最新 Codex review commit: `efb47c8d09`
- 最新 review 时间：2026-05-21 15:38:35 UTC
- 当前 active findings：7 条 unresolved 且 non-outdated
- 历史 Docker / compose 两条 finding：已 resolved 且 outdated
- 本次处理范围：修复 7 条 active findings，并在本文档标记处理状态

## Status

- Overall: 代码已修复，待 GitHub review threads 复核
- P1 SSR production allowed hosts: 已修复，生产真实 Host header 仍需部署环境复核
- P2 recipes markdown/API fallback: 已修复并测试
- P2 markdown optional 做法图: 已修复并测试
- P2 markdown query filters/pagination: 已修复并测试
- P2 hard difficulty label: 已修复并测试
- P2 nutrition hardcoded macros: 已修复并测试

## Review Timeline

- `a7a5b147f8` / review `4335816687`
  - 2 条 Docker / compose findings。
  - 当前状态：resolved + outdated。
- `178794e2d1` / review `4338217842`
  - 4 条 recipes 功能一致性 findings。
  - 当前状态：unresolved + non-outdated。
- `efb47c8d09` / review `4338369038`
  - 3 条最新 findings。
  - 当前状态：unresolved + non-outdated。

## Findings

### [P1] `apps/site/Dockerfile:16` - SSR runtime default allowed hosts 不适合生产

处理状态：已修复

来源：
[discussion_r3282434492](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282434492)

问题：

当前 Docker image 默认设置 `NG_ALLOWED_HOSTS=localhost,127.0.0.1`。如果生产部署没有覆盖该环境变量，真实生产 hostname 会被 Angular SSR 判定为 untrusted host。

影响：

- 生产 SSR 可能立即 deopt 为 client-rendered HTML。
- 新版 Angular 行为下，同类请求可能升级为 HTTP 400。
- 该默认值对本地可用，但对可直接部署的 production image 不安全。

### [P2] `apps/site/src/app/recipes/recipe.repository.ts:21-23` - markdown 列表等待 API 才首发

处理状态：已修复

来源：
[discussion_r3282434501](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282434501)

问题：

`listRecipes` 使用 `combineLatest([this.listFromMd(locale), this.listFromApi(query)])`。`combineLatest` 需要两个 source 都至少 emit 一次；如果 `/api/public/recipes` 慢或无响应，本地 markdown recipes 也不会先显示。

影响：

- markdown-first fallback 失效。
- 本地已有 markdown 数据时，recipes 页面仍可能为空或卡在 fallback 状态。

### [P2] `libs/markdown/src/index.ts:101` - `做法图` 被错误地设为必填

处理状态：已修复

来源：
[discussion_r3282434508](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282434508)

问题：

parser 强制要求 `做法图` section 和 `image` 字段，但 `RecipeDetail.methodImage` 类型本身是 optional，详情页也已有 `methodImage || coverImage || fallback` 的兜底逻辑。

影响：

- 缺少 `做法图` 的合法 markdown recipe 会抛出 `MISSING_SECTION` 或 `MISSING_METHOD_IMAGE`。
- repository 捕获 parse error 后返回空列表或 `null`，导致 recipe 静默消失。

### [P2] `apps/site/src/app/recipes/recipe.repository.ts:21-23` - markdown recipes 未应用 query filters

处理状态：已修复

来源：
[discussion_r3282301086](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282301086)

问题：

`listRecipes` 接收 `RecipeQuery`，但 markdown path 只使用 `locale`，忽略 `category`、`tag`、`search`、`page`、`pageSize`。

影响：

- `listRecipes({ locale: 'zh', category: 'muscle' })` 仍可能返回不匹配的 markdown recipe。
- API-backed 与 markdown-backed 数据过滤行为不一致。

### [P2] `apps/site/src/app/pages/recipes.page.ts:182` - `hard` 难度显示为中等

处理状态：已修复

来源：
[discussion_r3282301098](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282301098)

问题：

`difficultyLabel` 只区分 `easy` 和非 `easy`，导致合法的 `hard` recipe 被显示为 `Medium` / `中等`。

影响：

- 用户看到错误难度标签。
- `RecipeDifficulty = 'easy' | 'medium' | 'hard'` 与 UI 映射不一致。

### [P2] `apps/site/src/app/pages/recipe-detail.page.ts:125-127` - 营养宏量值硬编码

处理状态：已修复

来源：
[discussion_r3282301106](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282301106)

问题：

详情页 nutrition table 固定显示 `38 g`、`30 g`、`8 g`，不随 recipe 数据变化。

影响：

- 所有不匹配这些数值的 recipe 都会展示错误营养信息。
- 这是用户可见的 nutrition misinformation。

### [P2] `apps/site/src/app/recipes/recipe.repository.ts:36` - 详情页 markdown fallback 等待 API

处理状态：已修复

来源：
[discussion_r3282301117](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282301117)

问题：

`getRecipeBySlug` 使用 `combineLatest([this.getFromMd(...), this.getFromApi(...)])`。如果 `/api/public/recipes/:slug` 慢或无响应，本地 markdown detail 不会先显示。

影响：

- 本地 markdown detail 可用时，用户仍可能停留在 “Recipe not found / 加载失败” 状态。
- markdown fallback 的可用性被 API 响应拖住。

## Recommended Fixes

### P1: 生产 SSR allowed hosts

- 不要在 production Docker image 中只提供 `localhost,127.0.0.1` 作为默认 `NG_ALLOWED_HOSTS`。
- 如果站点生产域名固定，将真实生产域名加入默认值，例如 canonical domain 和必要的 www / preview domain。
- 如果镜像需要环境无关，移除误导性 localhost-only production default，并要求部署环境显式注入 `NG_ALLOWED_HOSTS`；同时在部署文档或启动检查中把该变量列为必填。
- 验收：用真实生产 `Host` header 请求 SSR endpoint，不触发 untrusted-host warning，也不 deopt / 400。

### P2: recipes 列表先显示 markdown，再合并 API

- 将 `listFromApi(query)` 的 stream 加上 `startWith([])`，让 `combineLatest` 可以先 emit markdown 结果。
- 或改为 markdown 先发、API 后续补齐的 merge strategy，但必须保持去重规则：同 slug 优先 markdown，API 只补缺失项。
- API error 继续 fallback 为 `[]`，不能阻断 markdown 数据展示。
- 验收：模拟 `/api/public/recipes` 慢响应或无响应时，markdown recipes 仍能出现在列表页。

### P2: markdown recipes 应用完整 `RecipeQuery`

- 将 `listFromMd(locale)` 改为接收完整 `RecipeQuery`。
- 对 markdown summary 应用与 API 一致的 `category`、`tag`、`search` filter。
- pagination 应在 markdown + API merge 去重后统一应用，避免两个 source 各自分页造成结果缺失或重复。
- 验收：`category`、`tag`、`search`、`page`、`pageSize` 对 markdown-only 和 mixed source 都表现一致。

### P2: recipe detail 先显示 markdown fallback

- 将 `getFromApi(slug, locale)` stream 加上 `startWith(null)`，允许 `combineLatest` 先 emit markdown detail。
- 保留 API 后续返回后的 merge 行为：如果两边都有数据，继续使用 `mergeRecipeDetail(mdItem, apiItem)`。
- API error 继续 fallback 为 `null`，不能让 detail 页面丢失本地 markdown 内容。
- 验收：模拟 `/api/public/recipes/:slug` 慢响应或无响应时，本地 markdown detail 仍能渲染。

### P2: `做法图` section 改为 optional

- parser 不应对 `做法图` 调用 `requireSection`。
- 如果 section 不存在，`methodImage` 和 `downloadFileName` 返回 `undefined`。
- 如果 section 存在但缺少 `image`，建议也按 optional 处理，或仅在有明确格式错误时抛出 parse error；当前类型和页面 fallback 更支持 optional 语义。
- 验收：缺少 `做法图` 的 markdown recipe 仍能出现在列表和详情页，详情页使用 `coverImage` 或默认图兜底。

### P2: `hard` 难度标签

- `difficultyLabel` 显式处理三种枚举：`easy`、`medium`、`hard`。
- 中文映射建议：`easy -> 简单`，`medium -> 中等`，`hard -> 困难`。
- 英文映射建议：`easy -> Easy`，`medium -> Medium`，`hard -> Hard`。
- 验收：`RecipeDifficulty` 每个合法值都有对应 UI label。

### P2: nutrition table 移除硬编码宏量值

- 当前 `RecipeDetail` 只有 `calories` 和 `nutritionNotes`，没有 protein / fat / carbs 字段；不要继续展示固定 `38 g / 30 g / 8 g`。
- 短期修复：只展示 `calories` 和 `nutritionNotes`，移除蛋白质、脂肪、碳水固定行。
- 长期修复：在 shared type、API、markdown parser 和页面中新增结构化 macros 字段后，再恢复 nutrition table。
- 验收：详情页不展示与当前 recipe 数据无关的宏量营养数值。

## Resolution

- P1: 移除 Docker image 中 `NG_ALLOWED_HOSTS=localhost,127.0.0.1` 的 production 默认值，并把 runtime command 改为启动前强制要求部署环境注入 `NG_ALLOWED_HOSTS`。
- P2 list fallback: `listFromApi(query)` 增加 `startWith([])`，让 markdown recipes 可在 API pending 时先显示，API 后续只补充 slug 不重复的项。
- P2 filters/pagination: markdown recipes 应用 `category`、`tag`、`search` filter；`page` / `pageSize` 在 markdown + API merge 去重后统一执行。
- P2 detail fallback: `getFromApi(slug, locale)` 增加 `startWith(null)`，让 markdown detail 可在 API pending 时先显示。
- P2 optional 做法图: markdown parser 不再强制要求 `做法图` section；缺失时 `methodImage` 和 `downloadFileName` 为 `undefined`。
- P2 difficulty label: `difficultyLabel` 显式处理 `easy`、`medium`、`hard` 三种合法值。
- P2 nutrition: 详情页移除硬编码蛋白质、脂肪、碳水行，只展示当前数据模型实际提供的 calories 和 nutrition notes。

## Verification

- [ ] Review 状态：GitHub threads 复核仍需在 PR 页面完成。
- [x] Repository fallback：测试覆盖 API list/detail pending 时 markdown list/detail 先渲染。
- [x] Query consistency：测试覆盖 markdown + API merge 后统一过滤和分页。
- [x] Parser compatibility：测试覆盖缺少 `做法图` 的 markdown recipe parse 不抛错。
- [x] UI labels：测试覆盖 `easy`、`medium`、`hard` 三种 difficulty label。
- [x] Nutrition correctness：测试覆盖详情页不再渲染硬编码 `38 g`、`30 g`、`8 g`。
- [x] SSR host：静态确认 Docker runtime 不再内置 localhost-only `NG_ALLOWED_HOSTS`，并要求启动时显式注入该变量。
- [ ] SSR host：真实生产 Host header 行为需在部署环境复核。
- [x] `node .nx/nxw.js test site` 通过。
- [x] `node .nx/nxw.js build site` 通过；仍有既有 bundle initial budget warning。
- [x] `node .nx/nxw.js lint site` 通过。

## Source Links

- PR: [remixu1994/devfolio-blog#7](https://github.com/remixu1994/devfolio-blog/pull/7)
- Review `a7a5b147f8`:
  [pullrequestreview-4335816687](https://github.com/remixu1994/devfolio-blog/pull/7#pullrequestreview-4335816687)
- Review `178794e2d1`:
  [pullrequestreview-4338217842](https://github.com/remixu1994/devfolio-blog/pull/7#pullrequestreview-4338217842)
- Review `efb47c8d09`:
  [pullrequestreview-4338369038](https://github.com/remixu1994/devfolio-blog/pull/7#pullrequestreview-4338369038)
- Active P1 SSR production hosts:
  [discussion_r3282434492](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282434492)
- Active P2 markdown list API wait:
  [discussion_r3282434501](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282434501)
- Active P2 optional method image:
  [discussion_r3282434508](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282434508)
- Active P2 markdown filters:
  [discussion_r3282301086](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282301086)
- Active P2 hard difficulty label:
  [discussion_r3282301098](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282301098)
- Active P2 hardcoded nutrition macros:
  [discussion_r3282301106](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282301106)
- Active P2 markdown detail API wait:
  [discussion_r3282301117](https://github.com/remixu1994/devfolio-blog/pull/7#discussion_r3282301117)
