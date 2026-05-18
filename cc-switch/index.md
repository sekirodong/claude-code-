# CC Switch：多工具统一管理桌面应用

> 仓库：[farion1231/cc-switch](https://github.com/farion1231/cc-switch)  
> 最新版本：**v3.15.0**（2026-05-16）  
> 技术栈：Tauri 2 + React + TypeScript + Rust

CC Switch 是一款开源免费的桌面应用，提供统一的可视化界面，集中管理六款主流 AI CLI 工具。无需手动编辑配置文件，通过图形界面即可完成 API 提供商切换、MCP 服务管理、代理配置等全部操作。

## 支持的工具

| 工具 | 说明 | 本站教程 |
|------|------|----------|
| Claude Code | Anthropic 官方终端 AI 助手 | [查看](../claude-code/) |
| Codex CLI | OpenAI 官方终端代理工具 | [查看](../codex/) |
| Gemini CLI | Google Gemini 命令行工具 | — |
| OpenCode | 开源 AI 编程助手 | — |
| OpenClaw | 本地优先的个人 AI 代理框架 | [查看](../openclaw/) |
| Hermes Agent | Nous Research 自进化 AI 代理 | [查看](../hermes/) |

v3.14.0 新增 Hermes Agent 为第六款托管工具。

---

## 核心功能

### Provider 管理
- **50+ 内置预设**：涵盖 AWS Bedrock、NVIDIA NIM、社区中继站等主流提供商，选择即切换
- **一键导入**：扫码或粘贴链接导入第三方提供商配置
- **拖拽排序**：自定义提供商优先级列表

### 统一配置同步
- **一份配置同步多个应用**：写入 OpenCode、OpenClaw 的配置无需重复设置
- **系统托盘快速切换**：不打开主界面也能随时换源（v3.13.0 新增轻量模式，仅托盘运行）

### MCP 与 Skills 管理
- **4 款应用间双向同步** MCP 服务器配置
- **Deep Link 一键导入** MCP 服务
- 基于 GitHub 仓库的 Skills 安装与管理

### 本地代理功能
- 格式转换、自动故障转移、熔断器
- 提供商健康监控、请求修正器
- GitHub Copilot 反向代理（v3.12.3+）
- Gemini Native API 代理（v3.14.0+）
- Codex OAuth 反向代理（v3.13.0+）

### 云端同步
通过以下服务同步配置到多台设备：
- Dropbox
- OneDrive
- iCloud
- WebDAV 自定义服务器

### 用量追踪
- 实时显示各提供商配额与余额
- 成本分析面板
- 托盘显示缓存用量（v3.14.1+）

---

## 系统要求

| 平台 | 最低版本 |
|------|----------|
| Windows | Windows 10+ |
| macOS | macOS 12 Monterey+ |
| Linux | Ubuntu 22.04+ / Debian 11+ / Fedora 34+ |

---

## 下载与安装

::: warning 安全提示
仅从 [GitHub 官方 Releases 页面](https://github.com/farion1231/cc-switch/releases) 下载，项目方已发出警告存在仿冒网站。
:::

### Windows

**方案 A：MSI 安装包（推荐，支持自动更新）**

从 Releases 页面下载 `CC-Switch-v{version}-Windows.msi`，双击运行安装向导即可。安装完成后应用自动检测并安装新版本。

**方案 B：便携版 ZIP（无需安装）**

下载 `CC-Switch-v{version}-Windows-Portable.zip`，解压后直接运行 `CC-Switch.exe`，无需管理员权限，适合受限环境或 U 盘携带使用。

### macOS

**方案 A：Homebrew Cask（推荐，方便后续更新）**

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

后续更新：

```bash
brew upgrade --cask cc-switch
```

**方案 B：DMG 直接下载**

从 Releases 页面下载 `CC-Switch-v{version}-macOS.dmg`，挂载后将应用拖入 Applications 文件夹。

> 自 v3.12.3 起，DMG 已通过 Apple 代码签名和公证，不再出现"来自身份不明的开发者"警告，可直接打开。

### Linux

**方案 A：AppImage（通用，无需安装，推荐）**

```bash
# 下载 AppImage
wget https://github.com/farion1231/cc-switch/releases/latest/download/CC-Switch-v{version}.AppImage

# 添加可执行权限
chmod +x CC-Switch-v{version}.AppImage

# 直接运行
./CC-Switch-v{version}.AppImage
```

AppImage 是单文件可执行格式，无需安装，适用于所有主流 Linux 发行版。

**方案 B：DEB 包（Debian / Ubuntu）**

```bash
# 下载并安装
wget https://github.com/farion1231/cc-switch/releases/latest/download/CC-Switch-v{version}.deb
sudo dpkg -i CC-Switch-v{version}.deb

# 修复依赖（如有）
sudo apt install -f
```

**方案 C：RPM 包（Fedora / RHEL / openSUSE）**

```bash
# Fedora / RHEL
sudo rpm -i CC-Switch-v{version}.rpm
# 或
sudo dnf install CC-Switch-v{version}.rpm

# openSUSE
sudo zypper install CC-Switch-v{version}.rpm
```

**方案 D：AUR（Arch Linux）**

```bash
# 使用 paru
paru -S cc-switch-bin

# 使用 yay
yay -S cc-switch-bin
```

---

## 数据存储位置

所有配置均存储在用户主目录，便于备份和迁移：

| 文件 / 目录 | 说明 |
|-------------|------|
| `~/.cc-switch/cc-switch.db` | SQLite 主数据库，存储所有提供商配置 |
| `~/.cc-switch/settings.json` | 应用设置 |
| `~/.cc-switch/backups/` | 自动备份（保留最近 10 份） |
| `~/.cc-switch/skills/` | 已安装的 Skills |

> 数据库采用原子写入设计，切换提供商期间不会产生配置损坏。

---

## 版本历史摘要

| 版本 | 发布日期 | 主要更新 |
|------|----------|----------|
| v3.15.0 | 2026-05-16 | Claude Desktop 成为托管界面、第三方提供商代理网关、Codex OAuth 实时模型发现 |
| v3.14.1 | 2026-04-23 | Codex OAuth 稳定性修复、托盘用量显示、FAST 模式切换 |
| v3.14.0 | 2026-04-21 | 新增 Hermes Agent（第 6 款工具）、Claude Opus 4.7、Gemini Native API 代理 |
| v3.13.0 | 2026-04-10 | 轻量托盘模式、配额余额可视化、Codex OAuth 反向代理 |
| v3.12.3 | 2026-03-24 | GitHub Copilot 反向代理、macOS 代码签名与公证 |

---

## 与手动配置的对比

| 操作 | 手动方式 | CC Switch |
|------|----------|-----------|
| 切换 API 提供商 | 编辑各工具配置文件 | 托盘点击切换 |
| 同步多工具配置 | 手动复制粘贴 | 一份配置自动同步 |
| 管理 MCP 服务 | 逐个应用配置 | 统一面板双向同步 |
| 跨设备同步 | 手动传输文件 | 云同步自动完成 |
| 监控提供商健康 | 无 | 内置健康监控 |
