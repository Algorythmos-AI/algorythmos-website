# LLM Change Policy

## What AI Agents MUST Do
- Read /docs/AI_AGENT_WORKFLOW.md first
- Run `npm run i18n:check` before commit
- Add EN + FR for all new strings
- Preserve existing SEO schemas
- Use `t()` for all user-facing text

## What AI Agents MUST NOT Do
- Remove governance files
- Hardcode English/French
- Change URL patterns
- Delete translation keys
- Modify ScrollSequence architecture
- Skip validation commands

## Required Commands Before Commit
```bash
npm run i18n:check
npm run health:check
npm run lint
npm run build
```

## Full rules: /docs/AI_AGENT_WORKFLOW.md
