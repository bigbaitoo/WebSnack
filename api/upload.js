// 上传接口 - Vercel 无服务器函数
import { Octokit } from '@octokit/rest'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.REPO_OWNER || 'bigbaitoo'
const REPO_NAME = process.env.REPO_NAME || 'WebSnack'
const BASE_BRANCH = process.env.BASE_BRANCH || 'main'

const octokit = new Octokit({ auth: GITHUB_TOKEN })

export default async function handler(req, res) {
  // 处理 CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { appType, appName, appDescription, appIcon, files } = req.body

    // 验证必填字段
    if (!appType || !appName || !appDescription || !appIcon || !files || !files.html) {
      return res.status(400).json({ error: '缺少必填字段' })
    }

    // 安全检查：验证文件内容
    const htmlContent = files.html.content
    if (htmlContent.includes('PCFET0NUWVBFIGh0bWw+') || htmlContent.includes('base64') || htmlContent.length < 50) {
      return res.status(400).json({ error: 'HTML 文件内容不合法' })
    }

    // 防止恶意脚本
    if (htmlContent.includes('<script') && !htmlContent.includes('type="module"') && !htmlContent.includes('src=')) {
      return res.status(400).json({ error: 'HTML 文件包含不安全的脚本' })
    }

    // 检查是否包含恶意代码特征
    const maliciousPatterns = ['eval(', 'atob(', 'btoa(', 'document.write', 'window.location', 'fetch(', 'XMLHttpRequest']
    for (const pattern of maliciousPatterns) {
      if (htmlContent.includes(pattern)) {
        return res.status(400).json({ error: `HTML 文件包含不安全的代码: ${pattern}` })
      }
    }

    // 生成应用目录名
    const appDirName = generateAppDirName(appType, appName)
    const branchName = `add-app-${appDirName}-${Date.now()}`

    // 1. 获取最新的 base 分支 SHA
    const { data: baseBranch } = await octokit.rest.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${BASE_BRANCH}`
    })
    const baseSha = baseBranch.object.sha

    // 2. 创建新分支
    await octokit.rest.git.createRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: baseSha
    })

    // 3. 准备要提交的文件
    const treeItems = []

    // HTML 文件
    treeItems.push({
      path: `apps/${appDirName}/index.html`,
      mode: '100644',
      type: 'blob',
      content: Buffer.from(files.html.content).toString('base64')
    })

    // CSS 文件
    if (files.css) {
      treeItems.push({
        path: `apps/${appDirName}/style.css`,
        mode: '100644',
        type: 'blob',
        content: Buffer.from(files.css.content).toString('base64')
      })
    }

    // JS 文件
    if (files.js) {
      treeItems.push({
        path: `apps/${appDirName}/main.js`,
        mode: '100644',
        type: 'blob',
        content: Buffer.from(files.js.content).toString('base64')
      })
    }

    // 资源文件
    if (files.assets && files.assets.length > 0) {
      for (const asset of files.assets) {
        treeItems.push({
          path: `apps/${appDirName}/assets/${asset.name}`,
          mode: '100644',
          type: 'blob',
          content: asset.content.split(',')[1] // 去掉 base64 前缀
        })
      }
    }

    // 4. 更新首页导航
    const { data: indexFile } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: 'index.html',
      ref: BASE_BRANCH
    })

    let indexContent = Buffer.from(indexFile.content, 'base64').toString('utf8')

    // 安全检查：确保首页修改只是添加应用，不会破坏原有结构
    const originalAppCount = (indexContent.match(/<a href="apps\//g) || []).length
    indexContent = addAppToNavigation(indexContent, appType, appDirName, appName, appDescription, appIcon)
    const newAppCount = (indexContent.match(/<a href="apps\//g) || []).length

    // 确保只新增了一个应用链接
    if (newAppCount !== originalAppCount + 1) {
      throw new Error('首页内容修改异常，拒绝提交')
    }

    // 确保首页其他结构没有被修改
    if (!indexContent.includes('<title>WebSnack') || !indexContent.includes('🍿 WebSnack') || !indexContent.includes('🎮 小游戏')) {
      throw new Error('首页结构被恶意修改，拒绝提交')
    }

    treeItems.push({
      path: 'index.html',
      mode: '100644',
      type: 'blob',
      content: Buffer.from(indexContent).toString('base64')
    })

    // 5. 创建新的 tree
    const { data: newTree } = await octokit.rest.git.createTree({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      base_tree: baseSha,
      tree: treeItems
    })

    // 6. 创建 commit
    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      message: `feat: 添加新应用 ${appName}`,
      tree: newTree.sha,
      parents: [baseSha]
    })

    // 7. 更新分支
    await octokit.rest.git.updateRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${branchName}`,
      sha: newCommit.sha
    })

    // 8. 创建 Pull Request
    const { data: pr } = await octokit.rest.pulls.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title: `✨ 添加新应用: ${appName}`,
      head: branchName,
      base: BASE_BRANCH,
      body: `## 应用信息
- **名称**: ${appName}
- **分类**: ${appType}
- **描述**: ${appDescription}
- **图标**: ${appIcon}
- **目录**: \`apps/${appDirName}\`

自动生成的 PR，请审核后合并。`
    })

    res.status(200).json({
      success: true,
      message: '应用已提交审核，审核通过后会自动部署',
      prUrl: pr.html_url,
      appUrl: `https://${REPO_OWNER}.github.io/${REPO_NAME}/apps/${appDirName}/`
    })

  } catch (error) {
    console.error('部署失败:', error)
    res.status(500).json({
      error: '部署失败',
      message: error.message
    })
  }
}

// 工具函数
function generateAppDirName(type, name) {
  const kebabName = name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  return `${type}-${kebabName}`
}

function addAppToNavigation(content, appType, appDirName, appName, appDescription, appIcon) {
  const categoryMap = {
    'game': '🎮 小游戏',
    'tool': '🛠️ 工具集',
    'app': '📱 实用应用',
    'ru': '🌍 语言专区'
  }

  const categoryTitle = categoryMap[appType]
  const newAppLink = `
          <a href="apps/${appDirName}/index.html" class="app-card">
            <div class="app-icon">${appIcon}</div>
            <div class="app-info">
              <h3>${appName}</h3>
              <p>${appDescription}</p>
            </div>
          </a>`

  const categoryPattern = new RegExp(`(<section class="category">[\\s\\S]*?<h2>${categoryTitle}</h2>[\\s\\S]*?<div class="app-grid">)`)
  return content.replace(categoryPattern, `$1${newAppLink}`)
}
