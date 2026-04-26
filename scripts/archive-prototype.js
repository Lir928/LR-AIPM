const fs = require('fs')
const path = require('path')
const http = require('http')
const { spawnSync } = require('child_process')

function pad2(n) {
  return String(n).padStart(2, '0')
}

function nowStamp() {
  const d = new Date()
  const y = String(d.getFullYear())
  const m = pad2(d.getMonth() + 1)
  const day = pad2(d.getDate())
  const hh = pad2(d.getHours())
  const mm = pad2(d.getMinutes())
  const ss = pad2(d.getSeconds())
  return y + m + day + '-' + hh + mm + ss
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8')
}

function rimraf(p) {
  if (!fs.existsSync(p)) return
  fs.rmSync(p, { recursive: true, force: true })
}

function appendChangelog(featureBase, entry) {
  const logPath = path.join(featureBase, 'changelog.md')
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19)
  const logLine = `- [${timestamp}] ${entry}\n`
  if (fs.existsSync(logPath)) {
    fs.appendFileSync(logPath, logLine, 'utf8')
  } else {
    fs.writeFileSync(logPath, `# ${entry.split(' ')[0]} Changelog\n\n${logLine}`, 'utf8')
  }
}

function downloadToFile(url, destPath) {
  return new Promise(function (resolve, reject) {
    const req = http.get(url, function (res) {
      if (res.statusCode !== 200) {
        const chunks = []
        res.on('data', function (c) {
          chunks.push(c)
        })
        res.on('end', function () {
          reject(
            new Error(
              'Download failed: ' +
                res.statusCode +
                ' ' +
                (Buffer.concat(chunks).toString('utf8') || '')
            )
          )
        })
        return
      }
      ensureDir(path.dirname(destPath))
      const ws = fs.createWriteStream(destPath)
      res.pipe(ws)
      ws.on('finish', function () {
        ws.close(function () {
          resolve()
        })
      })
      ws.on('error', function (e) {
        reject(e)
      })
    })
    req.on('error', reject)
  })
}

function extractZip(zipPath, destDir) {
  rimraf(destDir)
  ensureDir(destDir)

  const r2 = spawnSync('unzip', ['-q', zipPath, '-d', destDir], {
    stdio: 'inherit'
  })
  if (!r2.error && r2.status === 0) return

  const r3 = spawnSync('tar', ['-xf', zipPath, '-C', destDir], {
    stdio: 'inherit'
  })
  if (!r3.error && r3.status === 0) return

  throw new Error('Extract zip failed: ' + zipPath + ' (tried unzip, tar)')
}

