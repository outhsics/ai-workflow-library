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

1. 从对应模板复制内容
2. 粘贴到目标仓库根目录
3. 文件名按平台选择：`CLAUDE.md` 或 `AGENTS.md`
4. 重启对应 agent 或新开一个会话

## 推荐搭配

最实用的是三档：

- 全局配置：中等主动
- 重要项目：项目级保守版
- Side project：项目级激进版
