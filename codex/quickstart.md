# 官方快速启动

> 来源：[openai/codex](https://github.com/openai/codex)（OpenAI 官方仓库）  
> 定位：最权威的 Codex CLI 安装与配置指南，适合所有平台。

## 前提条件

| 要求 | 版本 | 说明 |
|------|------|------|
| Node.js | 22+ | Codex CLI 需要较新版本的 Node |
| npm | 随 Node 附带 | 用于全局安装 |
| OpenAI API 密钥 | — | 需要有效的 OpenAI 账户 |

检查 Node.js 版本：

```bash
node --version
# 需要 v22.x.x 或更高
```

如果版本不足，通过 [nvm](https://github.com/nvm-sh/nvm)（macOS/Linux）或 [nvm-windows](https://github.com/coreybutler/nvm-windows)（Windows）安装最新 Node：

```bash
# macOS / Linux
nvm install 22
nvm use 22

# Windows（nvm-windows）
nvm install 22.0.0
nvm use 22.0.0
```

## 安装

```bash
npm install -g @openai/codex
```

安装完成后验证：

```bash
codex --version
```

## 配置 API 密钥

### 方法 A：交互式登录（推荐）

```bash
codex login
```

按照提示输入 OpenAI API 密钥，密钥将安全存储在本地。

### 方法 B：环境变量

```bash
# macOS / Linux
export OPENAI_API_KEY="sk-..."

# Windows PowerShell
$env:OPENAI_API_KEY = "sk-..."

# Windows 永久设置
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-...", "User")
```

### 方法 C：配置文件

编辑 `~/.codex/config.json`：

```json
{
  "apiKey": "sk-...",
  "model": "gpt-4o"
}
```

## 基础使用

### 交互式会话

```bash
cd your-project
codex
```

### 单次任务执行

```bash
codex "列出所有超过 100 行的 Python 文件"
codex "给 main.py 添加详细的错误处理"
codex "运行测试并汇总失败原因"
```

### 指定工作目录

```bash
codex --cwd /path/to/project "重构 utils 目录下的所有函数"
```

## 审批模式控制

Codex CLI 提供三种审批模式，控制 AI 的自动化程度：

| 模式 | 命令 | 说明 |
|------|------|------|
| 完全提示（默认） | `codex` | 每个操作都需要确认 |
| 自动批准读取 | `codex --approval-mode auto-edit` | 读取自动执行，写入需确认 |
| 完全自动 | `codex --approval-mode full-auto` | 所有操作自动执行，谨慎使用 |

**生产环境建议**使用默认模式，避免意外修改重要文件。

## 多模型切换

```bash
# 使用 GPT-4o（默认）
codex --model gpt-4o "重构代码"

# 使用 o1（更强推理能力，速度较慢）
codex --model o1 "分析这个算法的时间复杂度"

# 使用 GPT-4o mini（更快更便宜）
codex --model gpt-4o-mini "解释这段代码"
```

## 常用工作流示例

### 代码审查

```bash
codex "审查 src/ 目录下的代码，找出潜在的安全问题"
```

### 自动修复 linting 问题

```bash
codex "运行 eslint，自动修复所有可修复的问题"
```

### 生成测试

```bash
codex "为 @src/utils/parser.ts 生成完整的单元测试，使用 Jest"
```

### 理解陌生代码库

```bash
codex "这个项目的整体架构是什么？数据流向如何？"
```

## 常见问题

**Q: `codex: command not found`**

```bash
# 检查 npm 全局路径
npm root -g
# 确认该路径的 bin 目录在 PATH 中
```

**Q: API 请求返回 401 Unauthorized**

- 检查 API 密钥是否正确（以 `sk-` 开头）
- 确认 OpenAI 账户余额充足
- 验证密钥未过期：登录 [platform.openai.com](https://platform.openai.com/api-keys)

**Q: 执行速度很慢**

尝试切换到更快的模型：`codex --model gpt-4o-mini`，或检查网络连接。
