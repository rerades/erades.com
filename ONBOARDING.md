# Welcome to Area 73

## How We Use Claude

Based on rerades's usage over the last 30 days (15 sessions):

Work Type Breakdown:
  Build Feature     ███████░░░░░░░░░░░░░  35%
  Debug Fix         ████░░░░░░░░░░░░░░░░  20%
  Improve Quality   ████░░░░░░░░░░░░░░░░  20%
  Plan Design       ██░░░░░░░░░░░░░░░░░░  10%
  Write Docs        ██░░░░░░░░░░░░░░░░░░  10%
  Analyze Data      █░░░░░░░░░░░░░░░░░░░   5%

Top Skills & Commands:
  /clear                      ████████████████████  6x/month
  /goal                       █████████████░░░░░░░  4x/month
  /fewer-permission-prompts   ██████████░░░░░░░░░░  3x/month
  /mcp                        ███░░░░░░░░░░░░░░░░░  1x/month
  /model                      ███░░░░░░░░░░░░░░░░░  1x/month
  /auto-mode-setup            ███░░░░░░░░░░░░░░░░░  1x/month

Top MCP Servers:
  context-mode      ████████████████████  129 calls
  render            ███░░░░░░░░░░░░░░░░░   18 calls
  claude-in-chrome  ██░░░░░░░░░░░░░░░░░░   12 calls

## Your Setup Checklist

### Codebases
- [ ] erades.com — https://github.com/rerades/erades.com (Astro 7 + TS strict + Tailwind v4, pnpm, Node >= 22.13)

### MCP Servers to Activate
- [ ] context-mode — keeps big tool outputs (logs, test runs, git history) out of the context window by running the analysis in a sandbox. Installed as a Claude Code plugin; check with `/mcp`.
- [ ] render — deploys and logs for the production service on Render. Ask rerades for an invite to the Render workspace, then add the Render MCP server and authenticate.
- [ ] claude-in-chrome — drives your own Chrome to check pages, console errors and visual bugs. Install the Claude in Chrome extension and grant per-site permissions.

### Skills to Know About
- [ ] `/clear` — wipe the conversation between unrelated tasks. Used more than anything else here: one topic per session keeps Claude accurate.
- [ ] `/goal` — state the target up front on multi-step work (migrations, CI changes) so the plan stays anchored.
- [ ] `/fewer-permission-prompts` — scans your transcripts and allowlists the safe read-only commands in `.claude/settings.json`. Run it early.
- [ ] `/mcp` — list and check the MCP servers currently connected.
- [ ] `/model` — switch models; heavier planning/migration work gets the bigger model.
- [ ] `/auto-mode-setup` — configures auto mode, where Claude does file work through Bash instead of one-tool-per-edit.

## Team Tips

- **Nunca `push` directo a `master`.** Siempre rama + PR, incluso para un cambio de una línea. Hay hooks git locales que bloquean el push directo, pero no cubren `gh pr merge` — la disciplina la pones tú.
- Antes de empujar, pasa lo mismo que la CI: `pnpm lint && pnpm typecheck && pnpm test:unit`.
- Los baselines visuales se bendicen **desde CI**, nunca desde tu máquina (en Apple Silicon el diff de rasterizado es indistinguible de una regresión real).
- Un tema por sesión: `/clear` entre tareas no relacionadas.

## Get Started

No hay ticket de arranque todavía. Empieza clonando el repo, `pnpm install`, y pídele a Claude que te dé un recorrido por `CLAUDE.md`; luego coge un PR de Dependabot abierto o un bug visual pequeño como primera rama.

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
