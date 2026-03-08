#!/usr/bin/env tsx
/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║     🏝️  ISLEFOLIO — LOCAL AGENT RUNNER v3.0             ║
 * ║     Powered by: Groq API (free) — no credit card        ║
 * ║     Fallback:   Gemini API (free tier)                   ║
 * ║     Run:        npm run agents                           ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * HOW TO GET YOUR FREE API KEY (2 minutes):
 * 1. Go to console.groq.com
 * 2. Sign in with GitHub
 * 3. API Keys → Create API key → copy it
 * 4. Add to .env.local: GROQ_API_KEY=your_key_here
 * 5. Run: npm run agents
 *
 * That's it. No credit card. No billing. 14,400 requests/day free.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const ROOT         = path.resolve(process.cwd())
const AGENTS_DIR   = path.join(ROOT, '.antigravity/agents')
const REPORTS_DIR  = path.join(ROOT, '.antigravity/reports')
const MEMORY_DIR   = path.join(ROOT, '.antigravity/memory')
const BACKUPS_DIR  = path.join(ROOT, '.antigravity/backups')
const TIMESTAMP    = new Date().toISOString().slice(0,16).replace('T','-').replace(':','')

// Agent model routing — Groq is fastest, use Pro models for complex agents
const MODEL_MAP: Record<string, { provider: 'groq'|'gemini', model: string }> = {
  '01-tide-watcher':    { provider: 'groq',   model: 'llama-3.3-70b-versatile' },
  '04-storm-detector':  { provider: 'groq',   model: 'llama-3.3-70b-versatile' },
  '02-wave-rider':      { provider: 'groq',   model: 'llama-3.3-70b-versatile' },
  '03-terrain-keeper':  { provider: 'groq',   model: 'llama-3.3-70b-versatile' },
  '05-compass-rose':    { provider: 'gemini', model: 'gemini-2.0-flash'         }, // needs long context
  '06-cartographer-ai': { provider: 'gemini', model: 'gemini-2.0-flash'         }, // reads all reports
  '00-archipelago-core':{ provider: 'gemini', model: 'gemini-2.0-flash'         }, // master synthesis
}

// ─── UTILS ────────────────────────────────────────────────────────────────────

function readFile(p: string): string | null {
  try { return fs.readFileSync(p, 'utf-8') } catch { return null }
}

function writeFile(p: string, content: string): void {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf-8')
}

function cleanJSON(raw: string): string {
  return raw
    .replace(/^```json\n?/, '').replace(/^```\n?/, '')
    .replace(/\n?```$/, '').trim()
}

function ensureDirs() {
  [REPORTS_DIR, MEMORY_DIR, BACKUPS_DIR].forEach(d =>
    fs.mkdirSync(d, { recursive: true })
  )
}

// ─── CODEBASE SNAPSHOT ────────────────────────────────────────────────────────

function buildSnapshot(): string {
  const KEY_FILES = [
    'src/lib/islandGenerator.ts',
    'src/lib/terrainNoise.ts',
    'src/lib/gameLoop.ts',
    'src/lib/githubClient.ts',
    'src/components/island/IslandCanvas.tsx',
    'src/components/island/IslandTerrain.tsx',
    'src/components/island/IslandStructures.tsx',
    'src/components/island/OceanSurface.tsx',
    'src/components/portfolio/TownHall.tsx',
    'src/stores/islandStore.ts',
    'package.json',
  ]

  const lines: string[] = ['# CODEBASE SNAPSHOT — ISLEFOLIO\n']
  for (const f of KEY_FILES) {
    const content = readFile(path.join(ROOT, f))
    lines.push(content
      ? `## FILE: ${f}\n\`\`\`typescript\n${content}\n\`\`\``
      : `## FILE: ${f}\n[NOT CREATED YET — skip file-specific checks for this file]`
    )
  }

  // Add any extra .ts/.tsx files not in the key list
  try {
    const extra = getAllSourceFiles(path.join(ROOT, 'src'))
      .map(f => path.relative(ROOT, f))
      .filter(f => !KEY_FILES.includes(f))
    if (extra.length > 0) {
      lines.push(`## OTHER SOURCE FILES (names only)\n${extra.join('\n')}`)
    }
  } catch {}

  return lines.join('\n\n')
}

