# AI Workflow Library

一个基于 `VitePress` 的个人技术库网站模板，适合记录：

- 常用 AI 工具和用途
- 日常工作流拆解
- 自动化脚本与发布流程
- 博客式方法论沉淀

## 本地运行

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## GitHub Pages 部署

1. 创建 GitHub 仓库并把当前目录推上去。
2. 在 GitHub 仓库中进入 `Settings > Pages`。
3. `Source` 选择 `GitHub Actions`。
4. 推送到默认分支后，`Actions` 会自动构建并部署。

VitePress 的 `base` 已按 `GITHUB_REPOSITORY` 自动处理：

- 本地预览时使用 `/`
- GitHub Actions 构建时自动切到 `/<repo-name>/`

## 内容入口

- 首页：[docs/index.md](docs/index.md)
- 工具栈：[docs/stack/index.md](docs/stack/index.md)
- 工作流：[docs/workflows/index.md](docs/workflows/index.md)
- 博客：[docs/blog/index.md](docs/blog/index.md)

你后续主要只需要改 Markdown 内容，不需要频繁改主题代码。
