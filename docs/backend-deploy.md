# 自动部署后端服务部署指南

## 🚀 功能说明
这个后端服务用于接收用户上传的应用，自动创建 Pull Request 到 GitHub 仓库，审核通过后自动部署到线上。

## 📋 部署步骤

### 1. 准备工作
1. 创建 GitHub Personal Access Token：
   - 登录 GitHub → Settings → Developer settings → Personal access tokens
   - 生成新的 Token，勾选 `repo` 权限
   - 保存好这个 Token，后面会用到

### 2. 部署到 Vercel（推荐，免费）
1. 直接把当前 WebSnack 仓库导入到 Vercel
2. 在 Vercel 项目的 Settings → Environment Variables 中添加环境变量：
   ```
   GITHUB_TOKEN=你的 GitHub Token
   REPO_OWNER=bigbaitoo
   REPO_NAME=WebSnack
   BASE_BRANCH=main
   ```
3. 配置构建和部署设置：
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. 点击部署，部署完成后会得到一个类似 `https://your-project.vercel.app` 的地址

### 3. 配置前端
修改 `apps/tool-uploader/main.js` 中的后端地址：
```javascript
const response = await fetch('https://你的后端地址/api/upload', {
```

### 4. 测试
1. 打开上传工具页面
2. 填写应用信息，上传文件
3. 部署方式选择"提交部署"
4. 提交后会自动在 GitHub 仓库创建 PR
5. 你审核通过合并 PR 后，会自动部署到线上

## 🔧 本地开发测试
```bash
npm install
npm run dev
```
前端服务运行在 http://localhost:5173
API 接口运行在 http://localhost:3000/api/upload (需要单独运行后端服务)

## ✨ 工作流程
1. 用户上传应用，选择"提交部署"
2. 前端发送请求到后端服务 `/api/upload`
3. 后端自动创建新的分支
4. 把应用文件提交到新分支
5. 自动更新首页导航，添加新应用
6. 创建 Pull Request 到 main 分支
7. 你收到 PR 通知，审核代码
8. 审核通过合并 PR，GitHub Actions 自动部署
9. 1-2 分钟后应用上线

## 🛡️ 安全设置
1. **内容审核**：所有用户提交的代码都需要你手动审核，确保没有恶意代码
2. **文件大小限制**：默认限制 10MB，可以在 `api/upload.js` 中调整
3. **CORS 配置**：默认允许所有来源，可以在代码中配置允许的域名
4. **Token 权限**：GitHub Token 只需要 repo 权限，不要给其他多余的权限

## 📝 自定义配置
可以在 `api/upload.js` 中调整：
- 文件大小限制
- 允许的文件类型
- PR 模板和内容
- 自动添加的标签和 assignee
- 通知方式

## 🔔 通知设置
可以配置 GitHub 的 Webhook，有新 PR 时自动发送通知到你的邮箱、企业微信、钉钉等。

部署过程中有任何问题随时告诉我，我帮你解决！
