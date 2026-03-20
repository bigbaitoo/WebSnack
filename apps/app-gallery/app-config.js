// 应用信息配置文件
// 这里可以自定义每个应用的展示信息
export const appInfoConfig = {
  'demo': {
    name: '示例应用',
    description: '演示应用，展示基础功能',
    icon: '🎯',
    type: 'app'
  },
  'game-2048': {
    name: '2048 小游戏',
    description: '经典的数字合并益智游戏',
    icon: '🎲',
    type: 'game'
  },
  'tool-uploader': {
    name: '应用上传工具',
    description: '上传 HTML 应用，自动部署到站点',
    icon: '📤',
    type: 'tool'
  },
  'app-gallery': {
    name: '应用广场',
    description: '浏览和搜索所有已上传的应用',
    icon: '🏪',
    type: 'tool'
  },
  'games': {
    name: '游戏专区',
    description: '所有小游戏合集，随时打开随时玩',
    icon: '🎮',
    type: 'game'
  },
  'ru': {
    name: '俄语专区',
    description: 'Русская секция - 俄语应用和游戏集合',
    icon: '🇷🇺',
    type: 'ru'
  }
}

// 从配置中获取应用信息
export function getAppInfo(dirName) {
  return appInfoConfig[dirName] || {
    name: dirName.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
    description: '用户上传的应用',
    icon: getIconByDirName(dirName),
    type: getTypeByDirName(dirName)
  }
}

// 根据目录名获取图标
function getIconByDirName(dirName) {
  if (dirName.startsWith('game-')) return '🎮'
  if (dirName.startsWith('tool-')) return '🛠️'
  if (dirName.startsWith('app-')) return '📱'
  return '📦'
}

// 根据目录名获取类型
function getTypeByDirName(dirName) {
  if (dirName.startsWith('game-')) return 'game'
  if (dirName.startsWith('tool-')) return 'tool'
  if (dirName.startsWith('app-')) return 'app'
  if (dirName === 'ru') return 'ru'
  return 'app'
}
