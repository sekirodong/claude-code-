# OpenAI Codex CLI 简介

OpenAI Codex CLI 是 OpenAI 官方推出的终端 AI 编程代理，通过自然语言指令直接操控代码库、执行 shell 命令、分析错误输出，将 AI 能力融入命令行工作流。

## 核心能力

| 能力 | 描述 |
|------|------|
| 自然语言编程 | 用中文或英文描述需求，自动生成并执行代码 |
| 多步骤任务 | 自动拆解复杂任务，依次执行并处理中间结果 |
| 代码库感知 | 分析项目结构，理解依赖关系和代码约定 |
| 安全沙箱 | 执行操作前提示确认，支持 `--approval-mode` 控制自动化程度 |
| 多模型支持 | 可切换不同 OpenAI 模型（GPT-4o、o1 等） |

## 与 Claude Code 对比

| 维度 | Claude Code | OpenAI Codex CLI |
|------|-------------|------------------|
| 背后模型 | Claude (Anthropic) | GPT / o1 (OpenAI) |
| 开源状态 | 闭源 CLI | 开源仓库 |
| 安装方式 | `npm install -g @anthropic-ai/claude-code` | `npm install -g @openai/codex` |
| Windows 支持 | 原生支持 | 推荐 WSL2 |
| 多 Agent 编排 | 内置 Agent 模式 | 结合 tmux / AWS 编排 |

## 教程导航

- **[官方快速启动](./quickstart)**  
  基于 openai/codex 官方仓库，最权威的安装和配置流程。

- **[多系统安装教程](./multi-system-install)**  
  Windows WSL2 方案 + macOS/Linux Homebrew 工作流，附一键配置脚本。

- **[AWS Agent 编排](./aws-orchestrator)**  
  结合 tmux 在服务器和 Docker 容器内编排多个 Codex Agent。

## 快速安装

```bash
npm install -g @openai/codex
codex login   # 绑定 OpenAI API 密钥
```

验证安装：

```bash
codex --version
codex "列出当前目录下所有 Python 文件"
```

## 配套工具推荐

如果你同时管理多个 AI CLI 工具或需要频繁切换 API 提供商，推荐使用 **[CC Switch](../cc-switch/)**——统一管理 Codex CLI、Claude Code、Gemini CLI 等工具的桌面应用，支持 50+ 提供商预设、MCP 配置同步和云端备份。
