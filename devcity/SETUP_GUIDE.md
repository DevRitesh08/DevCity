# 🏝️ ISLEFOLIO AGENTS — COMPLETE SETUP GUIDE
## LOCAL Mode + Copilot Pro + Free AI APIs

---

## STEP 0 — READ THIS FIRST (2 minutes)

```
Your setup:
  VS Code           ✅ installed
  Copilot Pro       ✅ active (auto-suggestions in editor)
  Agent Mode        ← you want LOCAL (not Copilot CLI, not Claude)

What LOCAL mode means:
  Your agents run as real Node.js scripts on YOUR machine.
  They read your actual files, write JSON reports, and fix bugs.
  Copilot works alongside — it suggests code as you type.
  The agents catch what Copilot misses (architecture, performance, regressions).

AI used by agents:
  Groq API  — FREE, fast, 70B model (get key in 2 min, no card needed)
  Gemini    — FREE tier, used for long-context agents (architecture review)
  Both keys optional — works with just one.
```

---

## STEP 1 — GET YOUR FREE API KEY (2 minutes)

### Option A: Groq (Recommended — Fastest)
```
1. Open browser → console.groq.com
2. Click "Sign in" → use your GitHub account
3. Left sidebar → "API Keys"
4. Click "Create API key"
5. Name it: "islefolio-agents"
6. Copy the key (starts with "gsk_...")
7. Save it — you won't see it again
```

### Option B: Gemini (You already have this)
```
1. Open browser → aistudio.google.com/apikey
2. Click "Create API key"
3. Select "Create API key in new project"
4. Copy the key (starts with "AIza...")
```

**You only need ONE key to start. Get Groq first — it's faster.**

---

## STEP 2 — ADD FILES TO YOUR PROJECT

Copy these files into your ISLEFOLIO project root:

```
YOUR PROJECT ROOT/
│
├── .github/
│   ├── copilot-instructions.md    ← Copilot reads this for context
│   └── workflows/
│       └── agents.yml             ← CI runs agents on every push
│
├── .vscode/
│   ├── settings.json              ← VS Code settings
│   └── tasks.json                 ← Run agents from Command Palette
│
├── .antigravity/
│   ├── AGENTS.md                  ← Master config
│   ├── agents/
│   │   ├── 00-archipelago-core.md
│   │   ├── 01-tide-watcher.md
│   │   ├── 02-wave-rider.md
│   │   ├── 03-terrain-keeper.md
│   │   ├── 04-storm-detector.md
│   │   ├── 05-compass-rose.md
│   │   └── 06-cartographer-ai.md
│   ├── memory/
│   │   └── ecosystem-state.json   ← Self-learning memory (auto-created)
│   ├── reports/                   ← Agent outputs (auto-created)
│   └── backups/                   ← Auto-fix backups (auto-created)
│
├── scripts/
│   └── agents/
│       ├── run-agents.ts          ← Main runner
│       └── delete-old-agents.ts   ← Cleanup script
│
└── .env.local                     ← Your API keys (copy from template)
```

---

## STEP 3 — INSTALL DEPENDENCIES

