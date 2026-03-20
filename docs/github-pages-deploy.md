# GitHub Pages 自动部署指南

## 🚀 一键部署配置

我已经帮你配置好了 GitHub Actions 自动部署，只需要几步就可以完成部署：

### 1. 推送代码到 GitHub
首先把你的代码推送到 GitHub 仓库：
```bash
git add .
git commit -m "init project with 2048 game"
git push origin main
```

### 2. 开启 GitHub Pages
1. 进入你的 GitHub 仓库页面
2. 点击 `Settings` → `Pages`
3. 在 `Source` 下拉菜单中选择 `GitHub Actions`
4. 保存设置

### 3. 自动部署
- 第一次推送代码后，GitHub 会自动运行部署工作流
- 你可以在仓库的 `Actions` 标签页查看部署进度
- 部署完成后，你的站点就可以访问了！

## 📱 访问地址
部署成功后，你的站点访问地址是：
```
https://你的用户名.github.io/WebSnack/
```

如果你的仓库名不是 `WebSnack`，需要修改 `vite.config.js` 中的 `base` 配置：
```javascript
base: process.env.NODE_ENV === 'production' ? '/你的仓库名/' : '/',
```

## 🔄 后续更新
以后每次你推送代码到 `main` 分支，GitHub 都会自动：
1. 安装依赖
2. 构建项目
3. 部署到 GitHub Pages

整个过程大概 1-2 分钟，不需要你手动操作。

## ⚙️ 自定义配置

### 配置自定义域名
如果你有自己的域名：
1. 在 `public` 目录下创建 `CNAME` 文件，内容是你的域名：
   ```
   yourdomain.com
   ```
2. 修改 `.github/workflows/deploy.yml`，取消注释 `custom_domain` 配置：
   ```yaml
   custom_domain: yourdomain.com
   ```
3. 在你的域名服务商配置 DNS 解析，指向 GitHub Pages：
   - CNAME 记录：`你的用户名.github.io`

### 手动触发部署
除了推送代码自动部署，你也可以手动触发：
1. 进入仓库的 `Actions` 标签页
2. 选择 `Deploy to GitHub Pages` 工作流
3. 点击 `Run workflow` 按钮
4. 选择分支，点击 `Run workflow`

## 📝 部署注意事项

1. **仓库权限**：确保 GitHub Actions 有写入权限：
   - 进入仓库 `Settings` → `Actions` → `General`
   - 在 `Workflow permissions` 中选择 `Read and write permissions`
   - 勾选 `Allow GitHub Actions to create and approve pull requests`
   - 保存设置

2. **构建失败排查**：
   - 如果部署失败，可以在 `Actions` 中查看错误日志
   - 常见问题：依赖安装失败、代码有语法错误等

3. **预览部署结果**：
   部署完成后，可以在 `Settings` → `Pages` 页面看到你的站点地址。

## 🎯 测试部署
你现在可以直接推送代码到 GitHub，第一次部署会自动运行。如果遇到问题随时告诉我，我帮你排查。
