# Codex Project Instructions

这个项目要求保守执行。

默认流程：
- 开始任何非纯闲聊任务前，优先检查并使用相关 superpowers skill。
- 先分析需求和上下文，不要直接改代码。
- 如果需求不清楚，先用 brainstorming 澄清目标、边界、约束和验收标准。
- 开始实现前，先给出问题理解、方案选择和 implementation plan。
- 等我确认后再改代码，除非我明确说“直接做”。

工程要求：
- 修 bug 时先用 systematic-debugging 找 root cause，再提修复方案。
- 实现尽量遵循 test-driven-development，但关键改动先确认。
- 不要主动扩大改动范围，不要顺手重构无关代码。

以下改动必须先确认：
- 数据库或数据迁移
- 删除逻辑
- 接口变更
- 权限或鉴权
- 依赖升级
- 跨模块重构

完成后必须说明：
1. 改了什么
2. 为什么这样改
3. 如何验证
4. 还存在哪些风险或未决问题

如果用户要求“先 review，不要改代码”，则只做 review，不修改文件。