function getAllSourceFiles(dir: string): string[] {
  const files: string[] = []
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory() && !['node_modules', '.next', 'dist', '.git'].includes(entry.name)) {
        files.push(...getAllSourceFiles(full))
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        files.push(full)
      }
    }
  } catch {}
  return files
}

// ─── API CLIENTS ──────────────────────────────────────────────────────────────

async function callGroq(systemPrompt: string, userMessage: string, model: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not set in .env.local')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0.1,  // Low temperature for consistent JSON output
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Groq API error ${response.status}: ${error}`)
  }

  const data = await response.json() as any
  return data.choices[0]?.message?.content ?? ''
}

async function callGemini(prompt: string, model: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in .env.local')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${error}`)
  }

  const data = await response.json() as any
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

// ─── AGENT RUNNER ─────────────────────────────────────────────────────────────

async function runAgent(
  agentId: string,
  codebaseSnapshot: string,
  previousReports: string,
): Promise<{ report: string; parsed: any; autoFixes: string[] }> {

  const agentPrompt = readFile(path.join(AGENTS_DIR, `${agentId}.md`))
  if (!agentPrompt) {
    console.log(`  ⚠️  Skipping ${agentId} — prompt file not found`)
    return { report: '{}', parsed: {}, autoFixes: [] }
  }

  const memory = readFile(path.join(MEMORY_DIR, 'ecosystem-state.json')) ?? '{}'
  const { provider, model } = MODEL_MAP[agentId] ?? { provider: 'groq', model: 'llama-3.3-70b-versatile' }

  const systemContext = `
${agentPrompt}

## CRITICAL OUTPUT RULES
1. Return ONLY valid JSON matching your OUTPUT FORMAT
2. No markdown code blocks, no explanation, no preamble
3. Raw JSON only — starts with { and ends with }
4. Include specific file paths and line numbers when available
5. If a file is marked [NOT CREATED YET] — skip file-specific checks for it

## ECOSYSTEM MEMORY (your previous learning)
${memory}

## PREVIOUS AGENTS THIS RUN
${previousReports || 'None yet — you are the first agent this run.'}
`

  const userMessage = `Here is the current ISLEFOLIO codebase. Run your full inspection and return only valid JSON.\n\n${codebaseSnapshot}`

  let rawOutput = ''

  try {
    if (provider === 'groq') {
      rawOutput = await callGroq(systemContext, userMessage, model)
    } else {
      // Gemini: combine system + user into single prompt
      rawOutput = await callGemini(`${systemContext}\n\n${userMessage}`, model)
    }
  } catch (err: any) {
    // Fallback: if primary provider fails, try the other
    console.log(`  ⚠️  ${provider} failed, trying fallback...`)
    try {
      if (provider === 'groq' && process.env.GEMINI_API_KEY) {
        rawOutput = await callGemini(`${systemContext}\n\n${userMessage}`, 'gemini-2.0-flash')
      } else if (process.env.GROQ_API_KEY) {
        rawOutput = await callGroq(systemContext, userMessage, 'llama-3.3-70b-versatile')
      } else {
        throw err
      }
    } catch (fallbackErr: any) {
      console.error(`  ❌ Both providers failed: ${fallbackErr.message}`)
      return { report: '{}', parsed: {}, autoFixes: [] }
    }
  }

  const cleanOutput = cleanJSON(rawOutput)

  // Save report
  const reportPath = path.join(REPORTS_DIR, `${agentId}-${TIMESTAMP}.json`)
  writeFile(reportPath, cleanOutput)
  console.log(`  ✅ Saved: .antigravity/reports/${agentId}-${TIMESTAMP}.json`)

  let parsed: any = {}
  try {
    parsed = JSON.parse(cleanOutput)
  } catch {
    parsed = { raw_output: cleanOutput, parse_error: true }
    console.log(`  ⚠️  JSON parse failed — saved raw output for review`)
  }

  // Handle auto-fixes from STORM DETECTOR
  const autoFixes: string[] = []
  if (agentId === '04-storm-detector' && Array.isArray(parsed.issues)) {
    for (const issue of parsed.issues) {
      if (issue.action_taken === 'AUTO_FIXED' && issue.confidence >= 0.95) {
        const applied = await applyAutoFix(issue)
        if (applied) autoFixes.push(issue.id)
      }
    }
  }

  return { report: cleanOutput, parsed, autoFixes }
}

