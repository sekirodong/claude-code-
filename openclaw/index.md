# OpenClaw 部署指南

> 仓库：[openclaw/openclaw](https://github.com/openclaw/openclaw)  
> 最新版本：v2026.5.16（beta 阶段）  
> 定位：本地优先的个人 AI 助手，接入你已在使用的 20+ 消息平台

OpenClaw 是一款自托管的个人 AI 代理框架，核心理念是"在你已经使用的频道上直接回答你"。它在本地运行 Gateway 守护进程，统一管理所有消息频道、工具调用和会话历史，支持跨设备访问 WhatsApp、Telegram、Discord 等 20 余个平台，并能自主执行终端命令、读写文件和自动化工作流。

---

## 系统要求

| 组件 | 版本要求 |
|------|----------|
| Node.js | **24**（推荐）或 22.19+ |
| 操作系统 | macOS、Linux、Windows（WSL2） |
| 包管理器 | npm、pnpm 或 bun |
| API 密钥 | 任意模型提供商（OpenAI、Anthropic、本地模型等） |

::: warning Windows 用户
OpenClaw 在 Windows 原生 PowerShell 下不受支持，请先安装 WSL2，在 Ubuntu 环境中执行所有操作。WSL2 安装参考：[Codex 多系统安装教程 → Windows WSL2 方案](../codex/multi-system-install)。
:::

---

## 安装

### 方案 A：npm 全局安装（推荐）

```bash
npm install -g openclaw@latest

# 验证安装
openclaw --version
```

### 方案 B：pnpm 全局安装

```bash
pnpm add -g openclaw@latest
```

### 方案 C：从源码构建（开发者）

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw

pnpm install
pnpm openclaw setup
pnpm gateway:watch
```

### 切换发布渠道

OpenClaw 提供三个发布渠道：

| 渠道 | npm dist-tag | 说明 |
|------|-------------|------|
| `stable` | `latest` | 正式版，推荐生产使用 |
| `beta` | `beta` | 预发布版，功能更新更快 |
| `dev` | `dev` | 跟踪 `main` 分支，最新但不稳定 |

```bash
# 切换到 beta 渠道
openclaw update --channel beta

# 切换回 stable
openclaw update --channel stable
```

---

## 初始化配置

安装完成后，运行交互式初始化向导：

```bash
openclaw onboard --install-daemon
```

该命令完成以下操作：
- 在 **macOS** 注册 launchd 用户服务（开机自启）
- 在 **Linux** 注册 systemd 用户服务
- 创建初始配置文件 `~/.openclaw/openclaw.json`
- 引导你配置模型提供商和 API 密钥
- 设置工作区目录（默认 `~/.openclaw/workspace`）

### 仅启动 Gateway（不安装守护进程）

```bash
openclaw gateway --port 18789 --verbose
```

---

## 配置文件

配置文件路径：`~/.openclaw/openclaw.json`（JSON5 格式，支持注释）

### 最简配置

```json5
{
  agent: {
    model: "openai/gpt-4o",   // 格式：<provider>/<model-id>
  },
}
```

### 完整字段说明

```json5
{
  agent: {
    model: "anthropic/claude-sonnet-4-6",  // 模型选择
    workspace: "~/.openclaw/workspace",     // 工作区路径
    sandbox: "docker",                      // 沙箱后端：docker / ssh / openShell
  },

  // 频道 DM 策略（默认 pairing 安全模式）
  dmPolicy: "pairing",  // "pairing" | "open"

  // 频道配置（每个频道独立配置）
  channels: {
    telegram: {
      allowlist: ["@yourusername"],  // 允许访问的用户
    },
    discord: {
      allowlist: ["*"],  // * 表示所有人（谨慎使用）
    },
  },
}
```

---

## 启动控制台

```bash
openclaw dashboard
```

在浏览器中打开生成的本地地址，进入可视化管理界面。在聊天页面输入 `Hello`，收到 AI 回复即表示部署成功。

---

## 支持的消息频道（20+）

| 类别 | 平台 |
|------|------|
| 即时通讯 | WhatsApp、Telegram、Signal、LINE、Zalo、WeChat、QQ |
| 团队协作 | Slack、Discord、Microsoft Teams、Feishu（飞书）、Mattermost |
| 开放协议 | Matrix、IRC、Nostr |
| 云服务 | Google Chat、Synology Chat、Nextcloud Talk |
| 流媒体 | Twitch |
| 其他 | Tlon、WebChat |
| 语音 | macOS / iOS / Android 语音唤醒 + 对话模式 |

---

## 常用命令速查

### 对话与任务

```bash
# 向助手发送消息（命令行直接调用）
openclaw agent --message "帮我整理今天的工作清单" --thinking high

# 向指定号码发送消息（需已配置对应频道）
openclaw message send --target +8613800000000 --message "Hello"
```

### 聊天内快捷命令

| 命令 | 功能 |
|------|------|
| `/status` | 查看当前会话状态 |
| `/new` | 开始新会话 |
| `/reset` | 清空上下文 |
| `/think <level>` | 调整推理深度（low / medium / high） |
| `/verbose on\|off` | 切换详细日志 |
| `/restart` | 重启 Agent |

### 系统管理

```bash
openclaw doctor          # 健康检查，识别安全风险配置
openclaw update          # 更新到最新版本
openclaw pairing approve <channel> <code>   # 批准新设备配对
```

---

## 安全配置指南

::: danger 高权限工具的供应链风险
OpenClaw 具备极高的系统自主性（读取本地文件、修改代码、执行脚本），安全社区已发现针对其第三方技能的供应链攻击案例。
:::

### DM 配对策略（默认安全模式）

默认 `dmPolicy: "pairing"` 要求所有未知发件人完成配对验证，未经授权的消息会被直接忽略。

批准新设备：

```bash
openclaw pairing approve telegram abc123
```

**不要**将 `dmPolicy` 设为 `"open"` 并在 `allowlist` 填入 `"*"`，除非你完全信任所有可能向 bot 发消息的人。

### 沙箱隔离（强烈推荐）

非主会话默认在 Docker 沙箱中运行，限制以下工具的访问：

- **允许**：bash、process、read、write、edit、sessions 命令
- **禁止**：browser、canvas、cron、Discord/Slack 操作

确保 Docker 已安装并运行：

```bash
docker --version
openclaw doctor   # 检查沙箱配置状态
```

### 部署建议

- **隔离运行**：在独立虚拟机或容器中部署，避免直接访问含敏感数据的主机
- **控制权限范围**：不要授予数字钱包、核心源码目录的无限制操作权限
- **只用官方技能**：切勿安装未经官方审核的第三方技能，防止恶意代码窃取环境变量或 API 令牌
- **定期运行检查**：`openclaw doctor` 会主动识别危险配置

---

## Session 工具命令

```bash
sessions_list      # 列出所有会话
sessions_history   # 查看会话历史
sessions_send      # 向指定会话发送消息
```

---

## 数据存储位置

| 路径 | 内容 |
|------|------|
| `~/.openclaw/openclaw.json` | 主配置文件 |
| `~/.openclaw/workspace/` | Agent 工作区（文件读写默认目录） |
| `~/.openclaw/skills/` | 已安装的 Skills |

---

## 验证清单

```bash
node --version                       # v22.19+ 或 v24.x
openclaw --version                   # 已安装版本
openclaw doctor                      # 健康状态检查
openclaw gateway --port 18789        # Gateway 启动测试
openclaw dashboard                   # 控制台访问测试
```
