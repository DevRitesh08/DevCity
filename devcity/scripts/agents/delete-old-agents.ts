#!/usr/bin/env tsx
/**
 * Deletes old/obsolete agent prompt files from .antigravity/agents/
 * Run: npm run agents:delete-old
 */

import * as fs from 'fs'
import * as path from 'path'

const ROOT = path.resolve(process.cwd())
const AGENTS_DIR = path.join(ROOT, '.antigravity/agents')
const REPORTS_DIR = path.join(ROOT, '.antigravity/reports')

// Current valid agent IDs
const CURRENT_AGENTS = new Set([
  '00-archipelago-core',
  '01-tide-watcher',
  '02-wave-rider',
  '03-terrain-keeper',
  '04-storm-detector',
  '05-compass-rose',
  '06-cartographer-ai',
])

function deleteOldAgents(): void {
  console.log('\n🧹 Cleaning up old agent files...\n')

  // Clean old agent prompts
  if (fs.existsSync(AGENTS_DIR)) {
    const files = fs.readdirSync(AGENTS_DIR)
    let deleted = 0

    for (const file of files) {
      const id = file.replace(/\.md$/, '')
      if (!CURRENT_AGENTS.has(id)) {
        const fullPath = path.join(AGENTS_DIR, file)
        fs.unlinkSync(fullPath)
        console.log(`  🗑️  Deleted agent: ${file}`)
        deleted++
      }
    }

    if (deleted === 0) {
      console.log('  ✅ No old agent files to delete')
    } else {
      console.log(`\n  Removed ${deleted} old agent file(s)`)
    }
  } else {
    console.log('  📁 No .antigravity/agents/ directory found — nothing to clean')
  }

  // Clean old reports (older than 30 days)
  if (fs.existsSync(REPORTS_DIR)) {
    const files = fs.readdirSync(REPORTS_DIR)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    let deletedReports = 0

    for (const file of files) {
      const fullPath = path.join(REPORTS_DIR, file)
      const stat = fs.statSync(fullPath)
      if (stat.mtimeMs < thirtyDaysAgo) {
        fs.unlinkSync(fullPath)
        console.log(`  🗑️  Deleted old report: ${file}`)
        deletedReports++
      }
    }

    if (deletedReports > 0) {
      console.log(`\n  Removed ${deletedReports} old report(s)`)
    }
  }

  console.log('\n✅ Cleanup complete\n')
}

deleteOldAgents()
