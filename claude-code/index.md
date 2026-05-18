# Claude Code 简介

Claude Code 是 Anthropic 官方推出的终端 AI 编程助手，以 CLI 工具形式运行，可直接嵌入开发工作流。相比图形界面产品，它更适合需要深度上下文理解、多文件操作和自动化脚本生成的工程师。

## 核心能力

| 能力 | 描述 |
|------|------|
| 多文件理解 | 通过 `@` 符号精准引入上下文文件，避免无关噪音 |
| 项目记忆 | `CLAUDE.md` 持久化项目约定，跨会话保持一致性 |
| 对话回退 | 双击 `Esc` 撤回上一轮对话，快速修正方向 |
| IDE 集成 | 支持 VS Code、JetBrains、Cursor 等主流编辑器 |
| Agent 模式 | 可自动配置环境、执行 shell 命令、管理文件 |

## 教程导航

本章节包含以下三份教程，覆盖从入门到进阶的完整路径：

- **[快速上手（Datawhale）](./quickstart)**  
  基于 datawhalechina/easy-vibe 的中文保姆级教程，适合首次使用 Claude Code 的开发者。

- **[多系统安装指南](./windows-install)**  
  覆盖 Windows、macOS、Linux 三个平台，含各系统权限处理和网络代理配置。

- **[Cursor 编辑器集成](./cursor-integration)**  
  手动提取并安装 `.vsix` 扩展文件，在 Cursor 中启用 Claude Code。

## 快速安装

```bash
npm install -g @anthropic-ai/claude-code
```

> **前提条件**：需要 Node.js 18+ 和有效的 Anthropic API 密钥。

安装完成后验证：

```bash
claude --version
```

## 配套工具推荐

如果你同时使用多款 AI CLI 工具，推荐搭配 **[CC Switch](../cc-switch/)** 使用——它提供统一的图形界面，可以在 Claude Code、Codex CLI、Gemini CLI 等工具之间一键切换 API 提供商，无需手动编辑配置文件。
