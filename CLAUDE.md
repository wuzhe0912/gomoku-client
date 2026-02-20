# Gomoku Client Guidelines

This repo is public and follows the shared conventions from the project.

## Commit Message Format

```text
[Type][Scope] Short description
```

Examples:

```text
[Feature][board] Draw 15x15 grid lines with responsive sizing
[Feature][ai] Add minimax depth-4 decision flow
[Fix][ui] Prevent duplicate stone placement after click spam
```

### Type

- `Feature`
- `Fix`
- `Refactor`
- `Chore`
- `Docs`
- `Style`
- `Test`

### Scope (Client)

- `board`: canvas board and coordinate mapping
- `stone`: stone drawing and move highlighting
- `ai`: minimax, alpha-beta, scoring
- `worker`: Web Worker communication and off-main-thread compute
- `mode`: PVP/PVE mode flow
- `ui`: menus, dialogs, timers, feedback animations
- `rwd`: mobile and responsive behavior
- `net`: WebSocket client and reconnect handling
- `infra`: Vite, build, deploy, env setup
- `deps`: dependency updates
- `docs`: repo docs

## Conventions

- Commit title only. No `Co-Authored-By` or auto-generated signature lines.
- Keep changes small and focused.
- Use `bun` for dependency management and script execution. Do not use npm/yarn/pnpm in this repo.
- Do not commit secrets. Keep `.env` in `.gitignore`, maintain `.env.example` if needed.
- Default prose can be Traditional Chinese; keep technical terms in English.
