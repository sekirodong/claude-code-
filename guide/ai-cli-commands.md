# AI CLI 常用命令与 Token 中转站指南

> 适合已经完成 Node.js / Python 环境准备的用户快速查阅。本文汇总 Claude Code、Codex CLI、Hermes Agent、OpenClaw 的高频命令、典型使用场景，以及国内网络环境下更稳定的 Token / API 中转方案。

## 四款工具怎么选

| 工具 | 适合场景 | 安装方式 | 配置入口 | 运行特点 |
|------|----------|----------|----------|----------|
| Claude Code | 多文件代码修改、项目级重构、长上下文任务 | `npm install -g @anthropic-ai/claude-code` | `claude config` / 环境变量 | 官方 CLI，适合在真实项目目录内交互式开发 |
| Codex CLI | OpenAI 模型驱动的终端 Agent、tmux 多 Agent 编排 | `npm install -g @openai/codex` | `codex login` / 环境变量 | 推荐 WSL2 / Linux 环境，适合自动化脚本化任务 |
| Hermes Agent | 自进化 Skills、跨会话记忆、消息平台 Gateway | `curl ... | bash` / `pip install hermes-agent` | `hermes setup` / `~/.hermes/config.yaml` | Python + Node.js，强调学习闭环和多平台接入 |
| OpenClaw | 自托管个人 AI 助手、消息平台聚合、本地 Gateway | `npm install -g openclaw@latest` | `openclaw onboard` / `~/.openclaw/openclaw.json` | 本地优先，支持 WhatsApp / Telegram / Discord 等频道 |

---

## Claude Code 常用命令

### 安装与登录

```bash
npm install -g @anthropic-ai/claude-code
claude --version
claude --help

# 使用官方 Anthropic API Key
claude config set apiKey YOUR_ANTHROPIC_API_KEY
```

### 日常使用

```bash
# 在项目目录启动交互会话
cd your-project
claude

# 单次问答 / 单次任务
claude "解释这个项目的目录结构"
claude "阅读 package.json，告诉我如何启动开发服务器"
claude "修复当前项目里的 TypeScript 类型错误，并说明改动"

# 让 Claude 先规划再执行
claude "先分析问题并给出修改计划，等我确认后再改代码"
```

### 项目上下文与记忆

```bash
# 在项目根目录创建团队约定
cat > CLAUDE.md <<'EOF'
# 项目说明
- 使用 TypeScript + Vite
- 提交前运行 npm run build
- 不要修改 .env.example 里的字段名
EOF

# 启动后 Claude Code 会自动读取 CLAUDE.md
claude
```

常用上下文技巧：

```text
@src/main.ts 解释这个入口文件
@package.json @vite.config.ts 帮我检查构建配置
@docs/README.md 根据文档补充安装步骤
```

### 配置与更新

```bash
claude config list
claude config get apiKey
claude config set apiKey YOUR_NEW_KEY
npm update -g @anthropic-ai/claude-code
```

::: tip 使用建议
- 大范围改动前先让 Claude Code 输出计划，确认后再执行。
- 优先 `@` 精准引用文件，避免把无关目录塞进上下文。
- 操作失误时可连续双击 `Esc` 回退上一轮对话。
:::

---

## OpenAI Codex CLI 常用命令

### 安装与登录

```bash
npm install -g @openai/codex
codex --version
codex login
```

Windows 用户建议在 WSL2 / Ubuntu 中安装和运行：

```bash
wsl --install -d Ubuntu
# 进入 WSL 后安装 Node.js 22+，再执行 npm install -g @openai/codex
```

### 日常使用

```bash
# 交互式启动
codex

# 单次任务
codex "列出当前目录下所有 Python 文件"
codex "检查这个项目的测试命令，并运行最小测试集"
codex "为 README 增加安装说明"

# 指定工作目录
codex --cwd /path/to/project "分析项目结构并给出改进建议"
```

