# AWS Agent 编排方案

> 来源：[awslabs/cli-agent-orchestrator](https://github.com/awslabs/cli-agent-orchestrator)  
> 定位：在服务器或 Docker 容器内结合 tmux 编排多个 Codex Agent，适合全栈开发者部署自动化工作流。

## 适用场景

- 在远程服务器（EC2、ECS）上持续运行多个 AI Agent
- Docker 容器内的无头（headless）自动化任务
- CI/CD 流水线中集成 AI 代码审查或生成
- 需要同时并行执行多个独立代理任务

## 前提条件

| 组件 | 说明 |
|------|------|
| tmux | 终端复用工具，实现 session 持久化 |
| Docker（可选） | 容器化部署 |
| AWS CLI | 与 AWS 服务集成 |
| Codex CLI | 已全局安装并配置 API 密钥 |

安装 tmux：

```bash
# Ubuntu / Debian
sudo apt install -y tmux

# macOS
brew install tmux

# Amazon Linux / CentOS
sudo yum install -y tmux
```

## 核心概念：tmux 会话管理

tmux 允许在单个 SSH 连接中维护多个持久化终端会话，断开连接后 Agent 仍在后台运行。

```
tmux
├── session: codex-agents
│   ├── window 0: agent-frontend
│   ├── window 1: agent-backend
│   ├── window 2: agent-tests
│   └── window 3: monitor
```

## 基础编排：手动启动多 Agent

### 创建命名 session

```bash
# 创建名为 codex-agents 的后台 session
tmux new-session -d -s codex-agents

# 在 session 内创建多个窗口
tmux new-window -t codex-agents -n "frontend"
tmux new-window -t codex-agents -n "backend"
tmux new-window -t codex-agents -n "monitor"
```

### 向各窗口发送命令

```bash
# 在 frontend 窗口启动前端 Agent
tmux send-keys -t codex-agents:frontend \
  'codex --cwd /app/frontend "检查并修复所有 TypeScript 类型错误"' Enter

# 在 backend 窗口启动后端 Agent
tmux send-keys -t codex-agents:backend \
  'codex --cwd /app/backend "为所有 API 端点添加输入验证"' Enter
```

### 连接到运行中的 session

```bash
# 连接 session（会恢复所有窗口状态）
tmux attach-session -t codex-agents

# 切换窗口
Ctrl+B, 数字键    # 切换到对应窗口
Ctrl+B, n        # 下一个窗口
Ctrl+B, p        # 上一个窗口

# 断开（不终止 session）
Ctrl+B, d
```

## 解决 `--no-alt-screen` 终端挂起问题

在非交互式终端（如 Docker 容器内、tmux 嵌套）中，Codex CLI 有时会因为尝试切换到备用屏幕缓冲区（alt screen）而挂起。

**症状**：命令看似在运行但没有输出，或者终端卡住不响应。

**解决方案**：使用 `--no-alt-screen` 参数禁用 alt screen：

```bash
codex --no-alt-screen "执行代码审查"
```

在 tmux 会话中的完整示例：

```bash
tmux send-keys -t codex-agents:backend \
  'codex --no-alt-screen --approval-mode full-auto "运行测试套件并修复失败用例"' Enter
```

## 自动化编排脚本

将以下脚本保存为 `orchestrate.sh`，一键启动多 Agent 工作流：

```bash
#!/bin/bash
# Codex CLI 多 Agent 编排脚本
# 用法：./orchestrate.sh [project-dir]

PROJECT_DIR="${1:-$(pwd)}"
SESSION="codex-$(date +%s)"

echo "启动 Agent 编排会话：$SESSION"
echo "项目目录：$PROJECT_DIR"

# 创建 tmux session
tmux new-session -d -s "$SESSION" -x 220 -y 50

# Agent 1：代码质量检查
tmux rename-window -t "$SESSION:0" "quality"
tmux send-keys -t "$SESSION:quality" \
  "codex --no-alt-screen --cwd '$PROJECT_DIR' \
  '执行代码质量检查：找出重复代码、过长函数、未使用的变量，生成报告'" Enter

# Agent 2：安全漏洞扫描
tmux new-window -t "$SESSION" -n "security"
tmux send-keys -t "$SESSION:security" \
  "codex --no-alt-screen --cwd '$PROJECT_DIR' \
  '扫描代码中的安全问题：SQL 注入、XSS、硬编码密钥、不安全的依赖版本'" Enter

# Agent 3：测试覆盖率分析
tmux new-window -t "$SESSION" -n "tests"
tmux send-keys -t "$SESSION:tests" \
  "codex --no-alt-screen --cwd '$PROJECT_DIR' \
  '分析测试覆盖率，为覆盖率低于 80% 的模块生成补充测试用例'" Enter

# 监控窗口
tmux new-window -t "$SESSION" -n "monitor"
tmux send-keys -t "$SESSION:monitor" \
  "watch -n 5 'tmux list-windows -t $SESSION'" Enter

echo ""
echo "所有 Agent 已启动！"
echo "连接会话：tmux attach -t $SESSION"
echo "查看列表：tmux list-sessions"
```

```bash
chmod +x orchestrate.sh
./orchestrate.sh /path/to/your/project
```

## Docker 容器内部署

### Dockerfile 示例

```dockerfile
FROM ubuntu:22.04

# 安装依赖
RUN apt-get update && apt-get install -y \
    curl tmux git && \
    rm -rf /var/lib/apt/lists/*

# 安装 Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# 安装 Codex CLI
RUN npm install -g @openai/codex

# 配置 API 密钥（通过构建参数或运行时环境变量）
ENV OPENAI_API_KEY=""

WORKDIR /workspace
COPY orchestrate.sh /usr/local/bin/orchestrate.sh
RUN chmod +x /usr/local/bin/orchestrate.sh

CMD ["bash"]
```

构建并运行：

```bash
docker build -t codex-agent .

docker run -it \
  -e OPENAI_API_KEY="sk-..." \
  -v $(pwd):/workspace \
  codex-agent \
  orchestrate.sh /workspace
```

### Docker Compose 多容器方案

```yaml
# docker-compose.yml
version: '3.8'

services:
  agent-frontend:
    image: codex-agent
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./frontend:/workspace
    command: >
      codex --no-alt-screen --approval-mode full-auto
      "检查 React 组件的性能问题和最佳实践"

  agent-backend:
    image: codex-agent
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend:/workspace
    command: >
      codex --no-alt-screen --approval-mode full-auto
      "审查 API 端点的安全性和错误处理"

  agent-docs:
    image: codex-agent
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./:/workspace
    command: >
      codex --no-alt-screen --approval-mode full-auto
      "为所有公共函数生成 JSDoc 注释"
```

```bash
docker-compose up
```

## AWS EC2 部署示例

```bash
# 1. 连接到 EC2 实例
ssh -i key.pem ubuntu@your-ec2-ip

# 2. 安装依赖（Amazon Linux 2）
sudo yum install -y tmux nodejs npm git

# 3. 安装 Codex CLI
npm install -g @openai/codex

# 4. 配置 API 密钥（推荐使用 AWS Secrets Manager）
export OPENAI_API_KEY=$(aws secretsmanager get-secret-value \
  --secret-id openai-api-key --query SecretString --output text)

# 5. 启动持久化 tmux session
tmux new-session -d -s prod-agents
tmux send-keys -t prod-agents \
  'codex --no-alt-screen "监控日志目录，自动分析错误模式并生成修复建议"' Enter

# 6. 断开 SSH（session 继续运行）
# Ctrl+B, d 或直接关闭 SSH 连接
```

## 监控与日志

记录每个 Agent 的输出到日志文件：

```bash
# 将 Agent 输出同时显示在终端并写入日志
tmux send-keys -t codex-agents:quality \
  'codex --no-alt-screen "代码审查" 2>&1 | tee /var/log/agent-quality.log' Enter

# 实时查看所有 Agent 日志
tail -f /var/log/agent-*.log
```

## 常见问题

**Q: tmux 窗口内命令没有响应**

添加 `--no-alt-screen` 参数，并确认 `TERM` 环境变量设置正确：

```bash
export TERM=xterm-256color
```

**Q: Docker 容器内 codex 找不到命令**

检查 npm 全局路径是否在容器的 PATH 中：

```dockerfile
ENV PATH="/usr/local/bin:${PATH}"
```

**Q: Agent 执行到一半停止了**

使用 `--approval-mode full-auto` 避免等待用户确认超时，同时确保任务描述清晰、不产生歧义。
