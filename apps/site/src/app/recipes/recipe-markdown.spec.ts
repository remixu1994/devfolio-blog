import { parseRecipeMarkdown } from '@devfolio-blog/markdown';

describe('parseRecipeMarkdown', () => {
  it('accepts markdown recipes without a method image section', () => {
    const recipe = parseRecipeMarkdown(`# 无做法图食谱

## 基础信息
- slug: no-method-image
- locale: zh
- category: balanced
- tags: quick
- servings: 1人份
- durationMinutes: 10
- difficulty: hard
- summary: 没有做法图也应该合法。
- coverImage: /recipes/cover.png
- updatedAt: 2026-05-21

## 食材
- 鸡蛋 | 2个 |

## 调料
- 盐 | 1g |

## 步骤
### 1. 制作
- 打散鸡蛋后加热。
`);

    expect(recipe.methodImage).toBeUndefined();
    expect(recipe.downloadFileName).toBeUndefined();
  });
});