// ─── AUTO-FIX ENGINE ──────────────────────────────────────────────────────────

async function applyAutoFix(issue: any): Promise<boolean> {
  if (!issue.file || !issue.original_code || !issue.fixed_code) return false

  const filePath = path.join(ROOT, issue.file)
  const content  = readFile(filePath)
  if (!content) return false

  if (!content.includes(issue.original_code)) {
    console.log(`  ⚠️  Auto-fix ${issue.id}: original code not found in file (may have changed)`)
    return false
  }

  // Backup before touching
  const backupPath = path.join(BACKUPS_DIR, `${path.basename(issue.file)}.${TIMESTAMP}`)
  if (!fs.existsSync(backupPath)) {
    writeFile(backupPath, content)
  }

  const fixed = content.replace(
    issue.original_code,
    `${issue.fixed_code} // [STORM DETECTOR ${issue.id} — ${new Date().toLocaleDateString()}]`
  )
  writeFile(filePath, fixed)
  console.log(`  🔧 AUTO-FIX ${issue.id}: ${issue.file}`)
  return true
}

// ─── INTERACTIVE FIX CONFIRMATION ─────────────────────────────────────────────

async function confirmPendingFixes(stormReport: any): Promise<void> {
  if (!stormReport?.issues) return

  const pending = stormReport.issues.filter(
    (i: any) => i.action_taken === 'PROPOSED' && i.confidence >= 0.80
  )
  if (pending.length === 0) return

  console.log('\n\n🔧 STORM DETECTOR — Fixes Awaiting Your Confirmation:\n')

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q: string) => new Promise<string>(res => rl.question(q, res))

  for (const fix of pending) {
    console.log('\n' + '─'.repeat(60))
    console.log(`📍 ${fix.id}  |  Confidence: ${Math.round(fix.confidence * 100)}%`)
    console.log(`📁 ${fix.file}:${fix.line ?? '?'}`)
    console.log(`❌ BEFORE: ${fix.original_code}`)
    console.log(`✅ AFTER:  ${fix.fixed_code}`)
    console.log(`💬 Why:    ${fix.explanation}`)

    const ans = await ask('\nApply? [y/n/q to quit all]: ')
    if (ans.toLowerCase() === 'q') break
    if (ans.toLowerCase() === 'y') {
      const ok = await applyAutoFix(fix)
      console.log(ok ? '  ✅ Applied' : '  ⚠️  Could not apply (code may have changed)')
    } else {
      console.log('  ⏭️  Skipped')
    }
  }

  rl.close()
}

// ─── UPDATE ECOSYSTEM MEMORY ──────────────────────────────────────────────────

function updateEcosystemMemory(allParsed: any[]): void {
  const statePath = path.join(MEMORY_DIR, 'ecosystem-state.json')
  let state: any = {}
  try { state = JSON.parse(readFile(statePath) ?? '{}') } catch {}

  // Get health score from core agent
  const core  = allParsed.find(r => r?.agent === 'ARCHIPELAGO_CORE')
  const score = core?.codebase_health?.score

  if (score !== undefined) {
    state.codebase_health_history = state.codebase_health_history ?? []
    state.codebase_health_history.push({
      date: new Date().toISOString().slice(0, 10),
      score,
    })
    // Keep last 90 days
    if (state.codebase_health_history.length > 90) {
      state.codebase_health_history = state.codebase_health_history.slice(-90)
    }
  }

  state.last_updated = new Date().toISOString()
  writeFile(statePath, JSON.stringify(state, null, 2))
}

// ─── PRINT SUMMARY ────────────────────────────────────────────────────────────

