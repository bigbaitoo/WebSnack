// 应用广场核心逻辑 - 简化版，确保所有应用正常显示
const appList = [
  {
    name: '示例应用',
    description: '演示应用，展示基础功能',
    icon: '🎯',
    type: 'app',
    path: '../demo/index.html'
  },
  {
    name: '2048 小游戏',
    description: '经典的数字合并益智游戏',
    icon: '🎲',
    type: 'game',
    path: '../game-2048/index.html'
  },
  {
    name: '应用上传工具',
    description: '上传 HTML 应用，自动部署到站点',
    icon: '📤',
    type: 'tool',
    path: '../tool-uploader/index.html'
  },
  {
    name: '俄语单词卡',
    description: '俄语词汇学习卡片，含音频朗读',
    icon: '🇷🇺',
    type: 'ru',
    path: '../ru-/index.html'
  },
  {
    name: '赤色要塞',
    description: '网页版策略游戏',
    icon: '🏰',
    type: 'game',
    path: '../game-/index.html'
  }
]

class AppGallery {
  constructor() {
    this.apps = []
    this.filteredApps = []
    this.currentFilter = 'all'
    this.searchKeyword = ''

    this.init()
  }

  async init() {
    this.bindEvents()
    this.loadApps()
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

  loadApps() {
    this.apps = [...appList]
    this.filteredApps = [...appList]
    console.log('应用列表加载完成:', this.apps)
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
          <a href="${app.path}" class="app-btn app-btn-primary">打开应用</a>
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
