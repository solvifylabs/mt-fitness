# Skill Registry — mt-fitness

Generated: 2026-04-20

## User Skills

| Skill | Trigger |
|-------|---------|
| `branch-pr` | When creating a pull request, opening a PR, or preparing changes for review |
| `go-testing` | When writing Go tests, using teatest, or adding test coverage |
| `issue-creation` | When creating a GitHub issue, reporting a bug, or requesting a feature |
| `judgment-day` | When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" |
| `skill-creator` | When user asks to create a new skill, add agent instructions, or document patterns for AI |

## SDD Skills (orchestrator-managed)

`sdd-explore`, `sdd-propose`, `sdd-spec`, `sdd-design`, `sdd-tasks`, `sdd-apply`, `sdd-verify`, `sdd-archive`

## Project Conventions

No project-level CLAUDE.md, agents.md, or .cursorrules found (new project).

## Compact Rules

### branch-pr
- Always create an issue before a PR (issue-first enforcement)
- PR title: under 70 chars; use body for details
- Include test plan checklist in PR body

### issue-creation
- Issues must be created before PRs
- Use clear bug/feature labels
- Include reproduction steps for bugs

### judgment-day
- Launch two independent blind judge sub-agents in parallel
- Synthesize findings and apply fixes
- Re-judge until both pass or escalate after 2 iterations

### skill-creator
- Only create skills for repeated patterns or non-obvious conventions
- Skills live in `~/.claude/skills/{name}/SKILL.md`
- Always include frontmatter: name, description, triggers
