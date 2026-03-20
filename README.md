# WebSnack - 碎片化应用集合

一个包含多种小应用、小游戏、工具的集合站点，部署在 GitHub Pages 上。

## 技术栈

- **构建工具**: Vite 5.x
- **核心框架**: 支持纯 JS/TS、Vue 3、React 等（可自由选择）
- **样式方案**: UnoCSS / Tailwind CSS / SCSS
- **部署**: GitHub Pages
- **可选扩展**: Supabase / Firebase（用户系统、数据存储）

## 目录结构

```
├── apps/                    # 所有应用集合
│   ├── demo/               # 示例应用（可删除）
│   ├── game-2048/          # 2048 小游戏
│   ├── tool-calculator/    # 计算器工具
│   ├── todo-app/           # 待办事项应用
│   └── [app-name]/         # 新增应用目录
│       ├── index.html      # 应用入口 HTML
│       ├── main.js/ts      # 应用入口脚本
│       ├── App.vue/jsx     # 应用根组件
│       ├── style.css       # 应用样式
│       ├── components/     # 应用私有组件
│       ├── assets/         # 应用私有资源
│       └── utils/          # 应用私有工具函数
├── shared/                 # 公共共享资源
│   ├── components/         # 公共组件（导航、Footer、通用 UI 等）
│   ├── utils/              # 公共工具函数（存储、请求、通用方法等）
│   ├── styles/             # 公共样式（全局样式、主题、通用类）
│   ├── assets/             # 公共资源（logo、图标、通用图片等）
│   └── composables/        # 公共组合式函数（Vue）/ Hooks（React）
├── public/                 # 静态资源，会被直接复制到构建产物根目录
│   ├── favicon.ico         # 站点图标
│   ├── robots.txt          # 搜索引擎爬虫规则
│   └── manifest.json       # PWA 配置文件（可选）
├── docs/                   # 文档目录
│   ├── development.md      # 开发指南
│   ├── deployment.md       # 部署指南
│   └── commercial.md       # 商业化方案
├── index.html              # 站点首页（应用导航页）
├── package.json            # 项目依赖
├── vite.config.js          # Vite 配置文件
├── .gitignore              # Git 忽略配置
└── README.md               # 项目说明文档
```

## 开发说明

### 新增应用

1. 在 `apps/` 目录下新建应用目录，命名格式：`[类型]-[名称]`，例如 `game-snake`、`tool-qrcode`
2. 每个应用独立开发，互不影响
3. 可自由选择技术栈（纯 JS、Vue、React 等）
4. 应用入口必须是 `index.html`

### 公共资源使用

- 通用的组件、工具函数、样式都放在 `shared/` 目录下，各个应用可以直接引用
- 避免重复造轮子，提高开发效率
- 公共资源的修改会影响所有引用它的应用，修改时需要谨慎

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

### 部署到 GitHub Pages

1. 构建项目：`npm run build`
2. 推送 `dist` 目录到 `gh-pages` 分支
3. 开启 GitHub Pages 服务，选择 `gh-pages` 分支作为源

## 扩展方案

### 用户系统集成

- 支持 Firebase Auth、Supabase Auth 等第三方认证服务
- 公共认证逻辑封装在 `shared/utils/auth.js` 中
- 用户数据存储支持 localStorage、IndexedDB、云存储等多种方案

### 商业化扩展

- 预留广告位接入点
- 支持付费功能解锁
- 集成第三方支付 SDK
- 数据统计和用户行为分析

## 应用分类

### 游戏类
- 休闲小游戏
- 益智类游戏
- 创意互动游戏

### 工具类
- 日常效率工具
- 开发工具
- 创意工具

### 应用类
- 待办事项
- 笔记应用
- 生产力工具
