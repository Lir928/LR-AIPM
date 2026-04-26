const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

function usageAndExit() {
  process.stderr.write('Usage: node scripts/start-project.js <projectName> [--install]\n')
  process.exit(1)
}

function main() {
  const args = process.argv.slice(2)
  const projectName = args[0]
  const doInstall = args.indexOf('--install') >= 0

  if (!projectName) usageAndExit()

  const repoRoot = path.resolve(__dirname, '..')
  const projectDir = path.join(repoRoot, 'projects', projectName)

  if (!fs.existsSync(projectDir)) {
    process.stderr.write('Error: Project not found: ' + projectDir + '\n')
    const projectsDir = path.join(repoRoot, 'projects')
    if (fs.existsSync(projectsDir)) {
      const projects = fs.readdirSync(projectsDir)
        .filter(name => !name.startsWith('.'))
        .filter(name => fs.statSync(path.join(projectsDir, name)).isDirectory())
      if (projects.length > 0) {
        process.stderr.write('Available projects:\n')
        projects.forEach(name => process.stderr.write('  - ' + name + '\n'))
      }
    }
    process.exit(1)
  }

  const pkgPath = path.join(projectDir, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    process.stderr.write('Error: Project package.json not found: ' + pkgPath + '\n')
    process.stderr.write('Please create a package.json in the project directory.\n')
    process.exit(1)
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  if (!pkg.scripts || !pkg.scripts.dev) {
    process.stderr.write('This project does not have a dev script.\n')
    process.stderr.write('For archived projects, use:\n')
    process.stderr.write('  1. npm run restore:prototype -- ' + projectName + ' <pageId>\n')
    process.stderr.write('  2. npm run dev:axhub-make\n')
    process.exit(0)
  }

  if (doInstall) {
    const r1 = spawnSync('npm', ['install'], { cwd: projectDir, stdio: 'inherit' })
    if (r1.status !== 0) process.exit(r1.status || 1)
  }

  const r2 = spawnSync('npm', ['run', 'dev'], { cwd: projectDir, stdio: 'inherit' })
  process.exit(r2.status || 0)
}

try {
  main()
} catch (e) {
  process.stderr.write(String(e && e.stack ? e.stack : e) + '\n')
  process.exit(1)
}
