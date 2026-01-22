# Morty

[![npm version](https://img.shields.io/npm/v/morty-cli.svg)](https://www.npmjs.com/package/morty-cli)

![Morty](assets/morty.jpeg)

Autonomous AI coding loop. Runs AI agents on tasks until done.

## Install

**Option A: [npm](https://www.npmjs.com/package/morty-cli)** (recommended)

```bash
npm install -g morty-cli

# Then use anywhere
morty "add login button"
morty --prd PRD.md
```

**Option B: Clone**

```bash
git clone https://github.com/michaelshimeles/morty.git
cd morty && chmod +x morty.sh

./morty.sh "add login button"
./morty.sh --prd PRD.md
```

Both versions have identical features. Examples below use `morty` (npm) - substitute `./morty.sh` if using the bash script.

## Two Modes

**Single task** - just tell it what to do:

```bash
morty "add dark mode"
morty "fix the auth bug"
```

**Task list** - work through a PRD:

```bash
morty              # uses PRD.md
morty --prd tasks.md
```

## Project Config

Optional. Stores rules the AI must follow.

```bash
morty --init              # auto-detects project settings
morty --config            # view config
morty --add-rule "use TypeScript strict mode"
```

Creates `.morty/config.yaml`:

```yaml
project:
  name: "my-app"
  language: "TypeScript"
  framework: "Next.js"

commands:
  test: "npm test"
  lint: "npm run lint"
  build: "npm run build"

rules:
  - "use server actions not API routes"
  - "follow error pattern in src/utils/errors.ts"

boundaries:
  never_touch:
    - "src/legacy/**"
    - "*.lock"
```

Rules apply to all tasks (single or PRD).

## AI Engines

```bash
morty              # Claude Code (default)
morty --opencode   # OpenCode
morty --cursor     # Cursor
morty --codex      # Codex
morty --qwen       # Qwen-Code
morty --droid      # Factory Droid
morty --copilot    # GitHub Copilot
```

### Model Override

Override the default model for any engine:

```bash
morty --model sonnet "add feature"                    # use sonnet with Claude
morty --sonnet "add feature"                          # shortcut for above
morty --opencode --model opencode/glm-4.7-free "task" # custom OpenCode model
morty --qwen --model qwen-max "build api"             # custom Qwen model
```

## Task Sources

**Markdown file** (default):

```bash
morty --prd PRD.md
```

```markdown
## Tasks

- [ ] create auth
- [ ] add dashboard
- [x] done task (skipped)
```

**Markdown folder** (for large projects):

```bash
morty --prd ./prd/
```

When pointing to a folder, Morty reads all `.md` files and aggregates tasks:

```
prd/
  backend.md      # - [ ] create user API
  frontend.md     # - [ ] add login page
  infra.md        # - [ ] setup CI/CD
```

Tasks are tracked per-file so completion updates the correct file.

**YAML**:

```bash
morty --yaml tasks.yaml
```

```yaml
tasks:
  - title: create auth
    completed: false
  - title: add dashboard
    completed: false
```

**GitHub Issues**:

```bash
morty --github owner/repo
morty --github owner/repo --github-label "ready"
```

## Parallel Execution

```bash
morty --parallel                  # 3 agents default
morty --parallel --max-parallel 5 # 5 agents
```

Each agent gets isolated worktree + branch:

```
Agent 1 → /tmp/xxx/agent-1 → morty/agent-1-create-auth
Agent 2 → /tmp/xxx/agent-2 → morty/agent-2-add-dashboard
Agent 3 → /tmp/xxx/agent-3 → morty/agent-3-build-api
```

Without `--create-pr`: auto-merges back to base branch, AI resolves conflicts.
With `--create-pr`: keeps branches, creates PRs.
With `--no-merge`: keeps branches without merging or creating PRs.

**YAML parallel groups** - control execution order:

```yaml
tasks:
  - title: Create User model
    parallel_group: 1
  - title: Create Post model
    parallel_group: 1 # same group = runs together
  - title: Add relationships
    parallel_group: 2 # runs after group 1
```

## Branch Workflow

```bash
morty --branch-per-task                # branch per task
morty --branch-per-task --create-pr    # + create PRs
morty --branch-per-task --draft-pr     # + draft PRs
morty --base-branch main               # branch from main
```

Branch naming: `morty/<task-slug>`

## Browser Automation

Morty can use [agent-browser](https://agent-browser.dev) to automate browser interactions during tasks.

```bash
morty "test the login flow" --browser    # force enable
morty "add checkout" --no-browser        # force disable
morty "build feature"                    # auto-detect (default)
```

When enabled, the AI gets browser commands:

- `agent-browser open <url>` - navigate to URL
- `agent-browser snapshot` - get element refs (@e1, @e2)
- `agent-browser click @e1` - click element
- `agent-browser type @e1 "text"` - type into input
- `agent-browser screenshot <file>` - capture screenshot

**Use cases:**

- Testing UI after implementing features
- Verifying deployments
- Form filling and workflow testing

**Config** (`.morty/config.yaml`):

```yaml
capabilities:
  browser: "auto" # "auto", "true", or "false"
```

## Options

| Flag                 | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `--prd PATH`         | task file or folder (auto-detected, default: PRD.md) |
| `--yaml FILE`        | YAML task file                                       |
| `--github REPO`      | use GitHub issues                                    |
| `--github-label TAG` | filter issues by label                               |
| `--model NAME`       | override model for any engine                        |
| `--sonnet`           | shortcut for `--claude --model sonnet`               |
| `--parallel`         | run parallel                                         |
| `--max-parallel N`   | max agents (default: 3)                              |
| `--no-merge`         | skip auto-merge in parallel mode                     |
| `--branch-per-task`  | branch per task                                      |
| `--base-branch NAME` | base branch                                          |
| `--create-pr`        | create PRs                                           |
| `--draft-pr`         | draft PRs                                            |
| `--no-tests`         | skip tests                                           |
| `--no-lint`          | skip lint                                            |
| `--fast`             | skip tests + lint                                    |
| `--no-commit`        | don't auto-commit                                    |
| `--max-iterations N` | stop after N tasks                                   |
| `--max-retries N`    | retries per task (default: 3)                        |
| `--retry-delay N`    | seconds between retries                              |
| `--dry-run`          | preview only                                         |
| `--browser`          | enable browser automation                            |
| `--no-browser`       | disable browser automation                           |
| `-v, --verbose`      | debug output                                         |
| `--init`             | setup .morty/ config                                 |
| `--config`           | show config                                          |
| `--add-rule "rule"`  | add rule to config                                   |

## Requirements

**Required:**

- AI CLI: [Claude Code](https://github.com/anthropics/claude-code), [OpenCode](https://opencode.ai/docs/), [Cursor](https://cursor.com), Codex, Qwen-Code, [Factory Droid](https://docs.factory.ai/cli/getting-started/quickstart), or [GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli)

**npm version (`morty-cli`):**

- Node.js 18+ or Bun

**Bash version (`morty.sh`):**

- `jq`
- `yq` (optional, for YAML tasks)
- `bc` (optional, for cost calc)

**Both versions:**

- `gh` (optional, for GitHub issues / `--create-pr`)
- [agent-browser](https://agent-browser.dev) (optional, for `--browser`)

## Engine Details

| Engine   | CLI          | Permissions                      | Output        |
| -------- | ------------ | -------------------------------- | ------------- |
| Claude   | `claude`     | `--dangerously-skip-permissions` | tokens + cost |
| OpenCode | `opencode`   | `full-auto`                      | tokens + cost |
| Codex    | `codex`      | N/A                              | tokens        |
| Cursor   | `agent`      | `--force`                        | duration      |
| Qwen     | `qwen`       | `--approval-mode yolo`           | tokens        |
| Droid    | `droid exec` | `--auto medium`                  | duration      |
| Copilot  | `copilot`    | `-p` flag                        | duration      |

---

## Changelog

### v5.0.0

- **Rebranded from Ralphy to Morty**
- New config directory: `.morty/` (backward compatible with `.ralphy/`)
- Updated CLI command: `morty` (replaces `ralphy`)
- Branch prefix: `morty/` (replaces `ralphy/`)

### v4.4.0

- GitHub Copilot CLI support (`--copilot`)

### v4.3.0

- model override: `--model <name>` flag to override model for any engine
- `--sonnet` shortcut for `--claude --model sonnet`
- `--no-merge` flag to skip auto-merge in parallel mode
- AI-assisted merge conflict resolution during parallel auto-merge
- root user detection: error for Claude/Cursor, warning for other engines
- improved OpenCode error handling and model override support

### v4.2.0

- browser automation: `--browser` / `--no-browser` with [agent-browser](https://agent-browser.dev)
- auto-detects agent-browser when available
- config option: `capabilities.browser` in `.morty/config.yaml`

### v4.1.0

- TypeScript CLI: `npm install -g morty-cli`
- cross-platform binaries (macOS, Linux, Windows)
- no dependencies on jq/yq/bc for npm version

### v4.0.0

- single-task mode: `morty "task"` without PRD
- project config: `--init` creates `.morty/` with rules + auto-detection
- new: `--config`, `--add-rule`, `--no-commit`

### v3.3.0

- Factory Droid support (`--droid`)

### v3.2.0

- Qwen-Code support (`--qwen`)

### v3.1.0

- Cursor support (`--cursor`)
- better task verification

### v3.0.0

- parallel execution with worktrees
- branch-per-task + auto-PR
- YAML + GitHub Issues sources
- parallel groups

### v2.0.0

- OpenCode support
- retry logic
- `--max-iterations`, `--dry-run`

### v1.0.0

- initial release

## Community

- [Discord](https://rasmic.link/discord)

## License

MIT
