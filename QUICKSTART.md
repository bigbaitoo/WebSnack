# 快速开始

## 🎉 项目已搭建完成！

你现在拥有了一个功能完整的碎片化应用集合站点，可以直接部署到 GitHub Pages。

## 📁 目录结构说明

```
WebSnack/
├── apps/                    # 所有应用集合
│   └── demo/               # 示例应用（参考用，可删除）
├── shared/                 # 公共共享资源
│   ├── components/         # 公共组件
│   ├── utils/              # 公共工具函数
│   ├── styles/             # 公共样式
│   └── assets/             # 公共资源
├── public/                 # 静态资源
├── docs/                   # 文档
│   ├── development.md      # 开发指南
│   ├── deployment.md       # 部署指南
│   └── commercial.md       # 商业化方案
├── index.html              # 站点首页
├── vite.config.js          # Vite 配置
└── package.json            # 项目配置
```

## 🚀 立即体验

### 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:5173 即可看到站点首页。

### 查看示例应用
访问 http://localhost:5173/apps/demo/ 查看示例应用效果。

## ✨ 下一步

### 1. 创建你的第一个应用
1. 在 `apps/` 目录下新建应用目录，例如 `game-2048`
2. 创建 `index.html`、`main.js`、`style.css` 文件
3. 开发你的应用
4. 在首页 `index.html` 添加应用入口链接

参考文档：`docs/development.md`

### 2. 部署到 GitHub Pages
#### 自动部署（推荐）
1. 推送代码到 GitHub 仓库
2. 参考 `docs/deployment.md` 配置 GitHub Actions 自动部署
3. 每次推送到 main 分支都会自动更新

#### 手动部署
```bash
npm run build
# 然后将 dist 目录部署到任意静态文件托管服务
```

### 3. 商业化扩展
- 广告接入、付费功能、用户系统等方案参考 `docs/commercial.md`

## 🎯 应用创意参考

### 游戏类
- 2048、消消乐、贪吃蛇、扫雷等经典游戏
- 益智类小游戏、解谜游戏
- 互动创意小游戏

### 工具类
- 计算器、单位转换、二维码生成/识别
- JSON 格式化、代码高亮、正则测试工具
- 图片压缩、格式转换、调色板工具

### 实用类
- 待办事项、笔记、倒计时、纪念日
- 天气查询、汇率换算、IP 查询
- 密码生成器、短链接生成

## 📚 相关文档

- 开发指南：`docs/development.md`
- 部署指南：`docs/deployment.md`
- 商业化方案：`docs/commercial.md`

## 💡 特性

✅ **开箱即用**：无需配置，直接开发
✅ **多技术栈支持**：支持纯 JS、Vue、React 等
✅ **自动多页面构建**：新增应用自动识别
✅ **GitHub Pages 友好**：完美适配静态部署
✅ **公共资源共享**：避免重复开发
✅ **商业化预留**：内置广告、付费、用户系统扩展方案

现在可以开始开发你的第一个应用了！有任何问题随时问我。
