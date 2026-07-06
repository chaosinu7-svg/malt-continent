# 麦芽大陆 · 出图接力交接单

> 给新对话（Codex 或任意出图 agent）看的自包含手册。目标只有一个词：**一致性**。
> 项目根目录：`~/Desktop/malt-continent/`　线上：https://chaosinu7-svg.github.io/malt-continent/
> 更新时间：2026-07-03

---

## 0. 你接手的是什么

一个迷宫饭漫画风的威士忌图鉴站。网站代码、全部文案、地图圆窗引擎**都已完工上线**，现在**只差图**。你要做的是纯出图 + 落盘，不改代码。图落到约定路径、用约定文件名，网站自动生效（缺图时显示"图鉴插画·待补"占位框，所以可以分批慢慢补，不丢人）。

### 当前进度快照（以硬盘文件为准，别信聊天记录）

| 素材 | 进度 | 存放路径 |
|---|---|---|
| 世界地图底图 | ✅ 1/1 | `public/assets/map/world-map.png` |
| 酒厂立绘 | ✅ 27/27 | `public/assets/distilleries/<酒厂id>.png` |
| 产区横幅 | ⚠️ 6/6 已上线但**需重画**（比例观感偏拉伸） | `public/assets/regions/<产区id>-banner.png` |
| **圆窗地区图** | ⬜ **0/7** | `public/assets/map/inset-<insetid>.png` |
| **瓶身图** | ⬜ **0/82** | `public/assets/whiskies/<单品id>.png` |

**你的任务优先级：① 瓶身图 82 张（最大头）→ ② 圆窗地区图 7 张 → ③ 横幅重画 6 张。**

---

## 1. 一致性铁律（最重要，先读这段）

### 铁律 1：画风必须和已完成的 27 张立绘成套

**不要凭空定画风——去看已经画好的图，把它们当画风圣经。** 打开这几张作为锚点：
- `public/assets/distilleries/laphroaig.png`（海岸酒厂 + 泥煤砖 + 药水瓶）
- `public/assets/distilleries/kavalan.png`（亚热带山谷 + 热带水果）
- `public/assets/distilleries/johnnie-walker.png`（调和师工作室 + 各厂酒桶）

统一画风关键词（所有新图都要贴合）：
> 九井谅子《迷宫饭》图鉴风 · 手绘钢笔线稿 + 水彩淡彩 · 羊皮纸底色 · 复古博物图鉴排版 · 米黄纸质感 + 深褐墨线描边 · 无文字（文字由网页叠加）· 柔和自然、不刺眼、不赛博、不锐利游戏光

### 铁律 2：文件名 = 内容 id，一字不差

每张图的文件名严格等于内容文件的 id。**开画前先读对应的 md 文件确认 id 和特征**：
- 酒厂：`src/content/distilleries/<id>.md`
- 单品：`src/content/whiskies/<id>.md`
- 圆窗：id 见下方第 3 节表格

命名错一个字母，网站就读不到、显示占位框。落盘后必查（见铁律 4）。

### 铁律 3：绝不复制充数

历史教训：之前有一批图偷懒复制，14 张酒厂立绘是同一张、3 张横幅是复制的，全部返工。**每张图必须独立生成。** 生成失败就如实报告缺哪张——网站有占位兜底，缺图不丢人，**假图才丢人**。

### 铁律 4：每批落盘后自查 md5，无重复才算交付

```bash
cd ~/Desktop/malt-continent/public/assets
# 查重：输出必须为空
for f in whiskies/*.png distilleries/*.png map/*.png regions/*.png; do md5 -q "$f"; done | sort | uniq -d
```
输出为空 = 没有两张图是相同的 = 合格。有输出 = 有复制品 = 必须重画。

### 铁律 5：分批小步，防卡死

历史教训：一次让它画 80+ 张，生图接口一限流就卡死干等。**每次会话最多画 5 张，画完即收工，下次会话下一批。** 限流/失败等 30 秒重试一次，再失败就跳过并记录，绝不原地干等。

---

## 2. 批次①：瓶身图 82 张（主任务，按珍稀度打光）

**路径**：`public/assets/whiskies/<单品id>.png`　**尺寸**：800×1200（2:3 竖版）

### 每瓶怎么画
1. 先读 `src/content/whiskies/<id>.md`，看它的 `name`（酒名）、`cask`（桶型）、`flavor_tags`（风味）、`rarity`（珍稀度 1-5）
2. 画这瓶酒的瓶身：瓶型、酒标要贴合真实产品特征（如拉弗格的白底黑字、麦卡伦的雪莉桶深色瓶、美格的红蜡封口）
3. **按 `rarity` 值套用对应的打光**（下表），这是本站的灵魂——用光表达珍稀度，像卡牌游戏 R/SR/SSR

