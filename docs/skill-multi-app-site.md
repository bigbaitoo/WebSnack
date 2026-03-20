# 从零开发多应用站点技能文档

## 🎯 项目架构设计
### 目录结构
```
project/
├── apps/                    # 所有应用集合
│   ├── demo/               # 示例应用
│   ├── game-xxx/           # 游戏类应用
│   ├── tool-xxx/           # 工具类应用
│   ├── app-xxx/            # 普通应用
│   ├── games/              # 游戏专区首页
│   ├── ru/                 # 俄语专区首页
│   └── app-gallery/        # 应用广场
├── shared/                 # 公共共享资源
│   ├── components/         # 公共组件
│   ├── utils/              # 工具函数
│   ├── styles/             # 公共样式
│   └── assets/             # 公共资源
├── public/                 # 静态资源
├── api/                    # Vercel Serverless 函数
├── index.html              # 主站首页
├── vite.config.js          # Vite 配置
└── package.json            # 项目配置
```

### 命名规范
- 应用目录：`[类型]-[名称]`，如 `game-2048`、`tool-calculator`
- 类型前缀：`game-` 游戏、`tool-` 工具、`app-` 普通应用
- 所有文件名使用 kebab-case 命名法

---

## 🛠️ 技术栈选择
### 前端框架
- **构建工具**：Vite 5.x（多页面支持好，构建速度快）
- **可选框架**：纯 HTML/CSS/JS、Vue 3、React 等（Vite 都支持）
- **样式方案**：原生 CSS、UnoCSS、Tailwind CSS 都可以
- **无后端依赖**：纯静态架构，支持任意静态托管

### 后端方案（可选）
- **无服务器函数**：Vercel Functions / Netlify Functions
- **BaaS 服务**：Supabase / Firebase（用户系统、数据存储）
- **认证**：GitHub OAuth / 邮箱密码登录

---

## 🚀 快速开发流程
### 1. 项目初始化
```bash
# 创建项目
npm create vite@latest . -- --template vanilla

# 安装依赖
npm install

# 配置 Vite 多页面
```

### 2. Vite 多页面配置
`vite.config.js`：
```javascript
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

// 自动扫描 apps 目录下的所有应用
function getApps() {
  const appsDir = path.resolve(__dirname, 'apps')
  const appDirs = fs.readdirSync(appsDir).filter(file => {
    return fs.statSync(path.join(appsDir, file)).isDirectory()
  })

  const inputs = {
    main: path.resolve(__dirname, 'index.html'),
  }

  appDirs.forEach(app => {
    inputs[app] = path.join(appsDir, app, 'index.html')
  })

  return inputs
}

export default defineConfig({
  base: './', // 相对路径，适配所有部署环境
  build: {
    rollupOptions: {
      input: getApps()
    }
  }
})
```

### 3. 创建新应用
1. 在 `apps/` 目录下新建应用目录，如 `game-snake`
2. 创建 `index.html` 作为入口
3. 开发应用功能
4. 在首页和应用广场添加入口链接

### 4. 公共资源使用
- 公共样式：在 HTML 中引用 `<link rel="stylesheet" href="../../shared/styles/global.css">`
- 工具函数：`import { xxx } from '@shared/utils/xxx.js'`
- 路径别名：在 vite.config.js 中配置 alias

---

## 🎨 页面模板
### 通用应用模板
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>应用名称 - WebSnack</title>
  <link rel="stylesheet" href="../../shared/styles/global.css">
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div class="app-container">
    <div class="app-header">
      <a href="../../index.html" class="back-link">← 返回首页</a>
      <h1>🎮 应用名称</h1>
    </div>
    <!-- 应用内容 -->
  </div>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

### 专区首页模板
参考 `apps/games/index.html` 和 `apps/ru/index.html`

---

## 🔒 安全规范
1. **输入验证**：所有用户上传内容都要进行安全检查
2. **权限控制**：GitHub Token 只给必要的 repo 权限
3. **内容审核**：用户上传的应用需要人工审核后再合并
4. **XSS 防护**：用户提交的 HTML 内容要过滤危险脚本
5. **最小权限原则**：后端服务只给必要的权限

---

## 📦 部署方案
### 开发环境
```bash
npm run dev      # 本地开发
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

### 生产部署
选择以下任意一种方案：

#### 方案1：GitHub Pages（免费）
- 配置 Actions 自动部署，参考 `deployment-tutorial.md`
- 适合公开项目，简单方便

#### 方案2：Vercel（推荐）
- 连接 GitHub 仓库自动部署
- 支持 Serverless 函数，国内访问速度快
- 适合需要后端功能的项目

#### 方案3：Cloudflare Pages
- 全球 CDN 加速，访问速度快
- 适合需要全球访问的项目

---

## 📈 扩展功能
### 用户系统
1. 集成 Supabase Auth / Firebase Auth
2. 支持邮箱、第三方登录
3. 用户上传应用管理

### 应用市场功能
1. 应用评分、评论
2. 分类浏览、搜索
3. 热门应用推荐

### 商业化功能
1. 应用付费解锁
2. 广告投放
3. 会员订阅

---

## ✅ 项目 Checklist
- [ ] 项目初始化和 Vite 配置
- [ ] 公共样式和工具函数
- [ ] 主站首页开发
- [ ] 应用广场页面
- [ ] 分类专区页面
- [ ] 上传工具开发
- [ ] 部署配置（GitHub Actions / Vercel）
- [ ] 域名配置和 HTTPS
- [ ] 安全检查和权限配置

---

## 💡 开发技巧
1. **优先静态化**：能用静态实现的功能不要用动态，稳定性更高
2. **统一路径规则**：所有链接使用相对路径，避免部署后 404
3. **组件复用**：公共功能抽离到 shared 目录，避免重复开发
4. **渐进式开发**：先实现核心功能，再逐步扩展
5. **自动化部署**：配置 CI/CD，提交代码自动部署

---

## 🔗 相关文档参考
- 部署教程：`deployment-tutorial.md`
- 问题解决方案：`problems-solutions.md`
- 商业化方案：`commercial.md`
