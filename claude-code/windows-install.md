# 多系统安装指南

本页覆盖 **Windows、macOS、Linux** 三个平台的 Claude Code 完整安装流程，包含各系统特有的权限处理方式和网络配置。

## 系统速览

| 系统 | Node.js 推荐方案 | 需要管理员/sudo |
|------|-----------------|----------------|
| Windows 10/11 | nvm-windows | 需要（首次配置） |
| macOS (Intel / Apple Silicon) | nvm via Homebrew | 不需要（nvm 安装后） |
| Linux (Ubuntu/Debian/Arch) | nvm 或发行版包管理器 | 不需要（nvm 安装后） |

**所有平台的统一安装命令**（完成 Node.js 配置后）：

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

---

## Windows

> 对应来源：Sora-bluesky/zenn-articles `claude-code-windows-install-guide.md`

### 前提条件

| 组件 | 版本要求 | 验证命令 |
|------|----------|----------|
| Node.js | 18.0+ | `node --version` |
| npm | 8.0+ | `npm --version` |
| Git for Windows | 最新版 | `git --version` |

### 第一步：安装 Git for Windows

1. 下载 Git for Windows 安装包
2. 安装时勾选 **"Git Bash Here"** 和 **"Add to PATH"**
3. 安装完成后重启 PowerShell：

```powershell
git --version
# 预期：git version 2.x.x.windows.x
```

### 第二步：安装 Node.js（推荐 nvm-windows）

nvm-windows 可以在不需要管理员权限的情况下管理多个 Node 版本，是 Windows 下最推荐的方式。

下载并安装 nvm-windows 后：

```powershell
# 安装 Node.js LTS
nvm install lts
nvm use lts

node --version   # v22.x.x 或更高
npm --version
```

如果直接下载 Node.js 安装包，需要以下额外操作：

```powershell
# 调整 PowerShell 执行策略（仅需一次）
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 第三步：以管理员身份安装 Claude Code

**方法 A：右键菜单**  
右键点击开始菜单 → "Windows PowerShell" → **"以管理员身份运行"**

**方法 B：快捷键**  
`Win + X` → **"终端(管理员)"**

验证管理员模式：

```powershell
[Security.Principal.WindowsIdentity]::GetCurrent().Groups -contains 'S-1-5-32-544'
# True = 管理员
```

在管理员 PowerShell 中安装：

```powershell
npm install -g @anthropic-ai/claude-code
claude --version
```

### 免管理员方案（推荐用于长期使用）

配置 npm 使用用户目录作为全局安装路径，彻底避免权限问题：

```powershell
# 设置自定义全局目录
$npmDir = "$env:APPDATA\npm-global"
New-Item -ItemType Directory -Force -Path $npmDir
npm config set prefix $npmDir

# 添加到用户 PATH（永久生效）
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;$npmDir", "User")

# 重新打开 PowerShell，再安装
npm install -g @anthropic-ai/claude-code
```

### 常见报错

| 报错信息 | 原因 | 解决方法 |
|----------|------|----------|
| `EACCES: permission denied` | 非管理员执行全局安装 | 切换管理员或配置免 sudo 方案 |
| `ENOENT: no such file or directory` | npm 全局路径不存在 | 执行 `New-Item -ItemType Directory -Force -Path (npm root -g)` |
| `npm warn deprecated` | 依赖弃用警告 | 可忽略，不影响安装 |
| `claude: command not found` | PATH 未包含 npm bin 目录 | 见下方 PATH 修复步骤 |

PATH 修复：

```powershell
# 查看 npm 全局路径
npm root -g

# 将 bin 目录加入 PATH
$npmBin = (npm root -g) -replace 'node_modules$', ''
[Environment]::SetEnvironmentVariable(
    "PATH",
    [Environment]::GetEnvironmentVariable("PATH", "User") + ";$npmBin",
    "User"
)
```

重新打开 PowerShell 后运行 `claude --version` 验证。

### 网络代理配置

国内网络访问 Anthropic API 通常需要代理：

```powershell
# 临时（当前 session 有效）
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
$env:HTTP_PROXY  = "http://127.0.0.1:7890"

