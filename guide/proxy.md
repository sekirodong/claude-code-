# 网络代理配置：FlClash 安装与机场推荐

国内网络环境下，访问 Anthropic、OpenAI 等 API 需要通过代理。本页介绍 **FlClash** 的安装配置方法，并推荐适合开发者的机场服务。

---

## FlClash 简介

> 仓库：[chen08209/FlClash](https://github.com/chen08209/FlClash)  
> 最新版本：**v0.8.92**（2026-02-02）  
> 内核：ClashMeta（Mihomo）  
> 协议支持：Shadowsocks、VMess、VLESS、Trojan、Hysteria2、TUIC 等

FlClash 是基于 ClashMeta 内核、采用 Material You 设计风格的开源跨平台代理客户端，支持一键导入订阅链接、WebDAV 同步配置、TUN 虚拟网卡全局代理等功能。

**平台支持：**

| 平台 | 安装包格式 | 跳转 |
|------|-----------|------|
| Windows 10/11 | `.exe` 安装版 / `.zip` 便携版 | [→ Windows 教程](#windows-安装教程) |
| macOS 12+ | `.dmg`（Intel / Apple Silicon） | [→ macOS 教程](#macos-安装教程) |
| Linux | `.deb` / `.AppImage` | [→ Linux 教程](#linux-安装教程) |
| Android 5.0+ | `.apk`（arm64 / arm32 / x86_64） | [→ Android 教程](#android-安装教程) |

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

## macOS 安装教程

### 第一步：下载 DMG

前往 [GitHub Releases](https://github.com/chen08209/FlClash/releases) 下载对应芯片版本：

| 文件 | 适用机型 |
|------|----------|
| `FlClash-x.x.x-macos-arm64.dmg` | Apple Silicon（M1 / M2 / M3 / M4） |
| `FlClash-x.x.x-macos-amd64.dmg` | Intel 芯片 Mac |

不确定芯片型号：苹果菜单 → **关于本机**，处理器一栏显示 Apple Mx 则为 arm64，Intel 则为 amd64。

### 第二步：安装

1. 双击 `.dmg` 挂载磁盘镜像
2. 将 FlClash 图标拖入 **Applications** 文件夹
3. 从启动台或应用程序文件夹打开

首次打开若提示 **"无法打开，因为无法验证开发者"**：

- 前往 **系统设置 → 隐私与安全性**，找到底部 "仍要打开" 按钮点击
- 或在终端执行：

```bash
xattr -dr com.apple.quarantine /Applications/FlClash.app
```

### 第三步：导入订阅并开启代理

步骤与 Windows 完全相同：配置 → + → URL → 粘贴订阅链接 → 激活 → 代理页选节点 → 设置中开启系统代理。

### 配置终端代理

FlClash 开启系统代理后，Terminal / iTerm2 通常自动继承。若未生效，手动设置：

```bash
# 临时（当前终端窗口有效）
export HTTPS_PROXY="http://127.0.0.1:7897"
export HTTP_PROXY="http://127.0.0.1:7897"

# 永久写入（zsh）
echo 'export HTTPS_PROXY="http://127.0.0.1:7897"' >> ~/.zshrc
echo 'export HTTP_PROXY="http://127.0.0.1:7897"'  >> ~/.zshrc
source ~/.zshrc
```

### 开启 TUN 模式（全局接管）

1. **系统设置 → 隐私与安全性 → 网络扩展** — 允许 FlClash 添加 VPN 配置
2. FlClash **设置 → TUN 模式** → 开启
3. 弹出系统权限确认，输入 macOS 密码

TUN 开启后所有应用流量均走代理，终端无需单独配置。

---

## Linux 安装教程

### 第一步：下载安装包

| 文件 | 适用系统 |
|------|----------|
| `FlClash-x.x.x-linux-amd64.deb` | Debian / Ubuntu / Deepin |
| `FlClash-x.x.x-linux-amd64.AppImage` | 通用（免安装，任意发行版） |

### 第二步：安装

**Debian / Ubuntu：**

```bash
# 下载后安装（替换为实际版本号）
sudo dpkg -i FlClash-0.8.92-linux-amd64.deb

# 修复依赖（如有）
sudo apt install -f
```

**AppImage（通用，推荐无 root 环境）：**

```bash
chmod +x FlClash-0.8.92-linux-amd64.AppImage

# 直接运行
./FlClash-0.8.92-linux-amd64.AppImage

# 或安装到系统（可选）
sudo mv FlClash-0.8.92-linux-amd64.AppImage /usr/local/bin/flclash
flclash
```

### 第三步：导入订阅并开启代理

与 Windows 步骤相同：配置 → + → URL → 粘贴订阅 → 激活 → 选节点 → 开启系统代理。

### 配置终端代理

```bash
# 临时设置
export HTTPS_PROXY="http://127.0.0.1:7897"
export HTTP_PROXY="http://127.0.0.1:7897"
export ALL_PROXY="socks5://127.0.0.1:7897"

# 永久写入
echo 'export HTTPS_PROXY="http://127.0.0.1:7897"' >> ~/.bashrc
echo 'export HTTP_PROXY="http://127.0.0.1:7897"'  >> ~/.bashrc
source ~/.bashrc
```

### TUN 模式（需要 root）

```bash
# 以 root 身份启动可开启 TUN 模式
sudo flclash
```

或在 FlClash 设置中授予 cap_net_admin 权限：

```bash
sudo setcap cap_net_admin=eip /usr/local/bin/flclash
```

---

## Android 安装教程

### 第一步：下载 APK

前往 [GitHub Releases](https://github.com/chen08209/FlClash/releases) 下载对应架构的 APK：

| 文件 | 适用设备 |
|------|----------|
| `FlClash-x.x.x-android-arm64-v8a.apk` | 绝大多数现代 Android 手机（推荐） |
| `FlClash-x.x.x-android-armeabi-v7a.apk` | 老旧 32 位 Android 设备 |
| `FlClash-x.x.x-android-x86_64.apk` | Android 模拟器 / x86 平板 |

不确定架构：设置 → 关于手机 → 处理器，或安装 CPU-Z 查看。现代手机均为 arm64-v8a。

### 第二步：允许安装未知来源应用

由于 APK 不来自 Google Play，需要手动允许安装：

**Android 8.0+（主流）：**
1. 下载 APK 后点击文件
2. 系统弹出 "需要允许安装未知应用" → 点击 **"设置"**
3. 在应用权限页面打开 **"允许来自此来源的应用"**
4. 返回继续安装

**MIUI（小米）：**
设置 → 更多设置 → 授权管理 → 安装未知应用 → 打开对应浏览器/文件管理器的权限

**原生 Android / ColorOS / Funtouch OS：** 步骤类似，路径略有差异。

### 第三步：安装并打开

点击 APK 文件 → 安装 → 打开。

首次启动会请求 **VPN 权限**，点击 **"确定"** 允许（FlClash 通过 VPN 接口实现全局代理）。

### 第四步：导入订阅链接

**方法 A：扫码导入（最方便）**

1. 在电脑上打开机场后台，找到"订阅链接"并生成二维码
2. FlClash → **配置** → 右上角 **"+"** → **"扫码"**
3. 扫描机场二维码，自动填入订阅地址
4. 点击 **"保存"** → 等待拉取完成 → 点击 **"激活"**

**方法 B：复制链接手动粘贴**

1. 复制机场后台的订阅链接
2. FlClash → **配置** → **"+"** → **"URL"**
3. 长按粘贴链接 → **"保存"** → **"激活"**

**方法 C：从电脑导入配置文件（离线场景）**

1. 电脑上将订阅保存为 `.yaml` 文件
2. 通过 USB 或文件分享传输到手机
3. FlClash → **配置** → **"+"** → **"文件"** → 选择 `.yaml` 文件

### 第五步：选择节点并连接

1. 底部导航点击 **"代理"**，选择测速最低的节点（点击节点名右侧可手动测速）
2. 返回首页，点击顶部大圆按钮 **"启动"**
3. 按钮变为蓝色、显示 "已连接" 即生效

### 常用功能

**自动选择最优节点：**

代理页面选择 **"自动"** 分组 → FlClash 自动选延迟最低的节点

**更新订阅：**

配置页面 → 长按已有配置 → **"更新"** → 拉取最新节点列表

**全局代理 vs 规则代理：**

- **规则代理**（默认）：国内流量直连，国外走代理，省流量
- **全局代理**：所有流量都走节点，适合调试

设置 → 代理模式 → 切换

**允许局域网连接（共享代理给电脑）：**

设置 → 允许局域网连接 → 开启后，同一 WiFi 下的电脑可将代理指向手机 IP:7897

### Android 常见问题

**Q：安装后打开闪退**

尝试下载另一个架构的 APK（如换 armeabi-v7a）。

**Q：节点已连接但浏览器还是无法访问**

检查代理模式是否为"规则"，若部分网站无法访问，切换为"全局"模式测试。

**Q：VPN 图标一直显示但速度很慢**

切换到延迟更低的节点；或点击节点页"测速"按钮重新测试所有节点选最优。

**Q：手机重启后需要重新连接**

FlClash 设置 → **"启动时自动连接"** 开启，下次开机自动恢复代理。

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
