# AGENTS

## Purpose
- Define shared conventions for humans and coding agents working in this repository.

## Repository
- Name: `devfolio-blog`
- Root: `D:\GitHub\devfolio-blog`

## Working Agreements
- Keep changes focused and minimal.
- Prefer small, reviewable commits.
- Preserve existing architecture and naming patterns.
- Do not commit secrets or machine-specific credentials.

## Quality Gates
- Run project checks before opening a PR when possible.
- For startup verification, use: `npm run ci:health`

## Git workflow
- Before every `git commit`, always run:
  - `npm run build`
  - `npm test`
  - `npm run ci:health`
- Never commit if any check fails.
- Fix all lint/test/build issues before committing.

## Notes
- Update this file when team workflows or automation expectations change.
