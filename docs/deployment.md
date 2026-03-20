# 部署指南

## 部署到 GitHub Pages

### 自动部署（推荐）

1. 在项目根目录下创建 `.github/workflows/deploy.yml` 文件，内容如下：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 你的主分支名

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. 推送代码到 GitHub 仓库
3. 进入仓库 Settings → Pages → Source 选择 "GitHub Actions"
4. 以后每次推送到 main 分支都会自动构建并部署

### 手动部署

1. 构建项目：
```bash
npm run build
```

2. 进入 dist 目录：
```bash
cd dist
```

3. 初始化 git 仓库并推送到 gh-pages 分支：
```bash
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:你的用户名/你的仓库名.git main:gh-pages
```

4. 在仓库 Settings → Pages → Source 选择 "Deploy from a branch"，选择 gh-pages 分支

## 部署到其他平台

### Vercel / Netlify

1. 连接你的 GitHub 仓库
2. 配置构建命令：`npm run build`
3. 配置输出目录：`dist`
4. 点击部署即可

### 静态文件托管服务（阿里云OSS、腾讯云COS等）

1. 构建项目：`npm run build`
2. 将 dist 目录下的所有文件上传到对应的存储服务
3. 配置静态网站托管和 CDN

## 自定义域名

1. 在 `public` 目录下创建 `CNAME` 文件，内容为你的自定义域名：
```
yourdomain.com
```

2. 在你的域名服务商处配置 DNS 解析：
   - CNAME 记录指向 `你的用户名.github.io`
   - 或者 A 记录指向 GitHub Pages 的 IP 地址

3. 在仓库 Settings → Pages → Custom domain 中填写你的域名并保存

## 部署注意事项

1. **基础路径配置**：如果部署到子路径（如 `https://你的用户名.github.io/WebSnack/`），确保 `vite.config.js` 中的 `base` 配置正确：
```javascript
base: process.env.NODE_ENV === 'production' ? '/WebSnack/' : '/',
```

2. **404 页面**：单页应用需要配置 404 页面重定向到 index.html，可以在 `public` 目录下创建 `404.html` 文件，内容和 `index.html` 相同。

3. **缓存策略**：建议配置 CDN 缓存策略，HTML 文件不缓存，静态资源设置长期缓存。

4. **HTTPS**：GitHub Pages、Vercel、Netlify 等平台都提供免费的 HTTPS 证书，建议开启。
