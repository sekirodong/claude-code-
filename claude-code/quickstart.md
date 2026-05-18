# 快速上手核心指南

> 来源：[datawhalechina/easy-vibe](https://github.com/datawhalechina/easy-vibe)  
> 定位：中文保姆级教程，适合国内开发者系统学习 Claude Code 快捷操作和最佳实践。

## 安装

全局安装 Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
```

验证安装成功：

```bash
claude --version
claude --help
```

首次使用需要配置 API 密钥：

```bash
claude config set apiKey YOUR_ANTHROPIC_API_KEY
```

## 基础使用

### 启动交互会话

```bash
# 在项目目录下启动
cd your-project
claude
```

### 单次问答模式

```bash
claude "解释这段代码的作用"
claude "帮我写一个读取 CSV 文件的 Python 函数"
```

## 进阶操作

### @ 精准指定上下文文件

在对话中使用 `@` 符号引入特定文件，让 Claude 只关注相关代码，避免无关上下文干扰：

```
@src/utils/parser.py 这个函数有 bug，帮我找出来
@package.json @src/index.ts 根据依赖配置，重构入口文件
```

**最佳实践**：
- 精确指定文件而非整个目录，节省 token 并提升回答质量
- 多文件关联任务时，一次性列出所有相关文件
- 配置文件（`tsconfig.json`、`pyproject.toml`）通常需要同时引入

### 双击 Esc 回退对话

当 Claude 的回答方向不对或者执行了错误操作时，**连续双击 `Esc` 键**可以撤回上一轮对话，恢复到上一个状态。

这对以下场景尤其有用：
- Claude 误解了需求，生成了错误代码
- 想重新措辞提问
- 需要从某个节点开始尝试不同的解法

### 配置 CLAUDE.md 项目记忆文件

`CLAUDE.md` 是放在项目根目录的特殊文件，Claude Code 每次启动时都会自动读取，相当于给 Claude 的"项目说明书"。

在项目根目录创建 `CLAUDE.md`：

```bash
touch CLAUDE.md
```

推荐内容结构：

```markdown
# 项目概述
这是一个 Python FastAPI 后端服务，提供用户管理和订单处理接口。

# 技术栈
- Python 3.11 + FastAPI
- PostgreSQL 数据库（通过 SQLAlchemy ORM）
- Redis 缓存
- Docker 部署

# 代码规范
- 所有函数必须有类型注解
- 使用 Black 格式化代码
- 测试文件以 test_ 开头

# 重要约定
- 数据库迁移使用 Alembic，不要直接修改表结构
- 敏感配置通过环境变量注入，不要硬编码
- API 路由统一在 routers/ 目录下管理

# 禁止操作
- 不要修改 alembic/versions/ 下的已有迁移文件
- 不要删除 .env.example 文件
```

**CLAUDE.md 的优势**：
- 跨会话持久化：每次新对话都自动继承项目上下文
- 统一团队协作标准：可以提交到 git，所有人共享同一份约定
- 减少重复说明：不需要每次都解释项目背景

### 让 AI Agent 自动配置环境

Claude Code 支持 Agent 模式，可以让其自动完成环境配置任务：

```bash
# 示例：让 Claude 自动分析并配置开发环境
claude "分析 package.json，帮我配置好本地开发环境，包括安装依赖和设置环境变量"
```

Claude 会自动执行 shell 命令、读取配置文件并给出逐步操作建议。

## 键盘快捷键速查

| 快捷键 | 功能 |
|--------|------|
| `Esc` × 2 | 回退上一轮对话 |
| `Ctrl+C` | 中断当前生成 |
| `Ctrl+L` | 清空会话历史 |
| `↑` / `↓` | 浏览历史命令 |
| `Tab` | 自动补全文件路径 |

## 常见问题

**Q: 安装后提示 `claude: command not found`**

检查 npm 全局安装路径是否在 PATH 中：

```bash
npm root -g   # 查看全局安装路径
echo $PATH    # 检查 PATH 配置
```

**Q: API 请求超时或连接失败**

国内网络可能需要配置代理：

```bash
export HTTPS_PROXY=http://127.0.0.1:7890
claude "测试连接"
```

**Q: 如何更新到最新版本**

```bash
npm update -g @anthropic-ai/claude-code
```
