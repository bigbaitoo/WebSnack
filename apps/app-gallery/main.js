// 应用广场核心逻辑
import { getAppInfo } from './app-config.js'

class AppGallery {
  constructor() {
    this.apps = []
    this.filteredApps = []
    this.currentFilter = 'all'
    this.searchKeyword = ''
    this.githubToken = '' // 可选：如果 API 限制，可以填 GitHub Token

    this.init()
  }

  async init() {
    this.bindEvents()
    await this.loadApps()
    this.renderApps()
  }

  bindEvents() {
    // 搜索功能
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.searchKeyword = e.target.value.toLowerCase()
      this.filterApps()
    })

    // 筛选功能
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
        e.target.classList.add('active')
        this.currentFilter = e.target.dataset.type
        this.filterApps()
      })
    })
  }

  async loadApps() {
    try {
      const apps = []

      // 从 GitHub API 获取所有应用
      try {
        const githubApps = await this.loadAppsFromGitHub()
        apps.push(...githubApps)
      } catch (error) {
        console.log('从 GitHub 加载应用失败，使用配置文件:', error)
        // 如果 API 失败，从配置文件加载
        for (const dirName in appInfoConfig) {
          const info = getAppInfo(dirName)
          apps.push({
            ...info,
            path: `/apps/${dirName}/index.html`,
            sourceUrl: `https://github.com/bigbaitoo/WebSnack/tree/main/apps/${dirName}`
          })
        }
      }

      // 从本地存储获取用户上传的应用
      const uploadedApps = getFromLocalStorage('uploaded_apps', [])
      apps.push(...uploadedApps)

      // 去重
      const uniqueApps = []
      const paths = new Set()
      for (const app of apps) {
        if (!paths.has(app.path)) {
          paths.add(app.path)
          uniqueApps.push(app)
        }
      }
      this.apps = uniqueApps
      this.filteredApps = this.apps

    } catch (error) {
      console.error('加载应用列表失败:', error)
      this.showError('加载应用列表失败')
    }
  }

  async loadAppsFromGitHub() {
    const apps = []
    const owner = 'bigbaitoo'
    const repo = 'WebSnack'
    const branch = 'main'

    try {
      // 获取 apps 目录下的所有文件夹
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/apps?ref=${branch}`, {
        headers: this.githubToken ? {
          'Authorization': `token ${this.githubToken}`
        } : {}
      })

      if (!response.ok) {
        throw new Error(`GitHub API 请求失败: ${response.status}`)
      }

      const items = await response.json()

      // 遍历所有子目录
      for (const item of items) {
        if (item.type === 'dir' && !['shared', '.git'].includes(item.name)) {
          try {
            // 检查是否有 index.html 文件
            const htmlResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/apps/${item.name}/index.html?ref=${branch}`, {
              headers: this.githubToken ? {
                'Authorization': `token ${this.githubToken}`
              } : {}
            })

            if (htmlResponse.ok) {
              // 从配置文件获取应用信息，没有配置则自动生成
              const appInfo = getAppInfo(item.name)

              apps.push({
                ...appInfo,
                path: `/apps/${item.name}/index.html`,
                sourceUrl: `https://github.com/${owner}/${repo}/tree/main/apps/${item.name}`
              })
            }
          } catch (e) {
            console.log(`跳过目录 ${item.name}:`, e)
          }
        }
      }
    } catch (error) {
      console.error('GitHub API 请求失败:', error)
      throw error
    }

    return apps
  }

  filterApps() {
    let filtered = [...this.apps]

    // 按类型筛选
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(app => app.type === this.currentFilter)
    }

    // 按关键词搜索
    if (this.searchKeyword) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(this.searchKeyword) ||
        app.description.toLowerCase().includes(this.searchKeyword)
      )
    }

    this.filteredApps = filtered
    this.renderApps()
  }

  renderApps() {
    const grid = document.getElementById('appsGrid')
    const emptyState = document.getElementById('emptyState')

    if (this.filteredApps.length === 0) {
      grid.style.display = 'none'
      emptyState.style.display = 'block'
      return
    }

    grid.style.display = 'grid'
    emptyState.style.display = 'none'

    grid.innerHTML = this.filteredApps.map(app => `
      <div class="app-card">
        <div class="app-header-card">
          <div class="app-icon">${app.icon}</div>
          <div class="app-info">
            <h3>${app.name}</h3>
            <span class="app-type">${this.getTypeLabel(app.type)}</span>
          </div>
        </div>
        <p class="app-description">${app.description}</p>
        <div class="app-actions">
          <a href="${app.path}" target="_blank" class="app-btn app-btn-primary">打开应用</a>
          ${app.sourceUrl ? `
            <a href="${app.sourceUrl}" target="_blank" class="app-btn app-btn-secondary">源码</a>
          ` : ''}
        </div>
      </div>
    `).join('')
  }

  getTypeLabel(type) {
    const labels = {
      'game': '游戏',
      'tool': '工具',
      'app': '应用',
      'ru': '俄语'
    }
    return labels[type] || type
  }

  showError(message) {
    const grid = document.getElementById('appsGrid')
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: white;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h3>加载失败</h3>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">重试</button>
      </div>
    `
  }
}

// 初始化应用广场
const gallery = new AppGallery()

console.log('🏪 应用广场已加载')
console.log('所有应用都会在这里展示')