### 自动化与非交互环境

```bash
# tmux / Docker / CI 中推荐关闭 alt screen，避免终端卡住
codex --no-alt-screen "执行代码审查"

# 提高自动化程度前，确认当前目录没有敏感文件或未提交重要改动
codex --no-alt-screen --approval-mode full-auto "运行测试并修复失败用例"
```

### tmux 多 Agent 示例

```bash
tmux new-session -d -s codex-agents

tmux new-window -t codex-agents -n "frontend"
tmux send-keys -t codex-agents:frontend \
  'codex --no-alt-screen --cwd /app/frontend "修复前端 lint 错误"' Enter

tmux new-window -t codex-agents -n "backend"
tmux send-keys -t codex-agents:backend \
  'codex --no-alt-screen --cwd /app/backend "为 API 补充输入校验"' Enter

tmux attach-session -t codex-agents
```

::: warning 自动模式注意
`--approval-mode full-auto` 会显著减少确认步骤，只建议在隔离仓库、容器或已备份的工作区中使用。
:::

---

## Hermes Agent 常用命令

### 安装

```bash
# Linux / macOS / WSL2 / Termux
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Windows PowerShell（Beta）
irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex

# Python 用户手动安装
pip install hermes-agent
# 或
uv tool install hermes-agent
```

### 初始化与模型配置

```bash
hermes --version
hermes setup          # 完整配置向导
hermes model          # 切换模型 / API 提供商
hermes tools          # 配置可用工具
```

配置文件位置：

```bash
~/.hermes/config.yaml
```

最简配置示例：

```yaml
provider: openrouter
model: openai/gpt-4o
api_key: sk-or-...
protocol: chat_completions
workspace: ~/.hermes/workspace
```

### 日常使用

```bash
hermes                         # 启动交互式 TUI
hermes "你好，帮我规划今天的开发任务"
hermes agent --message "并行完成代码审查、测试分析、文档补全" --thinking high
```

### Gateway 与记忆

```bash
hermes gateway                 # 启动消息平台 Gateway
cat ~/.hermes/MEMORY.md        # 查看知识记忆
cat ~/.hermes/USER.md          # 查看用户偏好
hermes update                  # 更新到最新版
```

::: tip 使用建议
Hermes 的优势在于 Skills 和长期记忆。适合长期运行在个人 VPS / 工作机上，把高频工作流沉淀为可复用技能。
:::

---

## OpenClaw 常用命令

### 安装与初始化

```bash
npm install -g openclaw@latest
openclaw --version

# 初始化并安装守护进程
openclaw onboard --install-daemon
```

Windows 用户建议在 WSL2 中运行；OpenClaw 对 Node.js 要求较高，推荐 Node.js 22.19+ 或 24。

### Gateway 与控制台

```bash
# 仅启动 Gateway，不安装系统服务
openclaw gateway --port 18789 --verbose

# 打开本地控制台
openclaw dashboard
```

### 对话、消息与系统管理

```bash
# 命令行直接给 Agent 发任务
openclaw agent --message "帮我整理今天的工作清单" --thinking high

# 发送消息到已配置频道
openclaw message send --target +8613800000000 --message "Hello"

# 健康检查与更新
openclaw doctor
openclaw update

# 批准新设备配对
openclaw pairing approve telegram abc123
```

### 聊天内快捷命令

| 命令 | 功能 |
|------|------|
| `/status` | 查看当前会话状态 |
| `/new` | 开始新会话 |
| `/reset` | 清空上下文 |
| `/think low\|medium\|high` | 调整推理深度 |
| `/verbose on\|off` | 切换详细日志 |
| `/restart` | 重启 Agent |

::: danger 安全提醒
OpenClaw 能读写文件、执行命令、接入消息平台。生产使用建议放在独立 VM / 容器中，并保持默认 `dmPolicy: "pairing"`，不要把未知用户加入 allowlist。
:::

