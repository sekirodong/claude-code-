# 网络代理配置：FlClash 安装与机场推荐

国内网络环境下，访问 Anthropic、OpenAI 等 API 需要通过代理。本页介绍 **FlClash** 的安装配置方法，并推荐适合开发者的机场服务。

---

## FlClash 简介

> 仓库：[chen08209/FlClash](https://github.com/chen08209/FlClash)  
> 最新版本：**v0.8.92**（2026-02-02）  
> 内核：ClashMeta（Mihomo）  
> 协议支持：Shadowsocks、VMess、VLESS、Trojan、Hysteria2、TUIC 等

FlClash 是基于 ClashMeta 内核、采用 Material You 设计风格的开源跨平台代理客户端，支持一键导入订阅链接、WebDAV 同步配置、TUN 虚拟网卡全局代理等功能。支持 Android、Windows、macOS、Linux 四个平台。

---

## Windows 安装教程

### 第一步：下载安装包

前往 [GitHub Releases](https://github.com/chen08209/FlClash/releases) 下载最新版：

| 文件 | 说明 |
|------|------|
| `FlClash-x.x.x-windows-amd64-setup.exe` | 安装版（推荐，自动创建快捷方式） |
| `FlClash-x.x.x-windows-amd64.zip` | 便携版（解压即用，无需安装） |

绝大多数电脑选 `amd64`（即 x64）版本。

### 第二步：安装

双击 `setup.exe` 运行安装向导。

若出现 **Windows SmartScreen** 弹窗（"Windows 已保护你的电脑"）：
1. 点击 **"更多信息"**
2. 点击 **"仍要运行"**

安装完成后桌面出现 FlClash 快捷方式。

### 第三步：导入订阅链接

1. 打开 FlClash
2. 左侧点击 **"配置"**（Profiles）
3. 点击右上角 **"+"** 按钮
4. 选择 **"URL"**，粘贴机场提供的订阅链接
5. 点击 **"保存"**，等待订阅拉取完成
6. 点击刚导入的配置右侧 **"激活"** 按钮

### 第四步：选择节点并开启代理

1. 左侧点击 **"代理"**（Proxy），选择你想要的节点（香港/日本/新加坡等）
2. 左侧点击 **"设置"** → 打开 **"系统代理"** 开关
3. 状态栏显示已连接即生效

### 开启 TUN 模式（全局接管，推荐）

TUN 模式可以代理所有流量，包括终端命令和 npm/pip 等工具，无需手动设置环境变量：

1. **以管理员身份运行** FlClash（右键快捷方式 → 以管理员身份运行）
2. 左侧 **"设置"** → 找到 **"TUN 模式"** → 开启
3. 系统弹出 UAC 权限确认，点击"是"

::: tip
TUN 模式开启后，终端中无需再设置 `HTTPS_PROXY` 环境变量，所有网络请求自动走代理。
:::

### 不使用 TUN 模式时：手动配置终端代理

如果没有开启 TUN 模式，在 PowerShell 中临时设置：

```powershell
# FlClash 默认监听端口为 7897（混合端口）
$env:HTTPS_PROXY = "http://127.0.0.1:7897"
$env:HTTP_PROXY  = "http://127.0.0.1:7897"

# 验证
curl https://api.anthropic.com -v
```

永久写入用户环境变量：

```powershell
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:7897", "User")
[Environment]::SetEnvironmentVariable("HTTP_PROXY",  "http://127.0.0.1:7897", "User")
```

查看 FlClash 实际监听端口：设置 → 端口（Port）中查看混合端口号。

### npm / pip 单独配置代理

```bash
# npm
npm config set proxy http://127.0.0.1:7897
npm config set https-proxy http://127.0.0.1:7897

# pip
pip config set global.proxy http://127.0.0.1:7897
```

用完后清除：

```bash
npm config delete proxy
npm config delete https-proxy
pip config unset global.proxy
```

---

## 其他平台安装

### macOS

```bash
# 下载对应芯片版本
# Intel：FlClash-x.x.x-macos-amd64.dmg
# Apple Silicon：FlClash-x.x.x-macos-arm64.dmg

# 安装后配置终端代理（FlClash 默认端口 7897）
export HTTPS_PROXY="http://127.0.0.1:7897"
export HTTP_PROXY="http://127.0.0.1:7897"
```

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i FlClash-x.x.x-linux-amd64.deb

# 通用（AppImage）
chmod +x FlClash-x.x.x-linux-amd64.AppImage
./FlClash-x.x.x-linux-amd64.AppImage
```

---

## 机场推荐

::: warning 免责声明
以下信息仅供参考，机场服务会持续变化，实际稳定性请以最新评测为准。请遵守当地法律法规，仅用于访问 AI API 等合法开发需求。
:::

以下机场均支持 Clash 订阅格式，可直接导入 FlClash。

::: tip 域名说明
机场域名因网络环境可能随时变动，建议注册后加入官方 Telegram 频道获取最新地址通知。
:::

---

### ikuuu

| 项目 | 信息 |
|------|------|
| **官网** | [ikuuu.win](https://ikuuu.win) · [ikuuu.one](https://ikuuu.one) · [ikuuu.co](https://ikuuu.co) · [ikuuu.art](https://ikuuu.art) |
| 注册即免费 | 每月 50GB 免费流量，无需付费 |
| 入门套餐 | ¥12/月，300GB 流量 |
| 年付套餐 | ¥108/年 |
| 节点覆盖 | 香港、日本、新加坡、美国等 |
| 协议支持 | SSR、V2Ray |
| 特点 | 老牌服务商，注册门槛低，免费额度适合入门 |

> ikuuu 域名经常因被屏蔽而更换，若上述地址均无法访问，可发邮件至 support@ikuuu.pw 获取最新地址自动回复，或搜索 "ikuuu Telegram" 加入官方频道。近期评测反映晚高峰速度有所下滑，重度使用建议搭配备用机场。

---

### 速云梯（Suyunti）

| 项目 | 信息 |
|------|------|
| **官网** | [suyunti.com](https://suyunti.com) · [suyunti.net](https://suyunti.net) |
| 价格 | ¥19/月起，按流量套餐 |
| 节点覆盖 | 香港、日本、新加坡、美国（90+ 节点） |
| 线路类型 | BGP 中转 + CN2 BGP + IPLC 专线 |
| 协议支持 | SSR、V2Ray |
| 特点 | 成立 2018 年，老牌稳定，晚高峰表现良好 |

---

### 花云（FlowerCloud）

| 项目 | 信息 |
|------|------|
| **官网** | [hushicha.org](https://hushicha.org) · [hanlianfangzhi.com](https://hanlianfangzhi.com) |
| 价格 | ¥15/月起 |
| 节点覆盖 | 香港、日本、台湾、新加坡、美国等 |
| 线路类型 | 中转 + 专线混合 |
| 特点 | 综合表现稳定，订阅采用"开关模式"，每次需登录官网获取 |

---

### 极连云（JilianYun）

| 项目 | 信息 |
|------|------|
| **官网** | [jilianyun.cc](https://jilianyun.cc) · [jilianyun.org](https://jilianyun.org) · [jilianyun.top](https://jilianyun.top) |
| 价格 | ¥96/年起（约 ¥8/月），轻量套餐 |
| 节点覆盖 | 香港、日本、新加坡、美国、英德法韩等 10+ 国家 |
| 线路类型 | 全 IPLC/IEPL 专线，不经过防火墙 |
| 协议支持 | Shadowsocks、V2Ray、Trojan |
| 特点 | 企业级专线，延迟低，不限设备数，Netflix/ChatGPT 解锁 |

---

### 唯兔云（WeiTuYun）

| 项目 | 信息 |
|------|------|
| **官网** | [weituyun.com](https://weituyun.com) |
| 价格 | ¥6/月起，年付更优惠 |
| 节点覆盖 | 香港、日本、新加坡、美国等 |
| 线路类型 | IPLC 专线 |
| 特点 | 性价比极高，6 元起的 IPLC 专线，不限设备数，TikTok/ChatGPT 解锁 |

---

### 选择建议

| 使用场景 | 推荐 |
|----------|------|
| 偶尔测试 API，预算为零 | ikuuu 免费套餐（50GB/月） |
| 日常开发，长期调用 API | 速云梯 / 花云（¥15–20/月），稳定优先 |
| 对延迟敏感（实时流式响应） | 极连云 / 唯兔云（全 IPLC 专线，延迟 <50ms） |
| 备用策略 | 主力机场 + ikuuu 免费套餐，主力挂了仍可用

---

## 代理验证

配置完成后，在终端验证代理是否生效：

```bash
# 测试能否访问 Google
curl -I https://www.google.com

# 测试 Anthropic API 连通性
curl -I https://api.anthropic.com

# 测试 OpenAI API 连通性
curl -I https://api.openai.com

# 查看当前出口 IP
curl https://httpbin.org/ip
```

所有命令均返回 200 或正常响应，表示代理配置成功。

---

## 常见问题

**Q：FlClash 打开后一直转圈，节点无法连接**

- 检查订阅链接是否过期（机场后台重新复制）
- 尝试切换到其他节点
- 检查系统时间是否准确（时间偏差 >30 秒会导致认证失败）

**Q：开启系统代理后浏览器正常，但终端 npm 还是超时**

未开启 TUN 模式时，终端需要手动设置 `HTTPS_PROXY`。推荐开启 TUN 模式一劳永逸。

**Q：TUN 模式需要管理员权限，每次都要右键"以管理员运行"？**

在 FlClash 设置中找到 **"开机自启"** 并开启，同时设置以管理员身份自启（需要在任务计划程序中配置），之后重启系统即可自动启动。

**Q：机场订阅链接泄露了怎么办**

立刻登录机场后台，找到"重置订阅链接"功能，生成新链接后在 FlClash 中更新。
