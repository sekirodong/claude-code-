# 多系统安装教程

> 来源：[QuantumNous/new-api-docs](https://github.com/QuantumNous/new-api-docs)  
> 覆盖 Windows（WSL2 方案）、macOS（Homebrew 方案）、Linux 三个平台的完整安装流程，附各系统一键配置脚本。

::: tip 前置环境
Codex CLI 要求 Node.js **22+**。如果你还没有安装 Node.js / npm，请先阅读 **[环境准备指南](../guide/prerequisites)**。
:::

## 系统选择建议

| 系统 | 推荐方案 | 原因 |
|------|----------|------|
| Windows 10/11 | **WSL2 + Ubuntu**（强烈推荐） | 获得原生 Linux 终端性能，避免 Windows 路径和权限兼容问题 |
| Windows（不启用 WSL2） | PowerShell + nvm-windows | 适合无法或不想安装 WSL2 的场景 |
| macOS Intel / Apple Silicon | 原生 Terminal + Homebrew + nvm | 原生 Unix 环境，无需额外层 |
| Linux Ubuntu/Debian | nvm 或 NodeSource 源 | 直接安装，最简流程 |
| Linux CentOS/RHEL/Arch | nvm | 统一方案，跨发行版兼容 |

**Codex CLI 前提条件**：Node.js **22+**（高于 Claude Code 的 18+ 要求）

---

## Windows 方案一：WSL2（强烈推荐）

WSL2 在 Windows 内提供完整的 Linux 内核，Codex CLI 在此环境下具备最佳兼容性。

### 启用 WSL2

以管理员身份打开 PowerShell：

```powershell
# Windows 11 / Windows 10 2004+ 一键安装
wsl --install

# 指定发行版（推荐 Ubuntu 22.04）
wsl --install -d Ubuntu-22.04
```

安装完成后**重启电脑**。重启后 Ubuntu 自动打开，按提示设置用户名和密码。

验证 WSL2 已正确安装：

```powershell
wsl --status
# 预期：Default Version: 2
```

### 在 WSL2 内安装 Node.js 22

```bash
# 更新包列表
sudo apt update && sudo apt upgrade -y

# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc

# 安装并激活 Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# 验证
node --version   # v22.x.x
npm --version    # 10.x.x
```

### 安装 Codex CLI

```bash
npm install -g @openai/codex
codex login   # 输入 OpenAI API 密钥
codex --version
```

### 配置 Windows Terminal 集成

安装 [Windows Terminal](https://apps.microsoft.com/detail/9n0dx20hk701)，在设置中将 **Ubuntu (WSL)** 设为默认配置文件，获得更好的终端体验。

### 一键配置脚本（WSL2 方案）

将以下内容保存为 `setup-codex-wsl.ps1`，在管理员 PowerShell 中执行：

```powershell
# WSL2 + Codex CLI 一键配置脚本
# 适用于 Windows 10 2004+ / Windows 11

Write-Host "=== Codex CLI WSL2 Setup ===" -ForegroundColor Cyan

# 检查 WSL 是否可用
$wslAvailable = Get-Command wsl -ErrorAction SilentlyContinue
if (-not $wslAvailable) {
    Write-Host "正在启用 WSL2，安装完成后需要重启..." -ForegroundColor Yellow
    wsl --install -d Ubuntu-22.04
    Write-Host "请重启电脑，然后重新运行此脚本" -ForegroundColor Red
    exit 1
}

# 检查 WSL 默认版本
$wslVersion = (wsl --status 2>&1) | Select-String "Default Version"
Write-Host "WSL 状态：$wslVersion" -ForegroundColor Gray

# 在 WSL 内执行安装
Write-Host "在 WSL2 内安装 Node.js 22 和 Codex CLI..." -ForegroundColor Yellow

wsl bash -c @'
set -e
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 安装 Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# 安装 Codex CLI
npm install -g @openai/codex

echo ""
echo "安装完成！版本信息："
node --version
npm --version
codex --version
echo ""
echo "请运行 'codex login' 绑定 OpenAI API 密钥"
'@

Write-Host "=== 配置完成 ===" -ForegroundColor Green
Write-Host "打开 Ubuntu WSL 终端，运行 'codex login' 完成初始化" -ForegroundColor Cyan
```

---

## Windows 方案二：原生 PowerShell（不使用 WSL2）

若无法启用 WSL2，可在原生 Windows 环境中安装，但需注意部分功能可能受限。

### 安装 nvm-windows

下载并安装 nvm-windows，然后在**管理员 PowerShell** 中：

```powershell
# 安装 Node.js 22
nvm install 22.0.0
nvm use 22.0.0

node --version
npm --version
```

### 配置 npm 全局目录（避免管理员权限依赖）

```powershell
$npmDir = "$env:APPDATA\npm-global"
New-Item -ItemType Directory -Force -Path $npmDir
npm config set prefix $npmDir

$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;$npmDir", "User")

# 重新打开 PowerShell
```

### 安装 Codex CLI

```powershell
npm install -g @openai/codex
$env:OPENAI_API_KEY = "sk-..."
codex --version
```

---

## macOS

### 第一步：安装 Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Apple Silicon（M1/M2/M3/M4）额外配置**：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

验证：`brew --version`

### 第二步：通过 nvm 安装 Node.js 22

```bash
# 安装 nvm
brew install nvm
mkdir -p ~/.nvm

# 写入 shell 配置
cat >> ~/.zshrc << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && \. "$(brew --prefix)/opt/nvm/nvm.sh"
[ -s "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm"
EOF

# bash 用户改为 ~/.bash_profile
source ~/.zshrc

# 安装 Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

node --version   # v22.x.x
```

### 第三步：安装 Codex CLI

nvm 管理的 Node 默认写入用户目录，无需 `sudo`：

```bash
npm install -g @openai/codex
codex login
codex --version
```

### 处理 `sudo npm install -g` 权限问题

如果使用系统 Node（非 nvm）并遇到权限报错：

```bash
# 配置用户级全局目录（推荐，永久解决）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
npm install -g @openai/codex
```

### 一键配置脚本（macOS）

```bash
#!/bin/bash
# macOS Codex CLI 一键安装脚本
set -e

echo "=== Codex CLI macOS Setup ==="

# 检查 Homebrew
if ! command -v brew &>/dev/null; then
    echo "安装 Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Apple Silicon 配置 PATH
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi

# 安装 nvm
brew install nvm 2>/dev/null || brew upgrade nvm 2>/dev/null || true
mkdir -p ~/.nvm

# 检测 shell 配置文件
SHELL_RC="$HOME/.zshrc"
[[ "$SHELL" == *bash* ]] && SHELL_RC="$HOME/.bash_profile"

# 写入 nvm 配置（幂等）
grep -q 'NVM_DIR' "$SHELL_RC" 2>/dev/null || cat >> "$SHELL_RC" << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && \. "$(brew --prefix)/opt/nvm/nvm.sh"
[ -s "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm"
EOF

# 加载 nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && \. "$(brew --prefix)/opt/nvm/nvm.sh"

# 安装 Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# 安装 Codex CLI
npm install -g @openai/codex

echo ""
echo "=== 安装完成 ==="
echo "Node.js: $(node --version)"
echo "npm:     $(npm --version)"
echo "Codex:   $(codex --version)"
echo ""
echo "请运行 'codex login' 绑定 OpenAI API 密钥"
```

---

## Linux

### Ubuntu / Debian（推荐 nvm 方案）

```bash
# 安装基础依赖
sudo apt update && sudo apt install -y curl git build-essential

# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc

# 安装 Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# 安装 Codex CLI
npm install -g @openai/codex
codex login
```

**备选：NodeSource 官方源**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 配置无 sudo 全局目录
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

npm install -g @openai/codex
```

### CentOS / RHEL / Amazon Linux

```bash
# Amazon Linux 2023
sudo dnf install -y curl git

# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc

nvm install 22 && nvm use 22
npm install -g @openai/codex
```

### Arch Linux

```bash
# 安装 Node.js（Arch 官方源通常为最新版）
sudo pacman -S nodejs npm git

# 无 sudo 全局目录
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

npm install -g @openai/codex
```

---

## 自定义 API 端点配置

使用第三方 API 代理服务时，需修改 Codex CLI 配置文件。

### Shell 版本（macOS / Linux / WSL）

```bash
#!/bin/bash
CODEX_CONFIG="$HOME/.codex/config.json"
mkdir -p "$(dirname "$CODEX_CONFIG")"

cat > "$CODEX_CONFIG" << EOF
{
  "apiKey": "${OPENAI_API_KEY:-your-api-key-here}",
  "baseURL": "https://your-proxy.example.com/v1",
  "model": "gpt-4o"
}
EOF

echo "配置已写入：$CODEX_CONFIG"
```

### PowerShell 版本（Windows）

```powershell
$ConfigDir  = "$env:USERPROFILE\.codex"
$ConfigFile = "$ConfigDir\config.json"

New-Item -ItemType Directory -Force -Path $ConfigDir | Out-Null

@{
    apiKey  = if ($env:OPENAI_API_KEY) { $env:OPENAI_API_KEY } else { "your-api-key-here" }
    baseURL = "https://your-proxy.example.com/v1"
    model   = "gpt-4o"
} | ConvertTo-Json | Out-File -FilePath $ConfigFile -Encoding utf8

Write-Host "配置已写入：$ConfigFile"
Get-Content $ConfigFile
```

---

## 验证清单

所有平台安装完成后逐项核查：

| 检查项 | 命令 | 预期结果 |
|--------|------|----------|
| Node.js 版本 | `node --version` | v22.x.x 或更高 |
| npm 版本 | `npm --version` | 10.x.x |
| Codex CLI | `codex --version` | codex x.x.x |
| 功能验证 | `codex "列出当前目录的文件"` | 正常执行并输出结果 |