### 珍稀度打光梯度（光是珍稀度的视觉语言，全站必须统一）

> 光色统一**琥珀金**（呼应酒液），不用彩色霓虹；始终保持水彩手绘感，用"留白+淡彩晕染"表现光，不做锐利光束。**同一档的瓶子打光必须长得一样**（同模板换瓶），否则梯度就乱了——建议每档先出 1 张定版再批量。

| rarity | 档位 | 打光 | 出图提示词片段 |
|---|---|---|---|
| 1 | 日常口粮 | 平实日常漫射光、零光效、干净羊皮纸背景 | 柔和均匀日光，无光晕无特效，朴素日常的图鉴静物 |
| 2 | 进阶之选 | 单侧窗光、瓶身一道柔和高光、淡淡投影 | 温暖单侧窗光，瓶身柔和高光与浅影，安静专门店氛围 |
| 3 | 稀有 | 瓶身外缘一圈淡琥珀轮廓光、背景微压暗聚焦 | 琥珀轮廓光微亮，背景轻微变暗聚焦瓶身，初现不凡 |
| 4 | 珍藏 | 金色光晕 + 少量漂浮光尘、背景暗如酒窖、一束顶光 | 酒窖顶光打在瓶身，金色光晕环绕，光尘漂浮，背景深暗庄重 |
| 5 | 传说 | 圣物出场：放射状金色圣光、大量光粒、背景近乎全暗 | 传说宝物登场，放射金色圣光与漫天光粒，深暗背景中央唯瓶独明，敬畏感 |

### 真实例子（照抄这个对应关系找感觉）
- `jim-beam-white-label`（rarity 1）→ ★1 平光，玉米甜香草，白标波本瓶，明亮朴素
- `laphroaig-10`（rarity 2）→ ★2 单侧窗光，白底黑字瓶，泥煤海盐
- `yamazaki-18`（rarity 4）→ ★4 酒窖顶光金晕，深色雪莉瓶
- `johnnie-walker-blue-ghost-rare`（rarity 4）→ ★4，蓝牌方瓶，幽深
- `macallan-1926`（rarity 5）→ ★5 满屏圣光，60 年老酒，全站最贵之一
- `buffalo-trace-pappy-15`（Pappy 15 年，rarity 5）→ ★5 圣光，波本神酒

### 建议批次顺序（每批 5 张，按酒厂聚在一起画，风味相近好统一）
苏格兰各厂 → 日本各厂 → 爱尔兰 → 美国 → 印度/台湾 → 调和名门（尊尼获加 4 款）。完整 82 个 id 见文末附录。

---

## 3. 批次②：圆窗地区图 7 张（技术要求最高，坐标必须精确）

**路径**：`public/assets/map/inset-<insetid>.png`　**尺寸**：正方形（建议 1000×1000）

首页地图上有 7 个放大镜圆窗，现在是羊皮纸空底。你要画的是**每个圆窗内衬的"产区局部地图"**——画完图钉会精确落在酒厂真实位置上。

### ⚠️ 致命要求：画布四边严格对应 bbox 经纬度，等比、上北下南
网站用每个圆窗的 bbox（经纬度范围）把酒厂经纬度线性映射成图钉位置。**如果你画的地图多画一度、留白裁边、或比例不对，图钉就会漂到海里。** 画一张该区域的手绘地图，让海岸线/岛屿严格填满整个方形画布的对应经纬度框。

| inset id（文件名） | 画什么区域 | bbox（左北下南严格对齐） | 圆窗里会落几个钉 |
|---|---|---|---|
| `inset-scotland-north` | 苏格兰北部（斯佩塞+高地+斯凯岛） | lat 56.2–58.7, lon −7.5–−2.0 | 4（麦卡伦/格兰菲迪/格兰杰/泰斯卡）|
| `inset-scotland-south` | 苏格兰南部（艾雷岛+坎贝尔镇+低地） | lat 54.9–56.2, lon −7.0–−3.0 | 5（拉弗格/阿贝/云顶/欧肯特轩/尊尼获加）|
| `inset-ireland` | 爱尔兰全岛 | lat 51.4–55.5, lon −10.0–−5.4 | 4 |
| `inset-japan` | 日本（本州中部到北海道） | lat 34.0–44.0, lon 134.5–142.0 | 4 |
| `inset-taiwan` | 台湾岛 | lat 21.8–25.5, lon 119.8–122.3 | 2 |
| `inset-india` | 印度（果阿到北部） | lat 11.5–31.0, lon 72.5–80.5 | 4 |
| `inset-usa` | 美国肯塔基+田纳西 | lat 34.4–39.2, lon −88.5–−83.0 | 4 |

画风同样是羊皮纸手绘地图（呼应世界地图 `world-map.png`）：淡彩陆块、波浪描边海岸、可加山脉/森林小装饰，**但不要画图钉、不要写地名文字**（网页会叠加图钉和标签）。

