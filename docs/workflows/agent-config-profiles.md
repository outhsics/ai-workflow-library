# 项目级 Agent 配置模板

这套模板用于把项目分成两种执行风格：激进自动执行，或保守确认优先。

推荐策略：

- 全局配置只放通用默认
- 项目根目录再放项目级规则
- 个人实验项目用激进版
- 生产和多人协作用保守版

## 放哪里

Claude Code：项目根目录放 `CLAUDE.md`

Codex：项目根目录放 `AGENTS.md`

## 四个模板

- Claude 激进版：`templates/agent-configs/claude-aggressive.md`
- Claude 保守版：`templates/agent-configs/claude-conservative.md`
- Codex 激进版：`templates/agent-configs/codex-aggressive.md`
- Codex 保守版：`templates/agent-configs/codex-conservative.md`

## 一键安装脚本

仓库内提供脚本：`scripts/install-agent-config.mjs`

示例：

```bash
node scripts/install-agent-config.mjs --agent claude --profile aggressive --target /path/to/project
node scripts/install-agent-config.mjs --agent codex --profile conservative --target /path/to/project
```

如果目标项目里已经有 `CLAUDE.md` 或 `AGENTS.md`，加 `--force` 才会覆盖：

```bash
node scripts/install-agent-config.mjs --agent claude --profile conservative --target /path/to/project --force
```

如果你就在目标项目根目录，也可以省略 `--target`，直接在当前目录生成：

```bash
node /path/to/ai-workflow-library/scripts/install-agent-config.mjs --agent codex --profile aggressive
```

## 自动识别模式

仓库内还提供自动判断项目风格的脚本：`scripts/install-agent-config-auto.mjs`。

示例：

```bash
node scripts/install-agent-config-auto.mjs --agent claude --target /path/to/project
node scripts/install-agent-config-auto.mjs --agent codex --target /path/to/project --force
```

它会根据这些信号自动选择 `aggressive` 或 `conservative`：

- 项目路径关键词
- 仓库名和远端名关键词
- 是否存在数据库、迁移、基础设施相关文件
- 当前分支是否为 `main` 或 `master`

如果你想给某个项目自定义规则，可以在项目根目录放 `.agent-config-rules.json`，字段格式与仓库内的 `config/agent-config-rules.json` 一致。

## 快捷命令

如果你已经把这个仓库同步到本机，并把快捷脚本链接进 `~/bin`，可以直接在目标项目根目录运行：

```bash
agent-claude-aggressive
agent-claude-conservative
agent-codex-aggressive
agent-codex-conservative
agent-claude-auto
agent-codex-auto
```

也可以继续附加参数，例如覆盖已有文件：

```bash
agent-codex-conservative --force
```

## 选择建议

### 激进版适合

- 个人项目
- 原型验证
- 低风险前端页面
- 小型工具和自动化脚本

### 保守版适合

- 生产项目
- 多人协作仓库
- 含数据库迁移的项目
- 涉及鉴权、权限、支付、核心流程的项目

## 使用方式

1. 直接复制对应模板，或用安装脚本生成
2. 粘贴到目标仓库根目录
3. 文件名按平台选择：`CLAUDE.md` 或 `AGENTS.md`
4. 重启对应 agent 或新开一个会话

## 推荐搭配

最实用的是三档：

- 全局配置：中等主动
- 重要项目：项目级保守版
- Side project：项目级激进版
