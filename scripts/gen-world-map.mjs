#!/usr/bin/env node
/**
 * 生成 public/assets/map/world-map.svg（手绘占位幻想地图）。
 * 大陆团块 / 产区大字直接取自 src/data/world.json 的 polygon / label_pos，
 * 保证与首页热区层像素对齐。world.json 改动后重跑：node scripts/gen-world-map.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const world = JSON.parse(readFileSync(join(root, 'src/data/world.json'), 'utf8'));

// 视图 1600x900（16:9），world.json 坐标为百分比：x% * 16, y% * 9
const W = 1600;
const H = 900;
const sx = (x) => x * (W / 100);
const sy = (y) => y * (H / 100);

// 主题色（独立 SVG 资源，页面 CSS 变量不可用，需硬编码；与 global.css 保持一致）
const PARCHMENT = '#f4e9cd';
const PARCHMENT_DEEP = '#eadcb4';
const INK = '#4a3524';
const INK_SOFT = '#7a6248';
const AMBER = '#c8861b';
const AMBER_DEEP = '#a56a10';
const FONT_HAND = "'LXGW WenKai','LXGW WenKai Screen','Kaiti SC','STKaiti','KaiTi',serif";

// 确定性伪随机（每次重跑产出一致）
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260702);
const jitter = (amp) => (rand() * 2 - 1) * amp;

const fmt = (n) => Number(n.toFixed(1));
const fop = (n) => Number(n.toFixed(3)); // 透明度用，保留 3 位小数

/** 闭合多边形：边细分 + 垂直方向抖动 → 波浪描边点列（像素坐标） */
function wobblePoints(polyPct, segLen = 46, amp = 7) {
  const pts = polyPct.map(([x, y]) => [sx(x), sy(y)]);
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    // 法线方向
    const nx = -dy / len;
    const ny = dx / len;
    // 顶点本身轻微抖动（幅度小，保证与热区对齐）
    out.push([a[0] + jitter(2.5), a[1] + jitter(2.5)]);
    const n = Math.max(1, Math.floor(len / segLen));
    for (let k = 1; k < n; k++) {
      const t = k / n;
      const off = jitter(amp);
      out.push([a[0] + dx * t + nx * off, a[1] + dy * t + ny * off]);
    }
  }
  return out;
}

/** Catmull-Rom → 三次贝塞尔，闭合平滑路径 */
function smoothClosedPath(pts) {
  const n = pts.length;
  const p = (i) => pts[((i % n) + n) % n];
  let d = `M ${fmt(p(0)[0])} ${fmt(p(0)[1])} `;
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C ${fmt(c1[0])} ${fmt(c1[1])}, ${fmt(c2[0])} ${fmt(c2[1])}, ${fmt(p2[0])} ${fmt(p2[1])} `;
  }
  return d + 'Z';
}

function centroid(polyPct) {
  const xs = polyPct.reduce((s, p) => s + p[0], 0) / polyPct.length;
  const ys = polyPct.reduce((s, p) => s + p[1], 0) / polyPct.length;
  return [xs, ys];
}

/** 射线法（百分比坐标），pad 以质心为中心外扩多边形 */
function insidePolygon(polyPct, x, y, pad = 1) {
  const [cx, cy] = centroid(polyPct);
  const poly = polyPct.map(([px, py]) => [cx + (px - cx) * pad, cy + (py - cy) * pad]);
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const onLand = (x, y) => world.regions.some((r) => insidePolygon(r.polygon, x, y, 1.45));

const parts = [];

// ---------- 羊皮纸底 ----------
parts.push(`<rect width="${W}" height="${H}" fill="${PARCHMENT}"/>`);
parts.push(
  `<radialGradient id="age1" cx="0.16" cy="0.12" r="0.5"><stop offset="0" stop-color="${INK_SOFT}" stop-opacity="0.10"/><stop offset="1" stop-color="${INK_SOFT}" stop-opacity="0"/></radialGradient>`,
  `<radialGradient id="age2" cx="0.85" cy="0.9" r="0.55"><stop offset="0" stop-color="${INK_SOFT}" stop-opacity="0.12"/><stop offset="1" stop-color="${INK_SOFT}" stop-opacity="0"/></radialGradient>`,
  `<rect width="${W}" height="${H}" fill="url(#age1)"/>`,
  `<rect width="${W}" height="${H}" fill="url(#age2)"/>`
);
// 陈年污渍
for (let i = 0; i < 14; i++) {
  const x = fmt(40 + rand() * (W - 80));
  const y = fmt(40 + rand() * (H - 80));
  const r = fmt(12 + rand() * 42);
  parts.push(
    `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${fmt(r * (0.6 + rand() * 0.5))}" fill="${INK_SOFT}" opacity="${fop(0.02 + rand() * 0.035)}"/>`
  );
}