> bbox 若和你画的图对不上，落盘后让 Claude 起预览核验图钉落位，不准就微调 bbox 或重画。

---

## 4. 批次③：横幅重画 6 张（收尾）

**路径**：`public/assets/regions/<产区id>-banner.png`　**尺寸**：严格 **1600×500（3.2:1 全景）**
产区 id：`scotland` `ireland` `japan` `usa` `taiwan` `india`

现有 6 张在页面上观感偏拉伸。站点 CSS 已锁死 16:5 容器、不再由前端引入变形，**问题在素材本身**——出图时画面没按 3.2:1 全景构图（像是在方图上硬拉）。重画要点：
1. 画布严格 1600×500，构图就按扁长全景来（横向展开的产区风光，酒厂在一侧、风景铺满另一侧）
2. 无文字（网页叠标题）
3. 落盘后让 Claude 核验 `dispRatio≈3.20` 且观感自然

---

## 5. 怎么参考"之前的任务"保持一致

新对话手上没有历史记忆，靠这三个文件对齐：

1. **本文件（HANDOFF-出图.md）** = 一致性总纲 + 打光规范 + 坐标表，先读这个
2. **`CODEX-TODO.md`** = 更早的完整出图契约、返工清单、分批协议，规格细节的权威出处
3. **`public/assets/distilleries/*.png`（27 张已完成立绘）** = 画风的活样板，画任何新图前先打开几张看，让新图和它们像"同一个画师同一套书"里的

内容事实（酒厂创立年份、单品桶型/风味/珍稀度）一律以 `src/content/` 下的 md 为准，不要自己编。

---

## 6. 每批画完，怎么交给 Claude 验收上线

你只管出图落盘。落盘后回主对话（Claude）说一句，例如：
> "瓶身图苏格兰批画完了，在 public/assets/whiskies/"

Claude 会：① md5 全库查重 ② 抽查画质与辨识度 ③ 起预览截图看上墙效果 ④ git 提交推送上线。
你**不需要**自己 git commit / push（避免把 `generated-images-contact-sheet.jpg` 这类临时拼版图误传——它已被 .gitignore 忽略）。

---

## 附录：82 个单品 id 完整清单（瓶身图文件名照此）

苏格兰：`macallan-12-sherry` `macallan-18-sherry` `macallan-1926` `glenfiddich-12` `glenfiddich-15-solera` `glenfiddich-snow-phoenix` `laphroaig-10` `laphroaig-quarter-cask` `laphroaig-cairdeas-2024` `ardbeg-10` `ardbeg-uigeadail` `ardbeg-supernova-2019` `glenmorangie-original-12` `glenmorangie-quinta-ruban-14` `glenmorangie-signet` `auchentoshan-12` `auchentoshan-american-oak` `auchentoshan-three-wood` `springbank-10` `springbank-15` `springbank-longrow-peated` `talisker-10` `talisker-18` `talisker-distillers-edition`

日本：`yamazaki-12` `yamazaki-18` `yamazaki-distillers-reserve` `yoichi-10` `yoichi-single-malt` `yoichi-apple-brandy-finish` `hakushu-12` `hakushu-18-peated-malt` `hakushu-distillers-reserve` `chichibu-the-first` `chichibu-on-the-way` `chichibu-london-edition`

爱尔兰：`jameson-original` `jameson-black-barrel` `jameson-18` `bushmills-10` `bushmills-16` `bushmills-black-bush` `teeling-small-batch` `teeling-single-malt` `teeling-24` `waterford-bannow-island` `waterford-sheestown` `waterford-biodynamic-luna`

美国：`jim-beam-white-label` `jim-beam-black` `jim-beam-bookers` `jack-daniels-old-no-7` `jack-daniels-gentleman-jack` `jack-daniels-single-barrel` `buffalo-trace-bourbon` `buffalo-trace-eagle-rare-10` `buffalo-trace-pappy-15` `makers-mark-bourbon` `makers-mark-46` `makers-mark-cask-strength`

印度：`amrut-fusion` `amrut-peated` `amrut-portonova` `paul-john-brilliance` `paul-john-bold` `paul-john-edited` `rampur-double-cask` `rampur-asava` `rampur-jugalbandi` `indri-dru` `indri-trini` `indri-diwali-collectors-edition`

台湾：`kavalan-classic` `kavalan-solist-vinho-barrique` `kavalan-solist-fino` `nantou-omar-bourbon` `nantou-omar-sherry` `nantou-omar-plum`

调和名门：`johnnie-walker-red` `johnnie-walker-black-12` `johnnie-walker-blue` `johnnie-walker-blue-ghost-rare`

> 共 82 款。画每瓶前务必读 `src/content/whiskies/<id>.md` 拿 rarity 决定打光。
