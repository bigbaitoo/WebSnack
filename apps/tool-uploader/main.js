// 应用上传工具核心逻辑
import { generateRandomId } from '@shared/utils/common.js'

class AppUploader {
  constructor() {
    this.files = {
      html: null,
      css: null,
      js: null,
      assets: []
    }
    this.githubToken = ''
    this.repoOwner = 'bigbaitoo'
    this.repoName = 'WebSnack'
    this.baseBranch = 'main'

    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    // 文件选择事件
    document.getElementById('htmlFile').addEventListener('change', (e) => {
      this.files.html = e.target.files[0]
      this.updateFilePreview('html', this.files.html)
    })

    document.getElementById('cssFile').addEventListener('change', (e) => {
      this.files.css = e.target.files[0]
      this.updateFilePreview('css', this.files.css)
    })

    document.getElementById('jsFile').addEventListener('change', (e) => {
      this.files.js = e.target.files[0]
      this.updateFilePreview('js', this.files.js)
    })

    document.getElementById('assetFiles').addEventListener('change', (e) => {
      this.files.assets = Array.from(e.target.files)
      this.updateFilePreview('assets', this.files.assets)
    })

    // 预览按钮
    document.getElementById('previewBtn').addEventListener('click', () => {
      this.previewApp()
    })

    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', () => {
      this.uploadAndDeploy()
    })

    // 关闭成功弹窗
    document.getElementById('closeModalBtn').addEventListener('click', () => {
      document.getElementById('successModal').style.display = 'none'
    })
  }

  updateFilePreview(type, file) {
    const previewEl = document.getElementById(`${type}Preview`)
    const fileNameEl = previewEl.querySelector('.file-name')

    if (!file || (Array.isArray(file) && file.length === 0)) {
      fileNameEl.textContent = '未选择文件'
      return
    }

    if (Array.isArray(file)) {
      fileNameEl.textContent = `已选择 ${file.length} 个文件`
    } else {
      fileNameEl.textContent = file.name
    }
  }

  async previewApp() {
    if (!this.files.html) {
      this.showStatus('请先选择 index.html 文件', 'error')
      return
    }

    try {
      // 读取文件内容
      const htmlContent = await this.readFileAsText(this.files.html)
      let cssContent = this.files.css ? await this.readFileAsText(this.files.css) : ''
      let jsContent = this.files.js ? await this.readFileAsText(this.files.js) : ''

      // 注入 CSS 和 JS
      let fullContent = htmlContent

      if (cssContent) {
        const styleTag = `<style>\n${cssContent}\n</style>`
        fullContent = fullContent.replace('</head>', `${styleTag}\n</head>`)
      }

      if (jsContent) {
        const scriptTag = `<script type="module">\n${jsContent}\n</script>`
        fullContent = fullContent.replace('</body>', `${scriptTag}\n</body>`)
      }

      // 显示预览
      const previewFrame = document.getElementById('previewFrame')
      const blob = new Blob([fullContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      previewFrame.src = url

      document.getElementById('previewSection').style.display = 'block'
      this.showStatus('预览生成成功', 'success')
    } catch (error) {
      console.error('预览生成失败:', error)
      this.showStatus('预览生成失败: ' + error.message, 'error')
    }
  }

  async uploadAndDeploy() {
    // 验证表单
    const formData = this.validateForm()
    if (!formData) return

    this.githubToken = document.getElementById('githubToken').value.trim()
    if (!this.githubToken) {
      this.showStatus('请输入 GitHub Token', 'error')
      return
    }

    try {
      this.showProgress('正在准备文件...', 10)

      // 生成应用目录名
      const appDirName = this.generateAppDirName(formData.appType, formData.appName)

      // 读取所有文件内容
      this.showProgress('正在读取文件...', 20)
      const filesToCommit = await this.prepareFiles(formData, appDirName)

      // 获取最新的 commit SHA
      this.showProgress('正在获取仓库信息...', 30)
      const latestCommitSha = await this.getLatestCommitSha()

      // 创建新的 tree
      this.showProgress('正在创建文件树...', 50)
      const treeSha = await this.createTree(filesToCommit, latestCommitSha)

      // 创建新的 commit
      this.showProgress('正在提交文件...', 70)
      const newCommitSha = await this.createCommit(
        `feat: 添加新应用 ${formData.appName}`,
        treeSha,
        latestCommitSha
      )

      // 更新分支
      this.showProgress('正在更新仓库...', 90)
      await this.updateBranch(newCommitSha)

      // 更新首页导航
      this.showProgress('正在更新首页导航...', 95)
      await this.updateHomePageNavigation(formData, appDirName)

      this.hideProgress()
      this.showSuccess(appDirName)

    } catch (error) {
      console.error('部署失败:', error)
      this.hideProgress()
      this.showStatus('部署失败: ' + error.message, 'error')
    }
  }

  validateForm() {
    const appType = document.getElementById('appType').value
    const appName = document.getElementById('appName').value.trim()
    const appDescription = document.getElementById('appDescription').value.trim()
    const appIcon = document.getElementById('appIcon').value

    if (!appType || !appName || !appDescription || !appIcon || !this.files.html) {
      this.showStatus('请填写所有必填项', 'error')
      return null
    }

    return { appType, appName, appDescription, appIcon }
  }

  generateAppDirName(type, name) {
    // 转换为 kebab-case
    const kebabName = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    return `${type}-${kebabName}`
  }

  async prepareFiles(formData, appDirName) {
    const files = []

    // 读取 HTML 文件
    let htmlContent = await this.readFileAsText(this.files.html)

    // 注入返回首页链接和公共样式
    const headInject = `
      <link rel="stylesheet" href="../../shared/styles/global.css">
    `
    const bodyInject = `
      <div style="padding: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <a href="../../index.html" style="color: white; text-decoration: none; padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); border-radius: 8px;">← 返回首页</a>
      </div>
    `

    htmlContent = htmlContent.replace('</head>', `${headInject}\n</head>`)
    htmlContent = htmlContent.replace('<body>', `<body>\n${bodyInject}`)

    files.push({
      path: `apps/${appDirName}/index.html`,
      content: btoa(unescape(encodeURIComponent(htmlContent)))
    })

    // CSS 文件
    if (this.files.css) {
      const cssContent = await this.readFileAsText(this.files.css)
      files.push({
        path: `apps/${appDirName}/style.css`,
        content: btoa(unescape(encodeURIComponent(cssContent)))
      })

      // 在 HTML 中引入 CSS
      const cssLink = `<link rel="stylesheet" href="./style.css">`
      files[0].content = btoa(unescape(encodeURIComponent(
        htmlContent.replace('</head>', `${cssLink}\n</head>`)
      )))
    }

    // JS 文件
    if (this.files.js) {
      const jsContent = await this.readFileAsText(this.files.js)
      files.push({
        path: `apps/${appDirName}/main.js`,
        content: btoa(unescape(encodeURIComponent(jsContent)))
      })

      // 在 HTML 中引入 JS
      const jsScript = `<script type="module" src="./main.js"></script>`
      const updatedHtml = atob(files[0].content)
      files[0].content = btoa(unescape(encodeURIComponent(
        updatedHtml.replace('</body>', `${jsScript}\n</body>`)
      )))
    }

    // 资源文件
    if (this.files.assets.length > 0) {
      for (const asset of this.files.assets) {
        const content = await this.readFileAsBase64(asset)
        files.push({
          path: `apps/${appDirName}/assets/${asset.name}`,
          content: content.split(',')[1] // 去掉 data:image/png;base64, 前缀
        })
      }
    }

    return files
  }

  async updateHomePageNavigation(formData, appDirName) {
    try {
      // 获取当前首页内容
      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/index.html?ref=${this.baseBranch}`, {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (!response.ok) throw new Error('获取首页内容失败')

      const data = await response.json()
      const currentContent = decodeURIComponent(escape(atob(data.content)))

      // 找到对应的分类部分，添加新的应用链接
      const categoryMap = {
        'game': '🎮 小游戏',
        'tool': '🛠️ 工具集',
        'app': '📱 实用应用'
      }

      const categoryTitle = categoryMap[formData.appType]
      const newAppLink = `
          <a href="apps/${appDirName}/index.html" class="app-card">
            <div class="app-icon">${formData.appIcon}</div>
            <div class="app-info">
              <h3>${formData.appName}</h3>
              <p>${formData.appDescription}</p>
            </div>
          </a>`

      // 插入到对应分类的 app-grid 中
      const categoryPattern = new RegExp(`(<section class="category">[\\s\\S]*?<h2>${categoryTitle}</h2>[\\s\\S]*?<div class="app-grid">)`)
      const updatedContent = currentContent.replace(categoryPattern, `$1${newAppLink}`)

      // 提交更新
      const latestCommitSha = await this.getLatestCommitSha()
      const treeSha = await this.createTree([{
        path: 'index.html',
        content: btoa(unescape(encodeURIComponent(updatedContent)))
      }], latestCommitSha)

      const newCommitSha = await this.createCommit(
        `feat: 添加 ${formData.appName} 到首页导航`,
        treeSha,
        latestCommitSha
      )

      await this.updateBranch(newCommitSha)

    } catch (error) {
      console.warn('更新首页导航失败:', error)
      // 导航更新失败不影响主流程，只显示警告
    }
  }

  // GitHub API 方法
  async getLatestCommitSha() {
    const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/refs/heads/${this.baseBranch}`, {
      headers: {
        'Authorization': `token ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) throw new Error('获取最新 commit 失败')

    const data = await response.json()
    return data.object.sha
  }

  async createTree(files, baseTreeSha) {
    const tree = files.map(file => ({
      path: file.path,
      mode: '100644',
      type: 'blob',
      content: file.content
    }))

    const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: tree
      })
    })

    if (!response.ok) throw new Error('创建文件树失败')

    const data = await response.json()
    return data.sha
  }

  async createCommit(message, treeSha, parentSha) {
    const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/commits`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        tree: treeSha,
        parents: [parentSha]
      })
    })

    if (!response.ok) throw new Error('创建 commit 失败')

    const data = await response.json()
    return data.sha
  }

  async updateBranch(commitSha) {
    const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/refs/heads/${this.baseBranch}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sha: commitSha,
        force: false
      })
    })

    if (!response.ok) throw new Error('更新分支失败')
  }

  // 工具方法
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  showStatus(message, type = 'success') {
    const statusEl = document.getElementById('statusMessage')
    statusEl.textContent = message
    statusEl.className = `status-message ${type}`
    statusEl.style.display = 'block'

    if (type === 'success') {
      setTimeout(() => {
        statusEl.style.display = 'none'
      }, 3000)
    }
  }

  showProgress(message, progress) {
    document.getElementById('progressOverlay').style.display = 'flex'
    document.getElementById('progressText').textContent = message
    document.getElementById('progressFill').style.width = `${progress}%`
  }

  hideProgress() {
    document.getElementById('progressOverlay').style.display = 'none'
  }

  showSuccess(appDirName) {
    const appUrl = `https://${this.repoOwner}.github.io/${this.repoName}/apps/${appDirName}/index.html`
    document.getElementById('appLink').href = appUrl
    document.getElementById('successModal').style.display = 'flex'
  }
}

// 初始化上传工具
const uploader = new AppUploader()

console.log('应用上传工具已加载 📤')
console.log('填写表单上传你的 HTML 应用，自动部署到 GitHub Pages！')