Open terminal in VS Code (`Ctrl+` `` ` ``):

```bash
# Install agent runner dependencies
npm install --save-dev tsx chokidar-cli @types/node

# Verify tsx works
npx tsx --version
# Should print: x.x.x
```

---

## STEP 4 — ADD YOUR API KEY

```bash
# Copy the template
cp .env.local.template .env.local

# Open .env.local in VS Code and fill in:
# GROQ_API_KEY=gsk_your_key_here
# (and GEMINI_API_KEY if you got that too)
```

**On Windows:**
```cmd
copy .env.local.template .env.local
# Then open .env.local and paste your key
```

---

## STEP 5 — ADD SCRIPTS TO package.json

Open your `package.json` and add these to the `"scripts"` section:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",

    "agents":             "tsx scripts/agents/run-agents.ts",
    "agents:watch":       "chokidar \"src/**/*.{ts,tsx}\" -c \"npm run agents\" --debounce 3000",
    "agents:delete-old":  "tsx scripts/agents/delete-old-agents.ts",
    "agents:report":      "node -e \"...\"",
    "agents:health":      "node -e \"...\""
  }
}
```

*(copy the full scripts from `package-scripts-to-add.jsonc`)*

---

## STEP 6 — DELETE OLD AGENTS

```bash
npm run agents:delete-old
```

Output should say:
```
🗑️  Deleted: neon-architect, chrome-smith, etc.
✅  Initialized memory files
🏝️  New ISLEFOLIO agents ready
```

---

## STEP 7 — FIRST RUN

```bash
npm run agents
```

Expected output:
```
╔══════════════════════════════════════════════════════════╗
║       🏝️  ISLEFOLIO — AGENT ECOSYSTEM STARTING           ║
║       Mode: LOCAL  |  Provider: Groq + Gemini            ║
╚══════════════════════════════════════════════════════════╝

📦 Reading codebase...

🌊  Running TIDE WATCHER...
  ✅ Saved: .antigravity/reports/01-tide-watcher-2026-03-08-1430.json

🌊  Running STORM DETECTOR...
  🔧 AUTO-FIX SD-001: src/lib/islandGenerator.ts
  ✅ Saved: .antigravity/reports/04-storm-detector-2026-03-08-1430.json

... (all 7 agents run)

╔══════════════════════════════════════════════════════════╗
║               🏝️  ISLEFOLIO AGENT REPORT                 ║
╠══════════════════════════════════════════════════════════╣
║  TIDE WATCHER          7 issues                          ║
║  STORM DETECTOR        3 issues 🔧 2 fixed              ║
║  WAVE RIDER            clean [85/100]                    ║
║  TERRAIN KEEPER        clean [92/100]                    ║
║  COMPASS ROSE          2 issues [75/100]                 ║
║  CARTOGRAPHER AI       clean                             ║
║  ARCHIPELAGO CORE      synthesis complete [81/100]       ║
╠══════════════════════════════════════════════════════════╣
║  Total: 12 issues  |  0 critical  |  2 auto-fixed        ║
║  Time: 47.3s  |  Reports: .antigravity/reports/          ║
╚══════════════════════════════════════════════════════════╝

✅  All clear — no critical issues
```

**If you see errors, see TROUBLESHOOTING below.**

---

## STEP 8 — CONFIGURE VS CODE AGENT MODE

### Set to LOCAL mode
1. In VS Code, open Copilot Chat (`Ctrl+Shift+I` or click the chat icon)
2. Look for the agent type dropdown (your screenshot showed it)
3. Select **"Local"**

### How to use Copilot with agents
- **While coding**: Copilot suggests code automatically. Accept with `Tab`.
- **When stuck**: Open chat → ask `@workspace` questions
- **For bug fixes**: Run `npm run agent:storm-detector` first, then fix
- **For architecture help**: Run `npm run agent:compass-rose`, then ask Copilot

### Copilot reads your instructions automatically
The `.github/copilot-instructions.md` file is read by Copilot Agent Mode automatically. It knows:
- Your island theme (won't suggest cyberpunk code)
- Your performance budget
- The correct patterns (useMemo, dispose, InstancedMesh)
- Which files contain what

---

## DAILY WORKFLOW

```
MORNING (5 min):
  npm run agents              ← See what needs fixing today
  Look at report              ← Prioritize your work

WHILE CODING:
  Copilot suggests → Tab      ← Accept good suggestions
  Copilot wrong?  → Esc       ← Ignore and type yourself
  Stuck?  → Ctrl+Shift+I      ← Ask Copilot chat

AFTER A FEATURE:
  git add . && git commit      ← GitHub Actions runs agents automatically
  Check PR comment             ← Agents post a summary

WEEKLY (Sunday):
  npm run agent:compass-rose  ← Architecture review
  Read the full report         ← What to refactor this week
```

---

## KEYBOARD SHORTCUTS (add to keybindings.json)

```json
[
  {
    "key": "ctrl+shift+a",
    "command": "workbench.action.tasks.runTask",
    "args": "🏝️ ISLEFOLIO: Run All Agents"
  },
  {
    "key": "ctrl+shift+f",
    "command": "workbench.action.tasks.runTask",
    "args": "⛈️ STORM DETECTOR: Bug Fix"
  }
]
```

Add to: `Ctrl+Shift+P` → "Open Keyboard Shortcuts (JSON)"

---

## WATCH MODE (Agents auto-run on save)

```bash
# Terminal 1: Your dev server
npm run dev

# Terminal 2: Agents watch for changes
npm run agents:watch
```

Every time you save a `.ts` or `.tsx` file, agents run automatically after 3 seconds. Errors show in Terminal 2.

---

## TROUBLESHOOTING

### "GROQ_API_KEY not set"
```bash
# Check your .env.local exists
cat .env.local

# Make sure it has the key (no spaces around =)
GROQ_API_KEY=gsk_xxxxx  ✅
GROQ_API_KEY = gsk_xxxxx  ❌  (spaces break it)
```

### "tsx not found"
```bash
npm install --save-dev tsx
# OR
npx tsx scripts/agents/run-agents.ts
```

### "Agent prompt not found"
```bash
# Check agent files exist
ls .antigravity/agents/
# Should show: 00-archipelago-core.md, 01-tide-watcher.md, etc.
```

### "JSON parse failed"
Normal for the first few runs while you have no source files yet.
Once you create `src/lib/islandGenerator.ts`, agents have real code to analyze.

### API rate limit errors
```
Groq: Wait 60 seconds and retry (free tier: 30 req/min)
Gemini: Wait 60 seconds (free tier: 15 req/min)
```
Or get both keys — runner automatically falls back to the other provider.

---

## WHAT THE AGENTS COST

```
Groq free tier:
  14,400 requests/day
  30 requests/minute
  Each agent run = 7 requests
  Daily capacity = 2,057 full agent runs/day
  Cost: $0

Gemini free tier:
  15 requests/minute
  1,000,000 tokens/minute
  Cost: $0

Total cost to run all agents every hour for 30 days: $0
```

---

*ISLEFOLIO Agent Ecosystem — LOCAL Mode Setup Guide*
*For questions: check .antigravity/reports/ first*
