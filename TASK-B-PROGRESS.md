# 麦芽大陆 · 任务 B 插画进度交接

更新时间：2026-07-03

## 当前状态

任务 B 正在进行中。请以下面本地文件系统中已经存在的 PNG 为准，不要按聊天口头进度推断。

已落盘目录：

- `public/assets/map/`
- `public/assets/regions/`
- `public/assets/distilleries/`
- `public/assets/whiskies/`

当前已生成并保存的资产：

### 世界地图

- `public/assets/map/world-map.png`

说明：已生成太平洋居中地图。布局要求：苏格兰/爱尔兰在左，日本居中，台湾在日本下方，印度中左，美国在右。当前 PNG 已按 `2400x1350` 规整。

### 产区横幅

已完成：

- `public/assets/regions/scotland-banner.png`
- `public/assets/regions/ireland-banner.png`
- `public/assets/regions/japan-banner.png`

待补：

- `public/assets/regions/usa-banner.png`
- `public/assets/regions/taiwan-banner.png`
- `public/assets/regions/india-banner.png`

横幅规格：`1600x500`。风格统一为手绘墨线、水彩淡彩、羊皮纸图鉴页，无文字，预留标题叠加空间。

### 酒厂立绘

已完成：

- `public/assets/distilleries/buffalo-trace.png`
- `public/assets/distilleries/jack-daniels.png`
- `public/assets/distilleries/jim-beam.png`
- `public/assets/distilleries/teeling.png`
- `public/assets/distilleries/waterford.png`

待补 21 张：

- `amrut.png`
- `ardbeg.png`
- `auchentoshan.png`
- `bushmills.png`
- `chichibu.png`
- `glenfiddich.png`
- `glenmorangie.png`
- `hakushu.png`
- `indri.png`
- `jameson.png`
- `kavalan.png`
- `laphroaig.png`
- `macallan.png`
- `makers-mark.png`
- `nantou-omar.png`
- `paul-john.png`
- `rampur.png`
- `springbank.png`
- `talisker.png`
- `yamazaki.png`
- `yoichi.png`

酒厂立绘规格：`800x1000`。风格为竖版图鉴牌：中心酒厂建筑/生态意象 + 底部小道具，羊皮纸背景，无文字，无品牌 logo。酒厂立绘不参与 rarity 打光体系，保持自然光。

重要视觉纠偏：

- `laphroaig` 和 `ardbeg` 很容易同质化。后续生成时必须强制区分：
  - `laphroaig`：白墙海岸仓库、药水/碘酒、海盐、泥煤、海藻。
  - `ardbeg`：更暗、更低矮、更焦油、黑石、柑橘、厚泥煤烟，避免白墙仓库主导。

### 瓶身图

当前未开始落盘。

待生成：`src/content/whiskies/` 下全部 78 款，对应输出到：

- `public/assets/whiskies/<whisky-id>.png`

瓶身图规格：`800x1200`。必须按每个 whisky Markdown 的 `rarity` 字段套用统一打光模板：

- `rarity: 1`：柔和均匀日光，无光晕无特效，朴素日常图鉴静物。
- `rarity: 2`：温暖单侧窗光，瓶身一道柔和高光与浅影，安静专门店氛围。
- `rarity: 3`：琥珀色轮廓光微亮，背景轻微变暗聚焦瓶身，初现不凡。
- `rarity: 4`：酒窖顶光打在瓶身，金色光晕环绕，细小光尘漂浮，背景深暗庄重。
- `rarity: 5`：传说宝物登场，放射状金色圣光与漫天光粒，深暗背景中央唯瓶独明。

同 rarity 档的光效要尽量一致，只换瓶型、酒色、标签特征和小道具。

## 建议下一步

1. 先补齐 3 张产区横幅：`usa`、`taiwan`、`india`。
2. 补齐剩余 21 张酒厂立绘。建议先做苏格兰缺失酒厂，再做日本/爱尔兰/美国/台湾/印度。
3. 酒厂立绘全齐后，再进入瓶身图。
4. 瓶身图建议先每个 rarity 档各出 1 张定版，确认光效梯度后批量生成。

## 使用方式

使用内置 `image_gen` 工具生成。生成图默认保存在：

- `/Users/a1/.codex/generated_images/...`

生成后复制到项目路径，再用 `sips` 规整尺寸，例如：

```bash
cp "<generated>.png" /Users/a1/Desktop/malt-continent/public/assets/distilleries/<id>.png
sips -z 1000 800 /Users/a1/Desktop/malt-continent/public/assets/distilleries/<id>.png
```

横幅：

```bash
sips -z 500 1600 /Users/a1/Desktop/malt-continent/public/assets/regions/<region>-banner.png
```

地图：

```bash
sips -z 1350 2400 /Users/a1/Desktop/malt-continent/public/assets/map/world-map.png
```

瓶身图：

```bash
sips -z 1200 800 /Users/a1/Desktop/malt-continent/public/assets/whiskies/<id>.png
```

## 当前 git 状态

本次交接时 `git status --short` 没有输出。后续新对话请重新运行：

```bash
git -C /Users/a1/Desktop/malt-continent status --short
find /Users/a1/Desktop/malt-continent/public/assets -maxdepth 3 -type f | sort
```