# 永久（写入用户环境变量）
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("HTTP_PROXY",  "http://127.0.0.1:7890", "User")
```

### Windows Terminal 推荐配置

```powershell
# 安装 Windows Terminal（微软商店也可直接搜索安装）
winget install Microsoft.WindowsTerminal

# 安装 PowerShell 7（更好的 Unicode 和性能）
winget install Microsoft.PowerShell
```

安装后在 Windows Terminal 设置中将 PowerShell 7 设为默认 Shell。

---

## macOS

### 前提条件

| 组件 | 版本要求 |
|------|----------|
| macOS | 11 Big Sur+ |
| Node.js | 18.0+ |
| Xcode CLI Tools | 最新版（Homebrew 依赖） |

### 第一步：安装 Xcode 命令行工具

```bash
xcode-select --install
```

弹出安装窗口后点击"安装"，等待完成（约 5 分钟）。

### 第二步：安装 Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Apple Silicon（M 系列芯片）额外配置**：

```bash
# Homebrew 安装在 /opt/homebrew，需要手动加入 PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

验证：

```bash
brew --version
```

### 第三步：安装 nvm 和 Node.js

macOS 自带的 Node.js 版本通常过旧，通过 nvm 管理版本：

```bash
# 安装 nvm
brew install nvm
mkdir -p ~/.nvm

# 写入 shell 配置（zsh 用户）
cat >> ~/.zshrc << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && \. "$(brew --prefix)/opt/nvm/nvm.sh"
[ -s "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm"
EOF

# bash 用户将 ~/.zshrc 改为 ~/.bash_profile
source ~/.zshrc

# 安装并激活 Node.js LTS
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

node --version   # v22.x.x
```

### 第四步：安装 Claude Code

nvm 管理的 Node.js 写入用户目录，无需 `sudo`：

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

### 权限问题处理

若系统 Node（非 nvm 安装）执行全局安装时报 `EACCES`：

```bash
# 配置 npm 全局目录到用户目录（无需 sudo）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

npm install -g @anthropic-ai/claude-code
```

### 网络代理配置

```bash
# 临时设置
export HTTPS_PROXY="http://127.0.0.1:7890"
export HTTP_PROXY="http://127.0.0.1:7890"

# 永久写入（zsh）
echo 'export HTTPS_PROXY="http://127.0.0.1:7890"' >> ~/.zshrc
echo 'export HTTP_PROXY="http://127.0.0.1:7890"'  >> ~/.zshrc
```

---

## Linux

### Ubuntu / Debian

**方案 A：通过 nvm 安装（推荐，无需 sudo 全局安装）**

```bash
# 安装依赖
sudo apt update && sudo apt install -y curl git

# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc

# 安装 Node.js LTS
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

node --version && npm --version
```

**方案 B：通过 NodeSource 官方源安装**

```bash
# 添加 Node.js 22 官方源
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 配置 npm 全局目录（避免 sudo 全局安装）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**安装 Claude Code：**

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

### CentOS / RHEL / Amazon Linux

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc

nvm install --lts && nvm use --lts
npm install -g @anthropic-ai/claude-code
```

### Arch Linux

```bash
# 通过 pacman 安装 Node.js
sudo pacman -S nodejs npm

# 配置 npm 全局目录（避免 sudo）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

npm install -g @anthropic-ai/claude-code
```

### 服务器 / 无头环境

在无图形界面的服务器上，API 密钥通过环境变量注入：

```bash
export ANTHROPIC_API_KEY="sk-ant-..."

# 或写入 .bashrc / .bash_profile 永久生效
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
```

---

## API 密钥配置

三个平台安装完成后，通过以下方式之一配置 Anthropic API 密钥：

**方式 A：交互式配置**

```bash
claude
# 首次运行会引导完成 API 密钥配置
```

**方式 B：环境变量**

```bash
# macOS / Linux
export ANTHROPIC_API_KEY="sk-ant-..."

# Windows PowerShell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-...", "User")
```

---

## 验证清单

| 检查项 | 命令 | 预期结果 |
|--------|------|----------|
| Node.js 版本 | `node --version` | v18.x.x 或更高 |
| npm 版本 | `npm --version` | 8.x.x 或更高 |
| Git | `git --version` | git version 2.x.x |
| Claude Code | `claude --version` | claude-code x.x.x |
| API 连通性 | `claude "你好"` | 正常回复 |
