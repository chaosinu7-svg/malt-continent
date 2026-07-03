/**
 * 站内链接/资源统一加 base 前缀（GitHub Pages 子路径部署不 404）。
 * 用法：withBase('/region/scotland') / withBase('/assets/placeholder.svg')
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}` || '/';
}
