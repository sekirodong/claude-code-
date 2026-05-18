# Cursor 编辑器集成

> 来源：[sotayamashita/Installing_Claude_Code_Ext_in_Cursor.md](https://gist.github.com/sotayamashita) (GitHub Gist)  
> 定位：Cursor 无法自动识别 Claude Code 扩展时的手动安装方案。

## 背景

Claude Code 官方提供了 VS Code 扩展，但 Cursor 作为基于 VS Code 的 fork，有时无法通过正常渠道自动检测并安装该扩展。本教程通过手动提取 `.vsix` 文件并拖拽安装来解决这一问题。

## 前提条件

- 已全局安装 Claude Code：`npm install -g @anthropic-ai/claude-code`
- 已安装 Cursor 编辑器（最新版）

## 第一步：定位 Claude Code 安装目录

### Windows

```powershell
# 查找 npm 全局安装路径
npm root -g
# 通常输出：C:\Users\<用户名>\AppData\Roaming\npm\node_modules
```

Claude Code 的 VS Code 扩展文件位于：

```
C:\Users\<用户名>\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\
```

### macOS / Linux

```bash
npm root -g
# 通常输出：/usr/local/lib/node_modules 或 ~/.npm-global/lib/node_modules
```

扩展目录：

```
$(npm root -g)/@anthropic-ai/claude-code/
```

## 第二步：找到 .vsix 文件

进入 Claude Code 安装目录，找到扩展文件：

```powershell
# Windows
$claudeDir = "$(npm root -g)\@anthropic-ai\claude-code"
Get-ChildItem $claudeDir -Filter "*.vsix" -Recurse
```

```bash
# macOS / Linux
find $(npm root -g)/@anthropic-ai/claude-code -name "*.vsix"
```

`.vsix` 文件通常位于类似以下路径：

```
.../claude-code/dist/claude-code-<version>.vsix
```

## 第三步：在 Cursor 中手动安装

### 方法 A：拖拽安装（最简单）

1. 打开 Cursor 编辑器
2. 打开文件资源管理器，导航到找到的 `.vsix` 文件
3. 直接将 `.vsix` 文件**拖拽到 Cursor 窗口**
4. Cursor 会弹出安装确认提示，点击 "Install"

### 方法 B：命令面板安装

1. 在 Cursor 中按 `Ctrl+Shift+P`（macOS：`Cmd+Shift+P`）打开命令面板
2. 输入 `Install from VSIX` 并选择该命令
3. 在文件选择器中找到并选择 `.vsix` 文件
4. 等待安装完成

### 方法 C：命令行安装

```bash
# 使用 Cursor 的 CLI 工具
cursor --install-extension /path/to/claude-code-<version>.vsix
```

Windows PowerShell：

```powershell
$vsix = Get-ChildItem "$(npm root -g)\@anthropic-ai\claude-code" -Filter "*.vsix" -Recurse | Select-Object -First 1
cursor --install-extension $vsix.FullName
```

## 第四步：验证安装

1. 重启 Cursor
2. 按 `Ctrl+Shift+X` 打开扩展面板
3. 搜索 "Claude Code"，确认扩展显示为已安装并启用
4. 尝试使用 `Ctrl+Shift+P` → "Claude Code: Open" 打开 Claude Code 面板

## 配置 API 密钥

安装扩展后，需要在 Cursor 设置中配置 Anthropic API 密钥：

1. `Ctrl+,` 打开设置
2. 搜索 "Claude Code"
3. 在 `Claude Code: Api Key` 字段填入你的 Anthropic API 密钥

或者通过终端配置（Cursor 内置终端会继承该配置）：

```bash
claude config set apiKey YOUR_ANTHROPIC_API_KEY
```

## 常见问题

**问题：找不到 `.vsix` 文件**

部分版本的 Claude Code 可能将扩展文件打包在不同位置：

```powershell
# Windows：搜索整个 Claude Code 目录
Get-ChildItem "$(npm root -g)\@anthropic-ai" -Filter "*.vsix" -Recurse
```

如果确实没有 `.vsix` 文件，可以尝试从 VS Code Marketplace 手动下载，然后用上述方法安装到 Cursor。

**问题：安装后扩展不生效**

- 确保完全退出并重启 Cursor（不只是关闭窗口）
- 在扩展面板检查是否有版本冲突
- 查看 Cursor 的输出面板（`Ctrl+Shift+U`）是否有错误日志

**问题：与 Cursor 内置 AI 功能冲突**

Claude Code 扩展和 Cursor 内置 AI 是独立系统，通常不会冲突。如果遇到快捷键冲突，在 `keybindings.json` 中调整优先级即可。

## 与 VS Code 安装对比

| 安装方式 | VS Code | Cursor |
|----------|---------|--------|
| Marketplace 自动安装 | ✅ | ❌（需手动） |
| `.vsix` 手动安装 | ✅ | ✅ |
| 拖拽安装 | ✅ | ✅ |
| CLI 安装 | ✅ | ✅ |
