const fs = require('fs')
const path = require('path')

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch (e) {
    return null
  }
}

function checkExists(p, label) {
  if (!fs.existsSync(p)) {
    console.log(`  ❌ ${label}: ${p}`)
    return false
  }
  console.log(`  ✅ ${label}`)
  return true
}

function checkFileExists(p, label) {
  try {
    if (!fs.existsSync(p) || !fs.statSync(p).isFile()) {
      console.log(`  ❌ ${label}: ${p}`)
      return false
    }
    console.log(`  ✅ ${label}`)
    return true
  } catch (e) {
    console.log(`  ❌ ${label}: ${p}`)
    return false
  }
}

function checkDirExists(p, label) {
  try {
    if (!fs.existsSync(p) || !fs.statSync(p).isDirectory()) {
      console.log(`  ❌ ${label}: ${p}`)
      return false
    }
    console.log(`  ✅ ${label}`)
    return true
  } catch (e) {
    console.log(`  ❌ ${label}: ${p}`)
    return false
  }
}

function validateFeature(repoRoot, project, feature) {
  const featureDir = path.join(repoRoot, 'projects', project, 'features', feature)
  console.log(`\n🔍 检查 ${project}/${feature}`)
  console.log('-'.repeat(40))

  let errors = 0

  // 检查 meta.json
  if (!checkFileExists(path.join(featureDir, 'meta.json'), 'meta.json')) {
    errors++
  } else {
    const meta = readJson(path.join(featureDir, 'meta.json'))
    if (meta && meta.prdMoved) {
      const prdPath = path.join(featureDir, 'prd', 'PRD.md')
      if (!checkFileExists(prdPath, 'PRD (归档区)')) errors++
    }
  }

  // 检查 prototype/source
  const sourceDir = path.join(featureDir, 'prototype', 'source')
  if (!checkDirExists(sourceDir, 'prototype/source')) {
    errors++
  } else {
    // 检查关键文件
    const indexTsx = path.join(sourceDir, 'index.tsx')
    const styleCss = path.join(sourceDir, 'style.css')
    const specMd = path.join(sourceDir, 'spec.md')
    if (!checkFileExists(indexTsx, 'index.tsx')) errors++
    if (!checkFileExists(styleCss, 'style.css')) errors++
    if (!checkFileExists(specMd, 'spec.md')) errors++
  }

  // 检查 PRD
  const prdDir = path.join(featureDir, 'prd')
  if (checkDirExists(prdDir, 'prd/')) {
    if (!checkFileExists(path.join(prdDir, 'PRD.md'), 'PRD.md')) errors++
  }

  // 检查 Prompt
  const promptsDir = path.join(featureDir, 'prompts')
  if (checkDirExists(promptsDir, 'prompts/')) {
    const prompts = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'))
    if (prompts.length === 0) {
      console.log(`  ⚠️  prompts/ 目录为空`)
    }
  }

  return errors
}

function main() {
  const repoRoot = path.resolve(__dirname, '..')
  let totalErrors = 0

  console.log('🔍 项目验证')
  console.log('========================\n')

  // 检查项目基础设施
  console.log('📋 项目基础设施')
  console.log('-'.repeat(40))
  checkFileExists(path.join(repoRoot, 'package.json'), 'package.json')
  checkFileExists(path.join(repoRoot, 'README.md'), 'README.md')
  checkFileExists(path.join(repoRoot, 'LICENSE'), 'LICENSE')
  checkFileExists(path.join(repoRoot, 'CHANGELOG.md'), 'CHANGELOG.md')
  checkFileExists(path.join(repoRoot, 'CONTRIBUTING.md'), 'CONTRIBUTING.md')
  checkDirExists(path.join(repoRoot, '.github'), '.github/')
  console.log('')

  // 检查脚本
  console.log('📋 核心脚本')
  console.log('-'.repeat(40))
  checkFileExists(path.join(repoRoot, 'scripts/archive-prototype.js'), 'archive-prototype.js')
  checkFileExists(path.join(repoRoot, 'scripts/restore-prototype.js'), 'restore-prototype.js')
  checkFileExists(path.join(repoRoot, 'scripts/switch-project.js'), 'switch-project.js')
  checkFileExists(path.join(repoRoot, 'scripts/start-project.js'), 'start-project.js')
  checkFileExists(path.join(repoRoot, 'scripts/workflow-status.js'), 'workflow-status.js')
  checkFileExists(path.join(repoRoot, 'scripts/validate-project.js'), 'validate-project.js')
  console.log('')

  // 检查 axhub-make
  console.log('📋 Axhub Make 引擎')
  console.log('-'.repeat(40))
  checkDirExists(path.join(repoRoot, 'axhub-make/src/prototypes'), 'prototypes/')
  checkDirExists(path.join(repoRoot, 'axhub-make/src/docs'), 'docs/')
  checkFileExists(path.join(repoRoot, 'axhub-make/package.json'), 'package.json')
  console.log('')

  // 检查 workbench
  console.log('📋 工作台目录')
  console.log('-'.repeat(40))
  checkDirExists(path.join(repoRoot, 'workbench/_incoming'), '_incoming/')
  checkDirExists(path.join(repoRoot, 'workbench/_restore'), '_restore/')
  checkDirExists(path.join(repoRoot, 'workbench/_compare'), '_compare/')
  checkDirExists(path.join(repoRoot, 'workbench/_tmp'), '_tmp/')
  console.log('')

  // 检查所有项目和功能
  const projectsDir = path.join(repoRoot, 'projects')
  if (fs.existsSync(projectsDir)) {
    const projects = fs.readdirSync(projectsDir)
      .filter(name => !name.startsWith('.'))
      .filter(name => fs.statSync(path.join(projectsDir, name)).isDirectory())

    projects.forEach(project => {
      const projectDir = path.join(projectsDir, project)
      const featuresDir = path.join(projectDir, 'features')
      if (!fs.existsSync(featuresDir)) return

      const features = fs.readdirSync(featuresDir)
        .filter(name => !name.startsWith('.'))
        .filter(name => fs.statSync(path.join(featuresDir, name)).isDirectory())

      features.forEach(feature => {
        totalErrors += validateFeature(repoRoot, project, feature)
      })
    })
  }

  // 检查 .skills/index.json
  console.log('\n📋 AI 技能库')
  console.log('-'.repeat(40))
  const skillsIndexPath = path.join(repoRoot, '.skills/index.json')
  if (checkFileExists(skillsIndexPath, '.skills/index.json')) {
    const skillsIndex = readJson(skillsIndexPath)
    if (skillsIndex && skillsIndex.skills) {
      console.log(`  ✅ ${skillsIndex.skills.length} 个技能已索引`)
    }
  }

  // 检查 .workflows
  console.log('\n📋 工作流')
  console.log('-'.repeat(40))
  const workflowsDir = path.join(repoRoot, '.workflows')
  if (checkDirExists(workflowsDir, '.workflows/')) {
    const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.md'))
    console.log(`  ✅ ${workflows.length} 个工作流文件`)
  }

  // 总结
  console.log('\n========================')
  if (totalErrors === 0) {
    console.log('✅ 所有检查通过！')
  } else {
    console.log(`❌ 发现 ${totalErrors} 个问题`)
    console.log('请检查上述标记为 ❌ 的项目')
    process.exit(1)
  }
}

try {
  main()
} catch (e) {
  console.error('验证失败: ' + e.message)
  process.exit(1)
}
