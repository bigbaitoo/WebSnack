# 开发指南

## 环境准备

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 即可看到站点首页。

### 3. 构建生产版本

```bash
npm run build
```

构建产物会生成在 `dist` 目录下。

### 4. 预览构建产物

```bash
npm run preview
```

## 创建新应用

### 步骤

1. 在 `apps/` 目录下新建应用目录，命名规范：`[类型]-[名称]`，例如：
   - 游戏类：`game-snake`、`game-2048`
   - 工具类：`tool-calculator`、`tool-qrcode`
   - 应用类：`app-todo`、`app-notes`

2. 在应用目录下创建 `index.html` 作为入口文件：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>应用名称 - WebSnack</title>
  <link rel="stylesheet" href="/shared/styles/global.css">
  <!-- 应用私有样式 -->
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <!-- 应用内容 -->
  <div id="app"></div>

  <!-- 应用入口脚本 -->
  <script type="module" src="./main.js"></script>
</body>
</html>
```

3. 开发你的应用，可以使用任意前端技术栈：
   - 纯 HTML/CSS/JavaScript
   - Vue 3
   - React
   - 其他 Vite 支持的框架

4. 在首页 `index.html` 中添加应用入口链接：
```html
<a href="/apps/your-app-name/" class="app-card">
  <div class="app-icon">🎮</div>
  <div class="app-info">
    <h3>应用名称</h3>
    <p>应用描述</p>
  </div>
</a>
```

### 应用结构示例

```
apps/your-app/
├── index.html      # 应用入口（必需）
├── main.js         # 应用入口脚本（必需）
├── style.css       # 应用样式（可选）
├── App.vue         # Vue 应用根组件（如果使用 Vue）
├── components/     # 应用私有组件（可选）
├── assets/         # 应用私有资源（可选）
└── utils/          # 应用私有工具函数（可选）
```

## 公共资源使用

### 公共组件
所有公共组件都放在 `shared/components/` 目录下，可以在任意应用中直接引用：
```javascript
import MyComponent from '@shared/components/MyComponent.vue'
```

### 公共工具函数
公共工具函数放在 `shared/utils/` 目录下：
```javascript
import { saveToLocalStorage, copyToClipboard } from '@shared/utils/common.js'
```

### 公共样式
全局样式在 `shared/styles/global.css`，已经在所有页面默认引入。
可以创建额外的公共样式文件，在需要的页面中引入：
```html
<link rel="stylesheet" href="/shared/styles/your-style.css">
```

### 公共资源
公共图片、图标等资源放在 `shared/assets/` 目录下：
```html
<img src="/shared/assets/logo.png" alt="Logo">
```

## 技术栈说明

### Vue 3 应用
项目已内置 Vue 3 支持，创建 Vue 应用非常简单：

1. 安装依赖（已默认安装）：
```bash
npm install vue
```

2. 在应用目录下创建 `App.vue`：
```vue
<template>
  <div>
    <h1>Hello Vue</h1>
  </div>
</template>

<script setup>
// 逻辑代码
</script>

<style scoped>
/* 样式 */
</style>
```

3. 在 `main.js` 中挂载：
```javascript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

### React 应用
需要先安装 React 相关依赖：
```bash
npm install react react-dom
npm install -D @vitejs/plugin-react
```

在 `vite.config.js` 中添加 React 插件：
```javascript
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [vue(), react()],
  // ...其他配置
})
```

## 代码规范

### 命名规范
- 目录和文件名使用 kebab-case 命名法，例如 `user-profile.js`
- JavaScript 变量和函数使用 camelCase 命名法
- Vue 组件使用 PascalCase 命名法
- CSS 类名使用 kebab-case 命名法

### 注释规范
- 公共组件和工具函数必须有清晰的注释说明
- 复杂的业务逻辑需要添加注释说明
- 特殊的处理逻辑需要注释说明原因

### 提交规范
```
feat: 新增功能
fix: 修复 bug
docs: 文档更新
style: 样式调整
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建/工具链调整
```

## 最佳实践

1. **应用独立性**：每个应用应该是独立的，不要依赖其他应用的代码
2. **公共资源复用**：通用的功能尽量放到 `shared/` 目录下，避免重复开发
3. **性能优化**：
   - 按需引入依赖，避免打包体积过大
   - 图片资源进行压缩
   - 合理使用懒加载
4. **响应式设计**：所有应用都应该适配移动端
5. **无障碍访问**：合理使用语义化标签，支持键盘导航
6. **错误处理**：添加必要的错误边界和用户提示

## 常见问题

### 为什么新增的应用访问不到？
- 确保应用目录下有 `index.html` 文件
- 重启开发服务器，Vite 会自动识别新的应用入口

### 如何配置应用单独的构建优化？
可以在 `vite.config.js` 中针对不同的应用配置不同的构建策略，或者在应用目录下创建单独的 vite 配置文件。

### 如何实现应用之间的通信？
- 使用 URL 参数传递数据
- 使用 localStorage/sessionStorage 共享数据
- 使用 postMessage 进行跨页面通信

### 如何添加 PWA 支持？
可以使用 `vite-plugin-pwa` 插件，在 `vite.config.js` 中配置即可。
