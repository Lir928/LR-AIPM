const fs = require('fs')
const path = require('path')

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch (e) {
    return null
  }
}

function listProjects(repoRoot) {
  const projectsDir = path.join(repoRoot, 'projects')
  if (!fs.existsSync(projectsDir)) return []
  return fs.readdirSync(projectsDir)
    .filter(name => !name.startsWith('.'))
    .filter(name => fs.statSync(path.join(projectsDir, name)).isDirectory())
}

function listFeatures(repoRoot, projectName) {
  const featuresDir = path.join(repoRoot, 'projects', projectName, 'features')
  if (!fs.existsSync(featuresDir)) return []
  return fs.readdirSync(featuresDir)
    .filter(name => !name.startsWith('.'))
    .filter(name => fs.statSync(path.join(featuresDir, name)).isDirectory())
}

function getStatusIcon(state) {
  const icons = {
    'new': '🆕',
    'prd': '📄',
    'prototype': '🛠️',
    'review': '🔍',
    'archived': '📦',
    'in-progress': '⏳',
    'unknown': '❓'
  }
  return icons[state] || '❓'
}

function main() {
  const repoRoot = path.resolve(__dirname, '..')
  const pipelineStatePath = path.join(repoRoot, '.pipeline-state.json')
  const pipelineState = readJson(pipelineStatePath) || {}

  const projects = listProjects(repoRoot)

  if (projects.length === 0) {
    console.log('没有找到任何项目。')
    return
  }

  console.log('\n📋 流水线状态总览')
  console.log('========================\n')

  let total = 0
  let archived = 0
  let inProgress = 0

  projects.forEach(project => {
    const features = listFeatures(repoRoot, project)
    if (features.length === 0) return

    console.log(`📁 ${project}`)
    console.log('-'.repeat(40))

    features.forEach(feature => {
      const metaPath = path.join(repoRoot, 'projects', project, 'features', feature, 'meta.json')
      const meta = readJson(metaPath)
      const state = pipelineState[feature]?.currentState || meta?.currentState || 'unknown'

      total++
      if (state === 'archived') archived++
      else inProgress++

      const icon = getStatusIcon(state)
      const lastStep = meta?.lastWorkflowStep || '无记录'
      const archivedAt = meta?.archivedAt || '-'
      const offline = meta?.offline !== undefined ? (meta.offline ? '(离线)' : '(在线)') : ''

      console.log(`  ${icon} ${feature}`)
      console.log(`     状态: ${state} | 最后步骤: ${lastStep} ${offline}`)
      if (archivedAt !== '-') {
        console.log(`     归档时间: ${archivedAt}`)
      }
    })

    console.log('')
  })

  console.log('========================')
  console.log(`总计: ${total} 个页面`)
  console.log(`  📦 已归档: ${archived}`)
  console.log(`  ⏳ 进行中: ${inProgress}`)
  console.log('')
  console.log('状态说明:')
  console.log('  🆕 new        - 新建页面')
  console.log('  📄 prd        - PRD 已生成')
  console.log('  🛠️ prototype   - 原型开发中')
  console.log('  🔍 review     - 代码审查中')
  console.log('  📦 archived   - 已归档')
  console.log('  ❓ unknown    - 未知状态（可能是新创建的页面）')
  console.log('')
}

try {
  main()
} catch (e) {
  console.error('错误: ' + e.message)
  process.exit(1)
}
