# 跨界盛典 · Crossover & Folk Art Gallery

AI生成的动漫联名皮肤概念与江南水乡农民画画廊，支持筛选、灯箱和图片下载。

An AI-generated concept gallery with anime crossover skins, folk art, filters and downloads.

[在线体验](https://crossover-folk-gallery.xiaosang.cc/) · [源码](https://github.com/holynova/crossover-folk-gallery)

![跨界盛典 · Crossover & Folk Art Gallery：真实页面截图](./assets/readme/screenshot.png)

## 可以做什么

- 缩略图用于浏览，灯箱加载高清原图。
- 支持搜索、单图下载与当前筛选结果打包。

## 浏览与下载

发布版 v3.1.0，共104幅：45款深度联动皮肤、6款测试版本、45款存档皮肤与8幅水乡农民画。切换分类或搜索，再打开灯箱查看原图；可单张下载或在浏览器打包当前筛选结果。预打包资源位于 `downloads/`；超过Cloudflare静态文件限制的压缩包通过GitHub原始文件地址下载。

这是AI生成的非官方概念展示，不代表真实上线的联名皮肤。相关角色与商标归各自权利人。

## 本地运行

```bash
python3 -m http.server 8080
```

打开 http://localhost:8080/。使用本地HTTP服务即可，无需安装前端框架。

<img src="./assets/readme/qr.png" width="144" alt="扫码打开https://crossover-folk-gallery.xiaosang.cc/">

## 发布

```bash
npx --yes wrangler@4.128.0 deploy --dry-run --config wrangler.jsonc
npx --yes wrangler@4.128.0 deploy --config wrangler.jsonc
```

从 `main` 同一提交在本地手动发布到Cloudflare Workers。正式地址：[https://crossover-folk-gallery.xiaosang.cc/](https://crossover-folk-gallery.xiaosang.cc/)。 `.assetsignore` 限定公开播放器/站点资源，排除合成工程、开发文件与未供页面使用的大体积音频/字体。
