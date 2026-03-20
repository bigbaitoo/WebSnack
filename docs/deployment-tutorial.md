# 自动化部署完整教程

## 📋 部署方案对比

| 方案 | 优点 | 缺点 | 适合场景 |
|------|------|------|----------|
| GitHub Pages | 免费，集成度高，自动部署 | 私有仓库需要付费，国内访问速度一般 | 公开项目，静态站点 |
| Vercel | 免费，速度快，支持Serverless，自动部署 | 自定义域名需要备案 | 个人项目，需要后端功能 |
| Netlify | 免费，功能丰富，表单支持 | 国内访问速度一般 | 海外项目 |
| Cloudflare Pages | 免费，全球CDN，速度快 | 功能相对简单 | 需要全球加速的项目 |

---

## 🚀 GitHub Pages + Actions 自动部署

### 1. 配置 GitHub Actions
在 `.github/workflows/deploy.yml` 中添加配置：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 2. 开启 GitHub Pages
1. 进入仓库 → Settings → Pages
2. Source 选择 "Deploy from a branch"
3. 分支选择 `gh-pages`，文件夹选择 `/ (root)`
4. 保存后每次推送到 main 分支会自动部署

### 3. 注意事项
- 公开仓库免费使用，私有仓库需要付费
- 访问地址：`https://用户名.github.io/仓库名/`
- 适合纯静态站点，不支持后端功能

---

## ☁️ Vercel 自动化部署

### 1. 部署步骤
1. 访问 [vercel.com](https://vercel.com) 用 GitHub 账号登录
2. 点击 "Add New" → "Project"
3. 导入你的 GitHub 仓库
4. 配置项目：
   - **Framework Preset**: 选择 Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: 添加需要的环境变量（如 `GITHUB_TOKEN`）
5. 点击 "Deploy"，等待部署完成

### 2. 自动部署配置
- 推送代码到 GitHub 会自动触发部署
- 每个 PR 会自动生成预览地址
- 支持回滚到任意历史版本

### 3. 环境变量配置
进入项目 → Settings → Environment Variables，添加：
- `GITHUB_TOKEN`: 你的 GitHub Personal Access Token（需要 repo 权限）
- 其他业务需要的变量

### 4. 自定义域名
1. 进入项目 → Settings → Domains
2. 添加你的域名
3. 在域名服务商配置 DNS 解析到 Vercel 提供的地址
4. 自动颁发 SSL 证书，开启 HTTPS

### 5. Serverless 函数支持
- 在项目根目录创建 `api` 文件夹
- 里面的 `.js` 文件会自动作为无服务器函数部署
- 访问地址：`https://你的域名/api/函数名`

---

## 🔧 GitHub Token 创建教程
1. 登录 GitHub → 右上角头像 → Settings
2. 左侧菜单 → Developer settings → Personal access tokens → Tokens (classic)
3. 点击 "Generate new token" → "Generate new token (classic)"
4. 填写 Note，选择过期时间
5. 勾选 `repo` 权限（完整的仓库权限）
6. 点击 "Generate token"，复制保存好 Token（只会显示一次）

---

## 📦 项目构建配置
### Vite 配置（vite.config.js）
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './', // 使用相对路径，适配所有部署环境
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

### package.json 脚本
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🎯 最佳部署流程
1. **开发阶段**：本地开发测试，提交代码到 GitHub
2. **自动部署**：GitHub Actions 自动部署到 GitHub Pages
3. **生产部署**：Vercel 连接仓库，自动部署生产环境
4. **域名配置**：自定义域名绑定到 Vercel
5. **监控告警**：配置部署失败通知

---

## 💰 成本说明
- GitHub Pages：免费（公开仓库）
- Vercel：免费版足够个人使用（100G 带宽/月，不限部署次数）
- 域名：每年约 50 元（可选）
- 总成本：0 - 50 元/年

---

## 🚩 常见问题排查
### 部署失败
1. 检查构建日志，看是否有代码错误
2. 确认依赖安装正常，`package-lock.json` 是否存在
3. 检查构建命令和输出目录配置是否正确

### 页面 404
1. 确认所有链接使用相对路径
2. 检查 Vite 的 base 配置是否为 `'./'`
3. 确认部署分支和目录配置正确

### 访问速度慢
1. 国内用户建议使用 Vercel 或 Cloudflare Pages
2. 配置 CDN 加速静态资源
3. 优化图片和资源大小
