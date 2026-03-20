// 应用上传工具核心逻辑 - 本地存储版本
import { generateRandomId } from '@shared/utils/common.js'
import { saveToLocalStorage, getFromLocalStorage } from '@shared/utils/storage.js'

class AppUploader {
  constructor() {
    this.files = {
      html: null,
      css: null,
      js: null,
      assets: []
    }
    this.savedApps = getFromLocalStorage('uploaded_apps', [])

    this.init()
  }

  init() {
    this.bindEvents()
    this.loadSavedApps()
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
      this.saveApp()
    })

    // 导出按钮
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportApp()
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

  async saveApp() {
    // 验证表单
    const formData = this.validateForm()
    if (!formData) return

    try {
      this.showProgress('正在处理文件...', 30)

      // 生成应用信息
      const appId = generateRandomId(8)
      const appDirName = this.generateAppDirName(formData.appType, formData.appName)

      // 读取所有文件内容
      this.showProgress('正在读取文件...', 50)
      const appData = await this.prepareAppData(formData, appId, appDirName)

      // 保存到本地存储
      this.showProgress('正在保存到本地...', 80)
      this.savedApps.push(appData)
      saveToLocalStorage('uploaded_apps', this.savedApps)

      // 更新首页导航（本地）
      this.updateLocalNavigation(appData)

      this.hideProgress()
      this.showSuccess(appData)

    } catch (error) {
      console.error('保存失败:', error)
      this.hideProgress()
      this.showStatus('保存失败: ' + error.message, 'error')
    }
  }

  async exportApp() {
    const formData = this.validateForm()
    if (!formData) return

    try {
      this.showProgress('正在打包应用...', 50)

      // 生成应用文件
      const appId = generateRandomId(8)
      const appDirName = this.generateAppDirName(formData.appType, formData.appName)
      const appData = await this.prepareAppData(formData, appId, appDirName)

      // 创建 ZIP 包（这里简化为导出单个 HTML 文件）
      const fullHtml = appData.files.find(f => f.name === 'index.html').content
      const blob = new Blob([fullHtml], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      // 下载文件
      const a = document.createElement('a')
      a.href = url
      a.download = `${appDirName}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      this.hideProgress()
      this.showStatus('应用导出成功！', 'success')

    } catch (error) {
      console.error('导出失败:', error)
      this.hideProgress()
      this.showStatus('导出失败: ' + error.message, 'error')
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

  async prepareAppData(formData, appId, appDirName) {
    const files = []

    // 读取 HTML 文件
    let htmlContent = await this.readFileAsText(this.files.html)

    // 注入返回首页链接和公共样式
    const headInject = `
      <link rel="stylesheet" href="../../shared/styles/global.css">
      <style>
        .local-app-header {
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .local-app-header a {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
        }
      </style>
    `
    const bodyInject = `
      <div class="local-app-header">
        <a href="javascript:history.back()">← 返回</a>
      </div>
    `

    htmlContent = htmlContent.replace('</head>', `${headInject}\n</head>`)
    htmlContent = htmlContent.replace('<body>', `<body>\n${bodyInject}`)

    files.push({
      name: 'index.html',
      content: htmlContent
    })

    // CSS 文件
    if (this.files.css) {
      const cssContent = await this.readFileAsText(this.files.css)
      files.push({
        name: 'style.css',
        content: cssContent
      })

      // 在 HTML 中引入 CSS
      const cssLink = `<link rel="stylesheet" href="./style.css">`
      files[0].content = htmlContent.replace('</head>', `${cssLink}\n</head>`)
    }

    // JS 文件
    if (this.files.js) {
      const jsContent = await this.readFileAsText(this.files.js)
      files.push({
        name: 'main.js',
        content: jsContent
      })

      // 在 HTML 中引入 JS
      const jsScript = `<script type="module" src="./main.js"></script>`
      const updatedHtml = files[0].content
      files[0].content = updatedHtml.replace('</body>', `${jsScript}\n</body>`)
    }

    // 资源文件
    if (this.files.assets.length > 0) {
      for (const asset of this.files.assets) {
        const content = await this.readFileAsBase64(asset)
        files.push({
          name: `assets/${asset.name}`,
          content: content
        })
      }
    }

    // 生成应用访问 URL
    const appUrl = this.generateLocalAppUrl(appId, files[0].content)

    return {
      id: appId,
      name: formData.appName,
      description: formData.appDescription,
      icon: formData.appIcon,
      type: formData.appType,
      dirName: appDirName,
      createdAt: new Date().toISOString(),
      files: files,
      url: appUrl
    }
  }

  generateLocalAppUrl(appId, htmlContent) {
    // 生成 blob URL 用于本地访问
    const blob = new Blob([htmlContent], { type: 'text/html' })
    return URL.createObjectURL(blob)
  }

  updateLocalNavigation(appData) {
    // 这里可以更新本地存储的导航数据
    // 未来可以在首页显示用户上传的应用
    console.log('应用已保存到本地:', appData)
  }

  loadSavedApps() {
    console.log('已保存的应用:', this.savedApps)
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

  showSuccess(appData) {
    document.getElementById('appLink').href = appData.url
    document.getElementById('successModal').style.display = 'flex'
  }
}

// 初始化上传工具
const uploader = new AppUploader()

console.log('应用上传工具已加载 📤')
console.log('上传 HTML 应用，保存到本地直接使用！')