// ---------- 海浪纹（避开陆地） ----------
const waves = [];
for (let gy = 7; gy < 96; gy += 5.2) {
  for (let gx = 3; gx < 97; gx += 6.4) {
    const x = gx + jitter(2.2);
    const y = gy + jitter(1.6);
    if (rand() < 0.42) continue;
    if (onLand(x, y)) continue;
    const px = sx(x);
    const py = sy(y);
    const s = 0.75 + rand() * 0.7;
    waves.push(
      `<path d="M ${fmt(px)} ${fmt(py)} q ${fmt(7 * s)} ${fmt(-6 * s)} ${fmt(14 * s)} 0 q ${fmt(7 * s)} ${fmt(6 * s)} ${fmt(14 * s)} 0" fill="none" stroke="${INK_SOFT}" stroke-width="1.6" stroke-linecap="round" opacity="${fop(0.16 + rand() * 0.14)}"/>`
    );
  }
}
parts.push(`<g>${waves.join('')}</g>`);

// ---------- 大陆团块 ----------
for (const r of world.regions) {
  const pts = wobblePoints(r.polygon);
  const d = smoothClosedPath(pts);
  const [cx, cy] = centroid(r.polygon).map((v, i) => (i === 0 ? sx(v) : sy(v)));

  // 近岸涟漪（质心放大两圈）
  for (const [scale, op] of [
    [1.1, 0.3],
    [1.2, 0.16],
  ]) {
    const ring = pts.map(([x, y]) => [cx + (x - cx) * scale, cy + (y - cy) * scale]);
    parts.push(
      `<path d="${smoothClosedPath(ring)}" fill="none" stroke="${INK_SOFT}" stroke-width="1.4" stroke-dasharray="7 9" opacity="${op}"/>`
    );
  }
  // 陆地：深纸色填充 + 墨线波浪描边 + 内侧细线（手绘双线）
  parts.push(`<path d="${d}" fill="${PARCHMENT_DEEP}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`);
  const inner = pts.map(([x, y]) => [cx + (x - cx) * 0.94, cy + (y - cy) * 0.94]);
  parts.push(
    `<path d="${smoothClosedPath(inner)}" fill="none" stroke="${INK_SOFT}" stroke-width="1.3" stroke-dasharray="3 6" opacity="0.55"/>`
  );

  // 内陆小山丘 ︿︿（避开标签位置）
  const hills = [];
  let tries = 0;
  while (hills.length < 3 && tries < 40) {
    tries++;
    const hx = centroid(r.polygon)[0] + jitter(4.5);
    const hy = centroid(r.polygon)[1] + jitter(4);
    const nearLabel = Math.abs(hx - r.label_pos.x) < 7 && Math.abs(hy - r.label_pos.y) < 5;
    if (!insidePolygon(r.polygon, hx, hy, 0.82) || nearLabel) continue;
    const px = sx(hx);
    const py = sy(hy);
    const s = 0.8 + rand() * 0.6;
    hills.push(
      `<path d="M ${fmt(px - 13 * s)} ${fmt(py)} l ${fmt(9 * s)} ${fmt(-11 * s)} l ${fmt(6 * s)} ${fmt(7 * s)} l ${fmt(4 * s)} ${fmt(-5 * s)} l ${fmt(7 * s)} ${fmt(9 * s)}" fill="none" stroke="${INK_SOFT}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>`
    );
  }
  parts.push(`<g>${hills.join('')}</g>`);
}

// ---------- 产区大字标签 ----------
for (const r of world.regions) {
  const px = sx(r.label_pos.x);
  const py = sy(r.label_pos.y);
  const xs = r.polygon.map((p) => p[0]);
  const wPct = Math.max(...xs) - Math.min(...xs);
  const size = wPct < 8 ? 30 : wPct < 16 ? 44 : 52;
  const rot = fmt(jitter(2.2));
  const halfW = (r.name.length * size) / 2 + 6;
  parts.push(
    `<g transform="rotate(${rot} ${fmt(px)} ${fmt(py)})">` +
      `<text x="${fmt(px)}" y="${fmt(py)}" text-anchor="middle" dominant-baseline="central" font-family="${FONT_HAND}" font-size="${size}" font-weight="700" letter-spacing="${size > 40 ? 8 : 4}" fill="${INK}" stroke="${PARCHMENT}" stroke-width="5" paint-order="stroke">${r.name}</text>` +
      `<path d="M ${fmt(px - halfW)} ${fmt(py + size * 0.72)} q ${fmt(halfW)} ${fmt(6 + jitter(3))} ${fmt(halfW * 2)} 0" fill="none" stroke="${AMBER_DEEP}" stroke-width="2" stroke-dasharray="8 6" opacity="0.75"/>` +
      `</g>`
  );
}

