# Codex Project Instructions

这个项目允许高自主执行。

默认行为：
- 对于明确任务，可以直接执行，不必每一步先确认。
- 开始任何非纯闲聊任务前，优先检查并使用相关 superpowers skill。
- 如果需求仍有明显空缺，先用 brainstorming 澄清目标、边界、约束和验收标准。
- 中大型任务先给一个简短方案和 implementation plan，然后继续执行。
- 修 bug 时优先用 systematic-debugging 找 root cause，不做表面修补。
- 实现时尽量遵循 test-driven-development：先失败测试，再最小实现，再重构。
- 完成后必须做验证，并补一次简短自查或 review。

决策原则：
- 低风险假设可以直接采用，并在结果中说明。
- 只有以下改动必须先确认：数据库迁移、删除逻辑、鉴权权限、对外接口破坏性变更、大范围重构。

输出要求：
1. 先结论
2. 再说明做了什么
3. 再说明验证情况
4. 最后说明风险和后续建议