function printSummary(results: { agentId: string; parsed: any; autoFixes: string[] }[], startMs: number): void {
  let totalIssues  = 0
  let criticalCount = 0
  let autoFixed     = 0

  console.log('\n\n╔══════════════════════════════════════════════════════════╗')
  console.log('║               🏝️  ISLEFOLIO AGENT REPORT                 ║')
  console.log('╠══════════════════════════════════════════════════════════╣')

  for (const { agentId, parsed, autoFixes } of results) {
    const issues   = parsed?.issues ?? []
    const critical = issues.filter((i: any) =>
      ['CRITICAL', 'CRASH'].includes(i.severity)
    ).length

    totalIssues  += issues.length
    criticalCount += critical
    autoFixed     += autoFixes.length

    const name    = agentId.replace(/^\d+-/, '').replace(/-/g, ' ').toUpperCase()
    const issueStr = issues.length > 0 ? `${issues.length} issues` : 'clean'
    const critStr  = critical > 0 ? ` ⚠️  ${critical} CRITICAL` : ''
    const fixStr   = autoFixes.length > 0 ? ` 🔧 ${autoFixes.length} fixed` : ''
    const score    = parsed?.performance_score ?? parsed?.generation_stability_score
                     ?? parsed?.architecture_score ?? parsed?.code_quality_score
                     ?? parsed?.codebase_health?.score ?? null

    const scoreStr = score !== null ? ` [${score}/100]` : ''
    console.log(`║  ${name.padEnd(22)} ${issueStr}${critStr}${fixStr}${scoreStr}`.padEnd(60) + '║')
  }

  console.log('╠══════════════════════════════════════════════════════════╣')
  console.log(`║  Total: ${totalIssues} issues  |  ${criticalCount} critical  |  ${autoFixed} auto-fixed`.padEnd(60) + '║')
  console.log(`║  Time: ${((Date.now() - startMs) / 1000).toFixed(1)}s  |  Reports: .antigravity/reports/`.padEnd(60) + '║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  if (criticalCount > 0) {
    console.log('⛔  CRITICAL ISSUES FOUND — fix before next feature!\n')
    process.exit(1)
  } else {
    console.log('✅  All clear — no critical issues\n')
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  ensureDirs()

  // Check at least one API key is available
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
    console.error('\n❌  No API key found!\n')
    console.error('   Get a FREE Groq key (30 seconds):')
    console.error('   1. Go to console.groq.com')
    console.error('   2. Sign in → API Keys → Create')
    console.error('   3. Add to .env.local:  GROQ_API_KEY=your_key\n')
    console.error('   OR get a free Gemini key:')
    console.error('   1. Go to aistudio.google.com/apikey')
    console.error('   2. Create API key')
    console.error('   3. Add to .env.local:  GEMINI_API_KEY=your_key\n')
    process.exit(1)
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗')
  console.log('║       🏝️  ISLEFOLIO — AGENT ECOSYSTEM STARTING           ║')
  console.log('║       Mode: LOCAL  |  Provider: Groq + Gemini            ║')
  console.log('╚══════════════════════════════════════════════════════════╝')

  const startMs = Date.now()

  console.log('\n📦 Reading codebase...')
  const snapshot = buildSnapshot()

  // Agents run in this exact order — each sees previous results
  const AGENT_ORDER = [
    '01-tide-watcher',
    '04-storm-detector',
    '02-wave-rider',
    '03-terrain-keeper',
    '05-compass-rose',
    '06-cartographer-ai',
    '00-archipelago-core',
  ]

  const results:  { agentId: string; parsed: any; autoFixes: string[] }[] = []
  const reports:  string[] = []

  for (const agentId of AGENT_ORDER) {
    const name = agentId.replace(/^\d+-/, '').replace(/-/g, ' ').toUpperCase()
    console.log(`\n🌊  Running ${name}...`)

    const { report, parsed, autoFixes } = await runAgent(
      agentId,
      snapshot,
      reports.join('\n\n---\n\n'),
    )

    results.push({ agentId, parsed, autoFixes })
    if (report !== '{}') reports.push(report)

    // Rate limiting — Groq is fast but be respectful
    await new Promise(r => setTimeout(r, 1500))
  }

  // Interactive confirmation for medium-confidence fixes
  const stormResult = results.find(r => r.agentId === '04-storm-detector')
  if (stormResult) await confirmPendingFixes(stormResult.parsed)

  // Update living memory
  updateEcosystemMemory(results.map(r => r.parsed))

  printSummary(results, startMs)
}

main().catch(err => {
  console.error('Agent runner crashed:', err)
  process.exit(1)
})