function usageAndExit() {
  process.stderr.write(
    'Usage: node scripts/archive-prototype.js <projectName> <pageId> [--keep-source] [--offline] [--no-prd] [--prd <docFileName>]\n' +
    '\n' +
    'Options:\n' +
    '  --keep-source  Keep source in workbench after archiving\n' +
    '  --offline      Archive without downloading HTML export (offline mode)\n' +
    '  --no-prd       Do not move PRD to archive (keep in workbench)\n' +
    '  --prd <name>   Specify PRD file name (default: <pageId>-PRD.md)\n' +
    '  --current      Use active project from active_project.json\n'
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

async function main() {
  const args = process.argv.slice(2)
  let projectName = args[0]
  const pageId = args[1]
  const keepSource = args.indexOf('--keep-source') >= 0
  const offline = args.indexOf('--offline') >= 0
  const noPrd = args.indexOf('--no-prd') >= 0
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
    throw new Error('Refuse to archive project-intro (engine entry prototype).')
  }

  const repoRoot = path.resolve(__dirname, '..')
  const axhubMakeRoot = path.join(repoRoot, 'axhub-make')
  const devInfoPath = path.join(axhubMakeRoot, '.axhub', 'make', '.dev-server-info.json')
  const sourceProtoDir = path.join(axhubMakeRoot, 'src', 'prototypes', pageId)
  const docsDir = path.join(axhubMakeRoot, 'src', 'docs')
  const prdFileName = prdName || pageId + '-PRD.md'
  const sourcePrdPath = path.join(docsDir, prdFileName)

  if (!fs.existsSync(sourceProtoDir)) {
    throw new Error('Prototype not found: ' + sourceProtoDir)
  }

  const projectRoot = path.join(repoRoot, 'projects', projectName)
  const featureBase = path.join(projectRoot, 'features', pageId)
  const destPrototypeBase = path.join(featureBase, 'prototype')
  const destSource = path.join(destPrototypeBase, 'source')
  const destZipDir = path.join(destPrototypeBase, 'export', 'zip')
  const destHtmlDir = path.join(destPrototypeBase, 'export', 'html')
  const destPrdDir = path.join(featureBase, 'prd')
  const destPrdPath = path.join(destPrdDir, 'PRD.md')

  // Validate PRD exists before making any changes
  if (!noPrd) {
    if (!fs.existsSync(sourcePrdPath)) {
      throw new Error(
        'PRD not found: ' +
          sourcePrdPath +
          '\nExpected workbench PRD at axhub-make/src/docs/<pageId>-PRD.md (or pass --prd <docFileName> or --no-prd).'
      )
    }
  }

  // Prepare directories - use temp directory for atomic operation
  const tempFeatureBase = featureBase + '.__archiving__'
  if (fs.existsSync(tempFeatureBase)) {
    rimraf(tempFeatureBase)
  }
  const tempDestPrototypeBase = path.join(tempFeatureBase, 'prototype')
  const tempDestSource = path.join(tempDestPrototypeBase, 'source')
  const tempDestZipDir = path.join(tempDestPrototypeBase, 'export', 'zip')
  const tempDestHtmlDir = path.join(tempDestPrototypeBase, 'export', 'html')
  const tempDestPrdDir = path.join(tempFeatureBase, 'prd')
  const tempDestPrdPath = path.join(tempDestPrdDir, 'PRD.md')

  ensureDir(tempDestSource)
  ensureDir(tempDestZipDir)
  ensureDir(tempDestPrdDir)

  // Copy prototype source to temp
  rimraf(tempDestSource)
  fs.cpSync(sourceProtoDir, tempDestSource, { recursive: true })

  if (!noPrd) {
    fs.copyFileSync(sourcePrdPath, tempDestPrdPath)
  }

  const stamp = nowStamp()
  const meta = {
    project: projectName,
    pageId: pageId,
    archivedAt: stamp,
    exportPath: 'prototypes/' + pageId,
    prdMoved: !noPrd,
    prdFileName: prdFileName,
    currentState: 'archived',
    lastWorkflowStep: '09-归档升级',
    lastArchivedAt: stamp,
    offline: false
  }

  if (!offline) {
    if (!fs.existsSync(devInfoPath)) {
      rimraf(tempFeatureBase)
      throw new Error(
        'Dev server info not found: ' +
          devInfoPath +
          '\nPlease start Axhub Make first (npm run dev:axhub-make), or use --offline for offline archive.'
      )
    }

    const devInfo = readJson(devInfoPath)
    const port = devInfo && devInfo.port
    if (!port) {
      rimraf(tempFeatureBase)
      throw new Error('Invalid dev server info: missing port in ' + devInfoPath)
    }

    const testUrl = 'http://localhost:' + String(port) + '/api/export-html?path=' + encodeURIComponent('prototypes/' + pageId)
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(testUrl, (res) => {
          req.destroy()
          if (res.statusCode === 200 || res.statusCode === 404) {
            resolve()
          } else {
            reject(new Error('Server returned status ' + res.statusCode))
          }
        })
        req.on('error', reject)
        req.setTimeout(3000, () => {
          req.destroy()
          reject(new Error('Connection timeout'))
        })
      })
    } catch (e) {
      rimraf(tempFeatureBase)
      throw new Error(
        'Cannot connect to Axhub Make dev server at port ' + port + '.\n' +
        'Please ensure the server is running: npm run dev:axhub-make\n' +
        'Or use --offline for offline archive.\n' +
        'Original error: ' + e.message
      )
    }

    const zipName = stamp + '-' + pageId + '-html.zip'
    const zipPath = path.join(tempDestZipDir, zipName)
    const exportUrl =
      'http://localhost:' +
      String(port) +
      '/api/export-html?path=' +
      encodeURIComponent('prototypes/' + pageId)

    try {
      await downloadToFile(exportUrl, zipPath)
      extractZip(zipPath, tempDestHtmlDir)
      meta.exportZipFile = zipName
      meta.offline = false
    } catch (e) {
      rimraf(tempFeatureBase)
      throw new Error('Export failed: ' + e.message + '\nArchive rolled back. Workbench unchanged.')
    }
  } else {
    meta.offline = true
    meta.exportZipFile = null
    process.stdout.write('Offline mode: skipping HTML export.\n')
  }

  // Write meta and changelog to temp
  writeJson(path.join(tempFeatureBase, 'meta.json'), meta)
  appendChangelog(tempFeatureBase, 'Archived prototype ' + (offline ? '(offline)' : 'with HTML export'))

  // Atomic: remove old archive and rename temp to final
  if (fs.existsSync(featureBase)) {
    rimraf(featureBase)
  }
  fs.renameSync(tempFeatureBase, featureBase)

  // Only remove workbench source after successful archive
  if (!keepSource) {
    rimraf(sourceProtoDir)
  }

  // Update pipeline state
  const pipelineStatePath = path.join(repoRoot, '.pipeline-state.json')
  let pipelineState = {}
  if (fs.existsSync(pipelineStatePath)) {
    pipelineState = readJson(pipelineStatePath)
  }
  pipelineState[pageId] = {
    currentState: 'archived',
    projectName: projectName,
    lastUpdated: stamp,
    lastStep: '09-归档升级'
  }
  writeJson(pipelineStatePath, pipelineState)

  process.stdout.write('Archived: ' + pageId + ' -> ' + featureBase + (offline ? ' (offline)' : '') + '\n')
}

main().catch(function (e) {
  process.stderr.write(String(e && e.stack ? e.stack : e) + '\n')
  process.exit(1)
})
