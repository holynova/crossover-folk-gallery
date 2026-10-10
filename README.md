# 王者荣耀 · 联名英雄图集

155 张 AI 概念图，按 28 个动漫与游戏联名主题分类。选择主题，点击图片看大图；支持方向键切换和 Esc 关闭。

[在线浏览](https://crossover-folk-gallery.xiaosang.cc/) · [源码](https://github.com/holynova/crossover-folk-gallery)

![图集页面](./assets/readme/screenshot.png)

A minimal gallery of 155 AI-generated Honor of Kings crossover concepts across 28 anime and game themes. Browse by theme and open any image in the fullscreen viewer.

AI 创作，非官方联名概念，不代表真实上线的皮肤。角色与商标归各自权利人。

## 本地运行

```bash
python3 -m http.server 8080
```

打开 http://localhost:8080/。纯 HTML、CSS 和 JavaScript，无框架依赖。

## 图片与性能

v3.2.0 使用 480/960px WebP 响应式缩略图，点击后加载保留原尺寸的高清 WebP。列表每批 12 张，滚动追加；浏览器不支持自动追加时可点击“加载更多图片”。快速翻页取消旧请求，最多保留 3 张已解码大图，关闭后释放。

原始 PNG 保留在仓库，未上传至站点。带指纹的图片长期缓存，源码变更会生成新路径。性能对比见 [PERFORMANCE.md](./PERFORMANCE.md)。

```bash
node scripts/optimize-gallery.mjs
node scripts/build-site.mjs
```

转换使用 `cwebp`，并发上限 4。构建只收集页面与数据引用的资源到 `dist/`，排除历史资源和开发文件。

## 发布

从 `main` 同一提交在本地手动发布：

```bash
node scripts/build-site.mjs
npx --yes wrangler@4.128.0 deploy --dry-run --config wrangler.jsonc
npx --yes wrangler@4.128.0 deploy --config wrangler.jsonc
```

<img src="./assets/readme/qr.png" width="144" alt="扫码打开联名英雄图集">
