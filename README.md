# 氢能科学与工程 · 网站项目

## 🔑 API Key 安全说明

本项目包含 AI 智能问答功能，**API Key 已从前端移至后端**，确保发布到 GitHub 后不会泄露密钥。

### 项目结构

```
Web/
├── index.html              # 主页面
├── ai-qa-new.js            # 前端 AI 问答（通过后端代理调用 API）
├── ai-qa.js                # 旧版本地知识库问答（无 API 调用）
├── server/                 # 后端代理服务（任选一种）
│   ├── .env                # 🔴 环境变量（含真实 API Key，已 .gitignore 排除）
│   ├── .env.example        # 环境变量示例（可提交到 Git）
│   ├── index.js            # Node.js 版后端
│   ├── package.json        # Node.js 依赖
│   ├── app.py              # Python 版后端（标准库，无需安装）
│   └── worker.js           # Cloudflare Workers 版（最简方案）
├── .gitignore              # Git 排除规则
├── search-data.js          # 搜索数据
├── search.js               # 搜索功能
└── Web/                    # 子页面目录
```

## 部署方案（三选一）

### 方案一：Cloudflare Workers ⭐ 推荐

最简方案，**完全免费**，无需维护服务器。

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers 和 Pages** → **创建 Worker**
3. 将 `server/worker.js` 的内容复制粘贴到编辑器中
4. 进入 Worker 的 **设置** → **环境变量**，添加：
   - 变量名：`DASHSCOPE_API_KEY`
   - 值：你的阿里云百炼 API Key
5. **部署**，获得 `https://your-worker.xxx.workers.dev` 地址
6. 修改 `ai-qa-new.js` 中的 `backendUrl` 为你的 Worker 地址 + `/api/chat`

### 方案二：Python 后端（本地运行或部署）

无需安装依赖，Python 标准库即可运行。

```bash
# 1. 将真实 API Key 填入 server/.env
# 2. 启动服务
python server/app.py

# 服务运行在 http://localhost:3000
```

部署到公网推荐 [Render](https://render.com)（免费）：
- 创建 Web Service，选择 Python 环境
- Start Command: `python server/app.py`
- 在环境变量中设置 `DASHSCOPE_API_KEY`

### 方案三：Node.js 后端

```bash
# 1. 进入 server 目录
cd server

# 2. 安装依赖
npm install

# 3. 将真实 API Key 填入 .env 文件

# 4. 启动服务
npm start

# 服务运行在 http://localhost:3000
```

部署推荐 [Railway](https://railway.app) 或 [Render](https://render.com)（均有免费额度）。

---

## 本地开发

前端纯静态，直接用浏览器打开 `index.html` 即可。

后端启动后，前端会自动通过 `http://localhost:3000/api/chat` 调用 AI 接口。

## 注意事项

- ⚠️ `server/.env` 文件包含真实 API Key，已通过 `.gitignore` 排除，**不要手动提交到 Git**
- 部署时请通过环境变量设置 `DASHSCOPE_API_KEY`，不要硬编码在代码中
- Cloudflare Workers 免费版每天 10 万次请求，完全够个人项目使用
