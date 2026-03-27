# 发布到 GitHub Pages

## 1. 初始化仓库

在当前项目目录执行：

```bash
git init
git add .
git commit -m "feat: init AI workflow library site"
```

## 2. 创建 GitHub 仓库

创建一个空仓库，例如 `ai-workflow-library`，然后绑定远端：

```bash
git remote add origin git@github.com:outhsics/ai-workflow-library.git
git branch -M main
git push -u origin main
```

## 3. 开启 Pages

进入仓库页面：

`Settings > Pages > Build and deployment > Source`

选择：

`GitHub Actions`

## 4. 等待 Actions 完成

推送后，仓库里的 `.github/workflows/deploy.yml` 会自动：

- 安装依赖
- 构建 VitePress
- 上传静态产物
- 发布到 GitHub Pages

## 5. 修改仓库地址

记得把下面这个配置文件里的占位链接改成你自己的：

- `/docs/.vitepress/config.mts`

把 `https://github.com/outhsics/ai-workflow-library` 改成你自己的真实地址。
