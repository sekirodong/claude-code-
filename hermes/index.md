# Hermes Agent 部署指南

> 仓库：[NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)  
> 最新版本：**v0.14.0**（2026-05-16，The Foundation Release）  
> 开源协议：MIT  
> 技术栈：Python + Node.js，多平台原生支持

Hermes Agent 是 Nous Research 开发的自进化 AI 代理框架。区别于普通 AI 助手，它内置了一个**学习闭环**：从每次使用中自动创建技能（Skills）、持续改进、并将知识跨会话持久化存储。支持从 $5 VPS 到 GPU 集群的灵活部署，通过 `hermes gateway` 接入 Telegram、Discord、WhatsApp 等 22 个消息平台。

---

## 系统要求

| 组件 | 说明 |
|------|------|
| 操作系统 | Linux、macOS、Windows（PowerShell，早期 Beta）、WSL2、Termux |
| Python | 自动安装（脚本内置 uv + Python 3.11） |
| Node.js | 脚本自动安装 |
| API 密钥 | Nous Portal、OpenRouter、OpenAI 等任意提供商 |

---

## 安装

### 方案 A：一键脚本安装（Linux / macOS / WSL2 / Termux）

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

脚本自动完成：
- 安装 `uv`（Python 版本管理器）
- 安装 Python 3.11
- 安装 Node.js
- 安装 ripgrep、ffmpeg
- 写入 shell 配置（PATH 等）
- 安装 `hermes-agent` 包

安装完成后验证：

```bash
hermes --version
```

### 方案 B：PowerShell 脚本（Windows 原生，早期 Beta）

以管理员身份打开 PowerShell：

```powershell
irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex
```

Windows 安装包内含：uv、Python 3.11、Node.js、ripgrep、ffmpeg 以及便携版 Git Bash，无需额外手动配置依赖。

::: tip Windows 用户推荐
Windows 上建议优先使用 WSL2 + 方案 A，原生 Windows 支持仍处于 Beta 阶段，稳定性不及 Linux/WSL2 环境。
:::

### 方案 C：pip 安装（Python 用户）

```bash
pip install hermes-agent

# 或使用 uv（推荐）
uv tool install hermes-agent
```

### 方案 D：从源码构建

```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent

# 安装依赖
uv sync

# 运行
uv run hermes
```

---

## 初始化配置

安装完成后运行配置向导：

```bash
hermes setup
```

向导将引导你完成：
1. 选择模型提供商
2. 配置 API 密钥
3. 设置工作区目录
4. （可选）配置消息平台 Gateway

### 快速选择模型提供商

```bash
hermes model
```

列出所有支持的提供商并交互式选择，切换提供商无需修改代码。

---

## 配置文件

配置文件路径：`~/.hermes/config.yaml`

### 最简配置

```yaml
provider: openrouter
model: openai/gpt-4o
api_key: sk-or-...
```

### 完整字段说明

```yaml
# 模型提供商配置
provider: nous-portal        # 提供商名称
model: hermes-3-70b          # 模型 ID
api_key: "your-api-key"      # API 密钥

# API 协议选择
protocol: chat_completions   # chat_completions | anthropic_messages | codex_responses | bedrock_converse

# 工作区
workspace: ~/.hermes/workspace

# 会话存储（SQLite + JSONL）
session_backend: sqlite

# 记忆文件路径
memory_file: ~/.hermes/MEMORY.md
user_file: ~/.hermes/USER.md

# Gateway 配置（可选）
gateway:
  port: 18790
  channels:
    telegram:
      token: "your-bot-token"
      allowlist:
        - "@yourusername"
```

### 支持的 API 协议

| 协议 | 适用场景 |
|------|----------|
| `chat_completions` | OpenAI 兼容端点（最广泛） |
| `anthropic_messages` | Anthropic Claude 原生 API |
| `codex_responses` | OpenAI Codex Responses API |
| `bedrock_converse` | AWS Bedrock |

---

## 支持的模型提供商（10+）

