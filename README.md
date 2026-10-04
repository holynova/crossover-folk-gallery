# AI 原创画廊 · 跨界盛典 (Crossover & Folk Art Gallery)

> **在线体验 (GitHub Pages)**: [https://holynova.github.io/crossover-folk-gallery/](https://holynova.github.io/crossover-folk-gallery/)  
> **开源仓库**: [https://github.com/holynova/crossover-folk-gallery](https://github.com/holynova/crossover-folk-gallery)

---

## 📖 项目简介 (Overview)

**跨界盛典 (Crossover & Folk Art Gallery)** 是一个收录 53 幅 AI 原创超清艺术大作的高性能静态交互式画廊。项目融合了两大极具代表性的视觉艺术企划：

1. **《王者荣耀》× 顶流热血动漫联名皮肤展 (45 款)**  
   - 100% 像素级复刻正统手游 16:9 横屏次世代皮肤展示界面（包含专属技能动作、台词金句、技能特效描述、价格等级 UI）。
   - **六大顶流动漫全阵容**：
     - 🔥 **鬼灭之刃**（20 款：灶门炭治郎、炎柱、富冈义勇、无惨、继国缘一等）
     - 👁️ **咒术回战**（5 款：五条悟、虎杖悠仁、伏黑惠、宿傩、乙骨忧太）
     - ⚔️ **进击的巨人**（5 款：利威尔兵长、艾伦巨人、三笠、铠之巨人、超大型巨人）
     - 🍥 **火影忍者**（5 款：宇智波佐助、漩涡鸣人、旗木卡卡西、宇智波鼬、波风水门）
     - 🏴‍☠️ **海贼王**（5 款：五档尼卡路飞、索隆、香克斯、汉库克、山治）
     - 🗡️ **死神 BLEACH**（5 款：黑崎一护、朽木白哉、冬狮郎、蓝染惣右介、乌尔奇奥拉）

2. **中国现代民间农民画 · 水乡风俗集 (8 幅)**  
   - 致敬秀洲/金山现代农民画派“工笔水粉密体点彩法”，融合江南粉墙黛瓦、蓝印花布、二八大杠与红色拖拉机。
   - **盛世华诞·国庆盛典特辑 (3 幅)**：《水乡欢歌·喜迎国庆》、《长街百家宴·盛世欢聚》、《火树银花·水乡国庆之夜》
   - **水乡岁月·民间风俗五部曲 (5 幅)**：《水乡晒秋·丰收大院》、《春山采茶·炒茶欢歌》、《古河埠头·端午龙舟》、《喜气临门·水乡迎亲》、《夏夜清风·露天电影》

---

## ✨ 核心特性 (Features)

- ⚡ **原生高保真交互**：基于纯静态 HTML5/CSS3/Vanilla JS 构建，零外部框架依赖，秒级加载。
- 🔍 **双层画质引擎**：首屏网格采用 800px 极速缩略图流畅滚动，点击全景灯箱即刻加载 3.5MB+ 原始无损 PNG。
- 📦 **多通道原图打包下载 (Packaged Downloads)**：
  - **1-Click 离线压缩包**：预置 3 大分类原图 ZIP，直接下载免等待。
  - **浏览器动态打包 (JSZip)**：可针对任意筛选或搜索结果，在浏览器端实时抓取并打包生成 ZIP 下载，带百分比进度条。
  - **单张下载**：每张卡片与灯箱均支持独立原图直接保存。
- 🎯 **全局多维筛选与瞬时搜索**：支持一级分类、二级主题标签及毫秒级关键词检索。
- 📱 **移动端全适配**：适配从 iPhone 375px 到 4K 超宽屏的全响应式排版。

---

## 📂 项目结构 (Repository Structure)

```text
crossover-folk-gallery/
├── index.html                  # 画廊主入口
├── favicon.svg                 # 定制矢量 Favicon
├── assets/
│   ├── css/styles.css          # 现代化流光质感样式表
│   └── js/
│       ├── app.js              # 画廊交互、灯箱与动态打包逻辑
│       ├── data.js             # 53 幅大作完整元数据配置
│       └── jszip.min.js        # 客户端动态打包 ZIP 核心库
├── downloads/                  # 预打包原图离线压缩包
│   ├── folk_art_original_8.zip         # 农民画全套 (28.7 MB)
│   ├── demon_slayer_skins_20.zip       # 鬼灭之刃全套 (51.8 MB)
│   └── anime_5_series_skins_25.zip     # 五大热血漫全套 (64.2 MB)
├── images/                     # 原始超清无损 PNG 图库 (53 幅)
│   ├── folk_art/               # 8 幅民间农民画原图
│   └── skins/                  # 45 幅王者荣耀联名皮肤原图
├── thumbnails/                 # 800px 高性能 Web 缩略图
└── .github/workflows/pages.yml # GitHub Pages 自动部署流水线
```

---

## 🚀 本地运行 (Local Development)

无需安装任何依赖，使用任意静态 HTTP 服务器即可：

```bash
# 进入项目目录
cd crossover-folk-gallery

# 使用 Python 启动本地预览
python3 -m http.server 8080

# 浏览器访问
open http://localhost:8080
```

---

## 📄 License & Credits

- All artwork prompts & concepts created for pairing showcase.
- Deployed on **GitHub Pages**.
