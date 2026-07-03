// @ts-check
import { defineConfig } from 'astro/config';

/**
 * GitHub Pages 子路径部署：
 * CI 中从 GITHUB_REPOSITORY（形如 "owner/repo"）推导 site 与 base；
 * 若 repo 为 "<owner>.github.io"（用户主页站），base 为 '/'；
 * 本地开发/构建默认 base '/'。
 */
const ghRepo = process.env.GITHUB_REPOSITORY ?? '';
const [owner, repo] = ghRepo.split('/');
const isCI = Boolean(process.env.GITHUB_ACTIONS && owner && repo);
const isUserSite = isCI && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;

export default defineConfig({
  site: isCI ? `https://${owner}.github.io` : undefined,
  base: isCI && !isUserSite ? `/${repo}` : '/',
  server: { port: Number(process.env.PORT) || 4321 },
  legacy: {
    // 使用经典 Content Collections（type: 'content'）写法
    collections: true,
  },
});