// ---------- 罗盘（右下开阔海域） ----------
{
  const cx = sx(62);
  const cy = sy(78);
  const spokes = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 2;
    const r1 = i % 2 === 0 ? 58 : 36;
    spokes.push(
      `<path d="M ${fmt(cx + Math.cos(a) * r1)} ${fmt(cy + Math.sin(a) * r1)} L ${fmt(cx + Math.cos(a + 0.35) * 10)} ${fmt(cy + Math.sin(a + 0.35) * 10)} L ${fmt(cx + Math.cos(a - 0.35) * 10)} ${fmt(cy + Math.sin(a - 0.35) * 10)} Z" fill="${i % 2 === 0 ? INK : AMBER}" opacity="${i % 2 === 0 ? 0.85 : 0.8}"/>`
    );
  }
  parts.push(
    `<g>` +
      `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="66" fill="${PARCHMENT}" stroke="${INK}" stroke-width="2.4" opacity="0.95"/>` +
      `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="58" fill="none" stroke="${INK_SOFT}" stroke-width="1.2" stroke-dasharray="4 5"/>` +
      spokes.join('') +
      `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="6" fill="${AMBER_DEEP}" stroke="${INK}" stroke-width="1.5"/>` +
      `<text x="${fmt(cx)}" y="${fmt(cy - 78)}" text-anchor="middle" font-family="${FONT_HAND}" font-size="26" font-weight="700" fill="${INK}">北</text>` +
      `</g>`
  );
}

// ---------- 海怪（左下开阔海域） ----------
{
  const x = sx(27);
  const y = sy(80);
  parts.push(
    `<g stroke="${INK_SOFT}" fill="none" stroke-width="2.6" stroke-linecap="round" opacity="0.65">` +
      `<path d="M ${fmt(x - 60)} ${fmt(y)} q 15 -26 30 0"/>` +
      `<path d="M ${fmt(x - 10)} ${fmt(y)} q 15 -32 30 0"/>` +
      `<path d="M ${fmt(x + 42)} ${fmt(y)} q 12 -22 26 -4 q 8 10 -2 12"/>` +
      `<circle cx="${fmt(x + 58)}" cy="${fmt(y - 12)}" r="1.6" fill="${INK_SOFT}"/>` +
      `</g>`
  );
  parts.push(
    `<text x="${fmt(x)}" y="${fmt(y + 30)}" text-anchor="middle" font-family="${FONT_HAND}" font-size="17" fill="${INK_SOFT}" opacity="0.75" letter-spacing="3">此处有海怪</text>`
  );
}

// ---------- 标题卷标（上中偏左开阔处） ----------
{
  const cx = sx(33);
  const cy = sy(9);
  parts.push(
    `<g>` +
      `<rect x="${fmt(cx - 138)}" y="${fmt(cy - 30)}" width="276" height="60" rx="8" fill="${PARCHMENT}" stroke="${INK}" stroke-width="2.2" transform="rotate(-1 ${fmt(cx)} ${fmt(cy)})"/>` +
      `<rect x="${fmt(cx - 130)}" y="${fmt(cy - 23)}" width="260" height="46" rx="5" fill="none" stroke="${INK_SOFT}" stroke-width="1" stroke-dasharray="4 4" transform="rotate(-1 ${fmt(cx)} ${fmt(cy)})"/>` +
      `<text x="${fmt(cx)}" y="${fmt(cy - 2)}" text-anchor="middle" dominant-baseline="central" font-family="${FONT_HAND}" font-size="27" font-weight="700" letter-spacing="7" fill="${INK}" transform="rotate(-1 ${fmt(cx)} ${fmt(cy)})">麦芽大陆全图</text>` +
      `<text x="${fmt(cx)}" y="${fmt(cy + 19)}" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="3" fill="${INK_SOFT}" transform="rotate(-1 ${fmt(cx)} ${fmt(cy)})">MALT CONTINENT</text>` +
      `</g>`
  );
}

// ---------- 手绘双线外框 ----------
parts.push(
  `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${INK}" stroke-width="3"/>`,
  `<rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke="${INK_SOFT}" stroke-width="1.4" stroke-dasharray="10 7"/>`
);

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="麦芽大陆手绘世界地图">\n` +
  parts.join('\n') +
  `\n</svg>\n`;

const outPath = join(root, 'public/assets/map/world-map.svg');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, svg);
console.log(`written ${outPath} (${(svg.length / 1024).toFixed(1)} KB)`);
