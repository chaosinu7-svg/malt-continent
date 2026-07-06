/** 站点级常量与小工具 */

export const SITE_NAME = '麦芽大陆';

/** 珍稀度五档称号（下标 = 星级 - 1） */
export const RARITY_TITLES = ['日常口粮', '进阶之选', '稀有', '珍藏', '传说'] as const;

export function rarityTitle(rarity: number): string {
  return RARITY_TITLES[Math.min(Math.max(rarity, 1), 5) - 1];
}

export function rarityStars(rarity: number): string {
  const r = Math.min(Math.max(rarity, 1), 5);
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

/** 珍稀度宝石分级（炉石/魔兽式色阶：白→绿→蓝→紫→金）。glow 为 "r,g,b" 供 rgba() 用。 */
export const RARITY_GEMS = [
  { name: '白水晶', fill: '#c7c0b0', light: '#e9e4d7', glow: '184,176,158' }, // ★1 日常口粮
  { name: '翡翠', fill: '#4f9d6b', light: '#9ccfac', glow: '79,157,107' }, // ★2 进阶之选
  { name: '蓝宝石', fill: '#2f6fb0', light: '#8bb4dd', glow: '47,111,176' }, // ★3 稀有
  { name: '紫水晶', fill: '#7d55b0', light: '#b89bdd', glow: '125,85,176' }, // ★4 珍藏
  { name: '琥珀金', fill: '#d29a2a', light: '#f2d182', glow: '230,170,40' }, // ★5 传说
] as const;

export function rarityGem(rarity: number) {
  return RARITY_GEMS[Math.min(Math.max(rarity, 1), 5) - 1];
}

/** 产区 id → 中文名兜底（产区 md 缺失时面包屑仍可用） */
export const REGION_FALLBACK_NAMES: Record<string, string> = {
  scotland: '苏格兰',
  ireland: '爱尔兰',
  japan: '日本',
  usa: '美国',
  taiwan: '台湾',
  india: '印度',
};

/** 子产区 id → 中文名兜底 */
export const SUB_REGION_FALLBACK_NAMES: Record<string, string> = {
  speyside: '斯佩塞',
  islay: '艾雷岛',
  highlands: '高地',
  lowlands: '低地',
  campbeltown: '坎贝尔镇',
  islands: '岛屿',
  kentucky: '肯塔基',
  tennessee: '田纳西',
};
