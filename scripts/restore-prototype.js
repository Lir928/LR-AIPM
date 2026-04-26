const fs = require('fs')
const path = require('path')

function rimraf(p) {
  if (!fs.existsSync(p)) return
  fs.rmSync(p, { recursive: true, force: true })
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function usageAndExit() {
  process.stderr.write(
    'Usage: node scripts/restore-prototype.js <projectName> <pageId> [--force] [--prd <docFileName>] [--current]\n'
  )
  process.exit(1)
}

function resolveArgValue(args, key) {
  const idx = args.indexOf(key)
  if (idx < 0) return null
  if (idx + 1 >= args.length) return null
  return args[idx + 1]
}

function getActiveProject(repoRoot) {
  const activePath = path.join(repoRoot, 'active_project.json')
  if (!fs.existsSync(activePath)) return null
  try {
    const data = JSON.parse(fs.readFileSync(activePath, 'utf8'))
    if (data.current) {
      return data.current.replace(/^projects\//, '').split('/')[0]
    }
  } catch (e) {
    // ignore
  }
  return null
}

function appendChangelog(featureBase, entry) {
  const logPath = path.join(featureBase, 'changelog.md')
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19)
  const logLine = `- [${timestamp}] ${entry}\n`
  if (fs.existsSync(logPath)) {
    fs.appendFileSync(logPath, logLine, 'utf8')
  } else {
    fs.writeFileSync(logPath, `# Changelog\n\n${logLine}`, 'utf8')
  }
}

function main() {
  const args = process.argv.slice(2)
  let projectName = args[0]
  const pageId = args[1]
  const force = args.indexOf('--force') >= 0
  const prdName = resolveArgValue(args, '--prd')
  const useCurrent = args.indexOf('--current') >= 0

  if (useCurrent) {
    const repoRoot = path.resolve(__dirname, '..')
    const active = getActiveProject(repoRoot)
    if (!active) {
      throw new Error('No active project. Run: npm run switch <projectName>')
    }
    projectName = active
  }

  if (!projectName || !pageId) usageAndExit()
  if (pageId === 'project-intro') {
    throw new Error('Refuse to restore project-intro (engine entry prototype).')
  }

  const repoRoot = path.resolve(__dirname, '..')
  const projectRoot = path.join(repoRoot, 'projects', projectName)
  const featureBase = path.join(projectRoot, 'features', pageId)
  const metaPath = path.join(featureBase, 'meta.json')

  if (!fs.existsSync(metaPath)) {
    throw new Error('Meta file not found: ' + metaPath)
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
  const axhubMakeRoot = path.join(repoRoot, 'axhub-make')
  const destProtoDir = path.join(axhubMakeRoot, 'src', 'prototypes', pageId)
  const docsDir = path.join(axhubMakeRoot, 'src', 'docs')
  const prdFileName = prdName || meta.prdFileName || pageId + '-PRD.md'
  const destPrdPath = path.join(docsDir, prdFileName)

  if (fs.existsSync(destProtoDir)) {
    const files = fs.readdirSync(destProtoDir)
    if (files.length === 0 || (files.length === 1 && files[0] === '.gitkeep')) {
      // Empty directory, safe to use
    } else if (force) {
      rimraf(destProtoDir)
    } else {
      throw new Error(
        'Prototype already exists in workbench: ' + destProtoDir + '\n' +
        'Use --force to overwrite, or archive the current version first.'
      )
    }
  }

  const sourceDir = path.join(featureBase, 'prototype', 'source')
  if (!fs.existsSync(sourceDir)) {
    throw new Error('Source not found: ' + sourceDir)
  }

  // Copy prototype source to workbench
  fs.cpSync(sourceDir, destProtoDir, { recursive: true })

  // PRD is always kept in sync (bidirectional reference)
  // If workbench PRD exists, skip copy; otherwise copy from archive
  if (meta.prdMoved) {
    const sourcePrdPath = path.join(featureBase, 'prd', 'PRD.md')
    if (!fs.existsSync(sourcePrdPath)) {
      throw new Error('PRD not found in archive: ' + sourcePrdPath)
    }
    if (!fs.existsSync(destPrdPath)) {
      fs.copyFileSync(sourcePrdPath, destPrdPath)
    }
    // If workbench PRD already exists, both are in sync (they were copied during archive)
  }

  // Update meta state
  meta.currentState = 'restored'
  meta.lastWorkflowStep = '09-归档升级（恢复）'
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8')

  // Update pipeline state
  const pipelineStatePath = path.join(repoRoot, '.pipeline-state.json')
  let pipelineState = {}
  try {
    pipelineState = JSON.parse(fs.readFileSync(pipelineStatePath, 'utf8'))
  } catch (e) {
    // ignore
  }
  pipelineState[pageId] = {
    currentState: 'restored',
    projectName: projectName,
    lastUpdated: meta.archivedAt,
    lastStep: '09-归档升级（恢复）'
  }
  fs.writeFileSync(pipelineStatePath, JSON.stringify(pipelineState, null, 2), 'utf8')

  // Write changelog
  appendChangelog(featureBase, 'Restored prototype to workbench')

  process.stdout.write(
    'Restored: ' + pageId + ' -> ' + destProtoDir + '\n' +
    'PRD: ' + (meta.prdMoved ? destPrdPath + ' (synced)' : '(not moved)') + '\n' +
    'Next: npm run dev:axhub-make -> http://localhost:{port}/prototypes/' + pageId + '\n'
  )
}

main()
