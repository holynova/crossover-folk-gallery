# 王者荣耀 · 联名英雄图集

简单的联名英雄图片展示网站。155 张 AI 概念图，按 28 个动漫与游戏联名主题分类。包含鬼灭之刃、七龙珠、火影忍者、海贼王、黑神话：悟空、艾尔登法环等。

[在线浏览](https://crossover-folk-gallery.xiaosang.cc/) · [源码](https://github.com/holynova/crossover-folk-gallery)

![图集页面](./assets/readme/screenshot.png)

选择主题筛选，点击图片查看大图。大图支持上一张、下一张、方向键切换和 Esc 关闭。浏览时加载缩略图，打开大图后再加载高清图。

AI 创作，非官方联名概念，不代表真实上线的皮肤。相关角色与商标归各自权利人。

## 本地运行

```bash
python3 -m http.server 8080
```

打开 http://localhost:8080/。纯 HTML、CSS 和 JavaScript，无构建依赖。

## 内容与结构

- `assets/js/data.js`：155 张图片的主题、英雄、角色与图片路径。
- `thumbnails/fusion_skins/`、`thumbnails/classic_skins/`：浏览缩略图。
- `details/fusion_skins/`、`images/classic_skins/`：高清展示图。

本次简化移除了农民画、测试版和旧版立绘入口，以及搜索、参数说明、打包下载、展示模式切换。历史原始资源保留在仓库中，不进入公开站点。

## 发布

从 `main` 在本地手动发布到 Cloudflare Workers：

```bash
npx wrangler deploy --dry-run --config wrangler.jsonc
npx wrangler deploy --config wrangler.jsonc
```
