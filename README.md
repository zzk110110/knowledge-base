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


