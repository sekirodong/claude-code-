# 环境准备：安装 npm / Node.js / pip

在安装任何 AI CLI 工具之前，需要先配置好运行时环境。本页覆盖 **Windows、macOS、Linux** 三平台的完整前置工具安装流程。

## 工具与版本要求速览

| 工具 | 用途 | 最低版本 | 推荐版本 |
|------|------|----------|----------|
| Node.js | Claude Code、Codex、OpenClaw 运行时 | 18+ | **22 LTS** |
| npm | Node.js 全局包管理器（随 Node 附带） | 8+ | 10+ |
| pnpm | npm 替代品（可选，OpenClaw 推荐） | 8+ | 最新 |
| Python | Hermes Agent 运行时 | 3.10+ | **3.11**（脚本自动安装） |
| pip / uv | Python 包管理器 | — | uv（推荐） |
| Git | 版本控制，部分工具依赖 | 2.x | 最新 |

---

## Node.js 与 npm

npm 随 Node.js 一同安装，**不需要单独安装**。选择适合你系统的方案：

### Windows

#### 方案 A：nvm-windows（推荐，可免管理员权限）

nvm-windows 是 Windows 下最成熟的 Node.js 版本管理器：

1. 前往 [github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) 下载最新版 `nvm-setup.exe`
2. 双击安装，全程默认即可
3. 安装完成后打开新的 PowerShell 窗口，执行：

```powershell
# 查看可用版本
nvm list available

# 安装并激活 Node.js LTS（推荐）
nvm install lts
nvm use lts

# 验证
node --version   # v22.x.x
npm --version    # 10.x.x
```

切换版本：

```powershell
nvm install 20.0.0    # 安装指定版本
nvm use 20.0.0        # 切换到该版本
nvm list              # 查看已安装版本
```

#### 方案 B：Node.js 官方安装包

1. 前往 [nodejs.org](https://nodejs.org/zh-cn/download) 下载 Windows 安装包（`.msi`）
2. 双击安装，勾选 **"Add to PATH"**
3. 安装完成后重新打开 PowerShell：

```powershell
node --version
npm --version
```

安装后若 npm 全局命令报权限错误，配置无需管理员的全局目录：

```powershell
# 设置用户目录作为全局安装路径
$npmDir = "$env:APPDATA\npm-global"
New-Item -ItemType Directory -Force -Path $npmDir
npm config set prefix $npmDir

# 写入用户 PATH（永久生效，需重开 PowerShell）
$cur = [Environment]::GetEnvironmentVariable("PATH","User")
[Environment]::SetEnvironmentVariable("PATH","$cur;$npmDir","User")
```

#### 方案 C：winget 一键安装

```powershell
# 安装 Node.js LTS
winget install OpenJS.NodeJS.LTS

# 重新打开 PowerShell 后验证
node --version
npm --version
```

---

### macOS

#### 方案 A：Homebrew + nvm（推荐）

先安装 Homebrew（macOS 包管理器）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Apple Silicon（M1/M2/M3/M4）额外配置**：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

再通过 Homebrew 安装 nvm，并安装 Node.js：

```bash
brew install nvm
mkdir -p ~/.nvm

# 写入 shell 配置（zsh，macOS 默认）
cat >> ~/.zshrc << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && \. "$(brew --prefix)/opt/nvm/nvm.sh"
[ -s "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm"
EOF

source ~/.zshrc

# 安装 Node.js LTS
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

node --version   # v22.x.x
npm --version
```

**bash 用户**：将 `~/.zshrc` 替换为 `~/.bash_profile`。

#### 方案 B：Node.js 官方安装包（最简单）

前往 [nodejs.org](https://nodejs.org/zh-cn/download) 下载 macOS `.pkg` 安装包，双击安装，自动配置 PATH。

#### 方案 C：Homebrew 直接安装 Node.js

```bash
brew install node@22
echo 'export PATH="$(brew --prefix node@22)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

### Linux

#### Ubuntu / Debian

**方案 A：nvm（推荐，无需 sudo 全局安装）**

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

**方案 B：NodeSource 官方 APT 源（系统级安装）**

```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

node --version && npm --version
```

#### CentOS / RHEL / Amazon Linux

```bash
# nvm 方案（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
nvm install --lts && nvm use --lts

# 或 NodeSource RPM 源
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs
```

#### Arch Linux

```bash
# 通过 pacman（系统级）
sudo pacman -S nodejs npm

# 或通过 nvm（用户级，推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
nvm install --lts
```

---

## npm 常用配置

### 查看当前配置

```bash
npm config list          # 所有配置
npm config get prefix    # 全局安装路径
npm root -g              # 全局 node_modules 路径
```

### 更换国内镜像（加速下载）

```bash
# 使用淘宝镜像（npmmirror）
npm config set registry https://registry.npmmirror.com

# 恢复官方源
npm config set registry https://registry.npmjs.org

# 验证当前镜像
npm config get registry
```

### 更新 npm 自身

```bash
npm install -g npm@latest
npm --version
```

---

## pnpm（可选，OpenClaw 推荐）

pnpm 是比 npm 更快、磁盘占用更少的包管理器：

```bash
# 通过 npm 安装
npm install -g pnpm

# 或通过独立安装脚本（macOS / Linux）
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Windows PowerShell
iwr https://get.pnpm.io/install.ps1 -useb | iex

# 验证
pnpm --version
```

配置国内镜像：

```bash
pnpm config set registry https://registry.npmmirror.com
```

---

## Python 与 pip / uv（Hermes Agent）

Hermes Agent 的一键安装脚本会自动处理 Python，无需手动安装。若需要手动配置：

### uv（推荐，Hermes 官方使用）

uv 是 Rust 编写的超快 Python 包管理器：

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc   # 或 source ~/.zshrc

# Windows PowerShell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 验证
uv --version
```

安装 Python 3.11（uv 管理）：

```bash
uv python install 3.11
uv python list    # 查看已安装版本
```

安装 Hermes：

```bash
uv tool install hermes-agent
```

### pip（系统 Python）

```bash
# 检查 pip 是否可用
python3 -m pip --version

# 更新 pip
python3 -m pip install --upgrade pip

# 配置国内镜像
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 安装 Hermes
pip install hermes-agent
```

---

## Git

Git 是部分工具（OpenClaw 源码安装、Claude Code 项目感知）的依赖：

### Windows

```powershell
# 方案 A：winget
winget install Git.Git

# 安装时建议勾选：
# ✅ Add to PATH
# ✅ Git Bash Here（右键菜单）
```

或前往 [git-scm.com](https://git-scm.com/download/win) 下载安装包。

### macOS

```bash
# Xcode CLI 工具中包含 Git（推荐）
xcode-select --install

# 或 Homebrew
brew install git
```

### Linux

```bash
# Ubuntu / Debian
sudo apt install -y git

# CentOS / RHEL
sudo yum install -y git

# Arch
sudo pacman -S git
```

验证：

```bash
git --version   # git version 2.x.x
git config --global user.name "你的名字"
git config --global user.email "your@email.com"
```

---

## 验证清单

完成环境准备后，按需核查：

```bash
node --version     # v18+ (Claude Code) / v22+ (Codex、OpenClaw)
npm --version      # 8+
pnpm --version     # 可选
python3 --version  # 3.10+（Hermes）
uv --version       # 可选
git --version      # 2.x
```

---

## 下一步：配置网络代理

国内网络直连 Anthropic / OpenAI API 通常会超时。环境准备完成后，建议阅读 **[网络代理配置指南](./proxy)**，了解如何安装 FlClash 并选择合适的机场服务。
