import { defineCollection, z } from 'astro:content';

/**
 * 内容集合 schema（图鉴引擎内容契约）
 * 必填字段缺失时，Astro 会在构建时报错并指明文件与字段。
 * 字段命名保持通用（region / venue / item 层级），姊妹站可直接复用。
 * 图片字段均可省略：省略时前端按约定路径 /assets/{regions|distilleries|whiskies}/<id>.png 猜，
 * 猜不中由 <img onerror> 兜底到 /assets/placeholder.svg。
 */

const regions = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    name_en: z.string(),
    tagline: z.string(),
    style_tags: z.array(z.string()),
    // 子产区：{id, name} 数组；无子产区的产区省略
    sub_regions: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
    // 省略时按约定路径 /assets/regions/<id>-banner.png
    banner_image: z.string().optional(),
  }),
});

const distilleries = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    name_en: z.string(),
    // 须与某个产区 id 对应（world.json / regions 集合）
    region: z.string(),
    // 仅有子产区划分的产区填写（如苏格兰六域、美国肯塔基/田纳西），其余省略
    sub_region: z.string().optional(),
    founded: z.number(),
    location: z.string(),
    water_source: z.string().optional(),
    stills: z.number().optional(),
    style_tags: z.array(z.string()),
    // 酒厂真实经纬度（整合阶段结合 world.json 各产区 bbox 换算地图标点）
    geo: z.object({ lat: z.number(), lon: z.number() }),
    // 地图标点（占底图宽高的百分比 0-100）；无此字段则首页不渲染该厂标点
    map_pin: z
      .object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) })
      .optional(),
    // 块区名数组，顺序 = 展示顺序
    series: z.array(z.string()),
    // 省略时按约定路径 /assets/distilleries/<id>.png
    portrait_image: z.string().optional(),
  }),
});

const whiskies = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    name_en: z.string().optional(),
    distillery: z.string(),
    // 应是所属酒厂 series 中的一个；不在其中时前端归入「图鉴」块排最后
    series: z.string(),
    // 无年份款(NAS)写 null
    age: z.number().nullable(),
    abv: z.number(),
    cask: z.string(),
    flavor_tags: z.array(z.string()),
    rarity: z.number().int().min(1).max(5),
    rarity_reason: z.string(),
    // 手写标注短句，可省略
    annotations: z.array(z.string()).optional(),
    // 省略时按约定路径 /assets/whiskies/<id>.png
    bottle_image: z.string().optional(),
  }),
});

export const collections = { regions, distilleries, whiskies };