| 提供商 | 说明 |
|--------|------|
| **Nous Portal** | Nous Research 官方，Hermes 系列模型 |
| **OpenRouter** | 200+ 模型统一入口 |
| **NovitaAI** | 高性能推理 API |
| **NVIDIA NIM** | Nemotron 等 NVIDIA 模型 |
| **xAI** | Grok 系列（含 SuperGrok OAuth，v0.14.0+） |
| **OpenAI** | GPT-4o、o1 等 |
| **Kimi / Moonshot** | 月之暗面 |
| **MiniMax** | 国产大模型 |
| **Hugging Face** | 开源模型推理 |
| **LM Studio** | 本地模型（v0.12.0+） |
| **Azure AI Foundry** | 企业级 Azure 模型（v0.12.0+） |
| **自定义端点** | 任意 OpenAI 兼容接口 |

切换提供商：

```bash
hermes model
```

---

## 核心命令速查

```bash
hermes              # 启动交互式 CLI（终端 UI）
hermes setup        # 运行完整配置向导
hermes model        # 切换模型/提供商
hermes tools        # 配置启用的工具
hermes gateway      # 启动消息 Gateway
hermes update       # 更新到最新版本
```

### Gateway 消息平台支持（22 个）

| 类别 | 平台 |
|------|------|
| 即时通讯 | Telegram、WhatsApp、Signal、LINE、SimpleX Chat（v0.14.0+） |
| 团队协作 | Discord、Slack、Microsoft Teams（v0.14.0+）、Mattermost |
| 国内平台 | 微信、腾讯元宝（v0.13.0+）、飞书 |
| 开放协议 | Matrix、IRC |
| 邮件 | Gmail（Pub/Sub 模式） |
| 视频 | Twitch、Google Meet |
| 其他 | Google Chat（v0.13.0+）、WebChat |

启动 Gateway 并接入 Telegram：

```bash
hermes gateway
```

---

## 核心特性

### 自进化学习闭环

Hermes 在使用过程中自动创建和改进 Skills：

- 从成功的对话中提取可复用技能
- 后台 **Curator**（v0.12.0+）自动维护技能库质量
- 技能持久化存储，重启后继续可用
- 遵循 [agentskills.io](https://agentskills.io) 标准，与其他工具互通

### 持久记忆

```bash
# 查看/编辑记忆文件
cat ~/.hermes/MEMORY.md   # 知识记忆
cat ~/.hermes/USER.md     # 用户偏好记忆
```

CC Switch 提供图形化的记忆文件编辑界面。

### 多 Agent Kanban（v0.13.0+）

```bash
hermes agent --message "并行完成以下三个任务：..." --thinking high

# 查看任务看板
/goal 保持项目重构专注
```

### 会话搜索（FTS5 全文索引）

所有历史会话通过 SQLite FTS5 建立全文索引，毫秒级检索历史对话。

---

## 与 CC Switch 集成

CC Switch v3.14.0 将 Hermes Agent 纳入统一管理（第 6 款应用），支持：

- 图形化切换 API 提供商（无需手动编辑 `config.yaml`）
- `~/.hermes/config.yaml` 原子备份写入
- MEMORY.md / USER.md 可视化编辑
- MCP 服务器和 Skills 跨应用同步
- 约 50 个提供商预设（含 DeepSeek、Together AI、StepFun）

---

## 版本历史

| 版本 | 发布日期 | 代号 | 主要更新 |
|------|----------|------|----------|
| v0.14.0 | 2026-05-16 | The Foundation Release | xAI Grok SuperGrok OAuth、OpenAI 兼容本地代理、Microsoft Teams、LINE + SimpleX、180x 更快的 CDP |
| v0.13.0 | 2026-05-07 | The Tenacity Release | 多 Agent Kanban、`/goal` 命令、视频分析、xAI 自定义语音、7 语言 i18n、Google Chat |
| v0.12.0 | 2026-04-30 | The Curator Release | 自主后台 Curator、LM Studio / Azure AI / GMI / MiniMax 接入、Spotify 集成、TUI 启动提速 57% |

---

## 安全注意事项

Hermes Agent 具备高度的系统自主性，部署前请注意：

- **沙箱隔离**：生产环境建议在独立 VM 或容器中运行
- **技能审核**：仅安装来自官方或可信来源的 Skills
- **API 密钥保护**：确保 `config.yaml` 文件权限为 `600`（仅当前用户可读）

```bash
chmod 600 ~/.hermes/config.yaml
```

---

## 验证清单

```bash
hermes --version       # 已安装版本（v0.14.0+）
hermes model           # 提供商配置正常
hermes "你好"          # 基础对话测试
hermes tools           # 工具配置检查
```