---

## Token 中转站推荐：AstrlinkAI

国内网络直连 Anthropic / OpenAI / OpenRouter 等 API 时，常见问题包括连接超时、支付门槛高、余额管理分散。推荐使用 **AstrlinkAI Token 中转站**：

- 入口：<https://app.astrlinkai.xyz/>
- 适合：Claude Code、Codex CLI、Hermes Agent、OpenClaw、各类 OpenAI / Anthropic 兼容 SDK
- 优点：统一充值、统一 Key 管理、国内访问更稳定、适合多工具共用同一套 API 预算

::: warning 价格说明
AstrlinkAI 首页当前对未登录访问返回 403，价格表需要以登录后后台实际展示为准。下面保留价格表模板，更新笔记时可按后台「模型价格 / 计费倍率」页面填写最新数据。
:::

### 推荐接入方式

多数中转站会提供两类端点：

| 协议 | 常见用途 | 配置位置 |
|------|----------|----------|
| OpenAI Compatible / Chat Completions | Codex CLI、Hermes、OpenClaw、自定义 SDK | `OPENAI_API_KEY`、`OPENAI_BASE_URL` 或工具配置文件 |
| Anthropic Messages Compatible | Claude Code、Anthropic SDK、Hermes `anthropic_messages` | `ANTHROPIC_API_KEY`、`ANTHROPIC_BASE_URL` 或工具配置文件 |

通用环境变量示例：

```bash
# OpenAI 兼容工具
export OPENAI_API_KEY="sk-你的AstrlinkAI密钥"
export OPENAI_BASE_URL="https://你的中转站API地址/v1"

# Anthropic 兼容工具
export ANTHROPIC_API_KEY="sk-你的AstrlinkAI密钥"
export ANTHROPIC_BASE_URL="https://你的中转站API地址"
```

PowerShell 示例：

```powershell
$env:OPENAI_API_KEY = "sk-你的AstrlinkAI密钥"
$env:OPENAI_BASE_URL = "https://你的中转站API地址/v1"
$env:ANTHROPIC_API_KEY = "sk-你的AstrlinkAI密钥"
$env:ANTHROPIC_BASE_URL = "https://你的中转站API地址"
```

### 价格表模板

| 模型 / 服务 | 输入价格 | 输出价格 | 计费单位 | 适合工具 | 备注 |
|-------------|----------|----------|----------|----------|------|
| Claude Sonnet 系列 | 登录后台查看 | 登录后台查看 | 通常按 1M tokens 或倍率计费 | Claude Code / Hermes / OpenClaw | 适合日常编码、文档、重构 |
| Claude Opus 系列 | 登录后台查看 | 登录后台查看 | 通常按 1M tokens 或倍率计费 | Claude Code | 适合复杂架构设计和高难调试 |
| GPT-4o / GPT-4.1 系列 | 登录后台查看 | 登录后台查看 | 通常按 1M tokens 或倍率计费 | Codex CLI / Hermes / OpenClaw | 适合通用 Agent 与多模态任务 |
| o 系列推理模型 | 登录后台查看 | 登录后台查看 | 通常按 1M tokens 或倍率计费 | Codex CLI | 适合高推理强度任务 |
| Embedding / Rerank | 登录后台查看 | 登录后台查看 | 通常按 1M tokens 或请求计费 | 自建知识库 | 适合检索增强和语义搜索 |

### 使用建议

1. **先小额充值测试**：确认 Claude Code / Codex / Hermes / OpenClaw 都能正常连通后再提高额度。
2. **按工具拆分 Key**：为不同工具创建独立 API Key，便于统计用量和快速停用。
3. **不要提交密钥**：`.env`、`config.yaml`、`openclaw.json` 中的 Key 不要提交到 Git。
4. **关注上下文长度**：长上下文 Agent 会显著增加 token 消耗，先让工具输出计划再执行可降低返工成本。
