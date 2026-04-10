# 🦞 Lobster SBTI Tester

> 一键自动完成 SBTI 性格测试，解放龙虾双手！

[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blue)](https://github.com/openclaw)
[![License](https://img.shields.io/badge/License-MIT-green)]()

## 🎯 功能特点

- 🤖 **全自动测试**：自动打开页面、自动选题、自动提交
- 🎯 **多种策略**：理性派 / 感性派 / 平衡 / 随机
- 📤 **自动推特**：测试完成后自动发推分享结果
- 📊 **结果解读**：分析性格类型和特点
- 📸 **截图分享**：自动截图保存结果

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/adminlove520/lobster-mbti-skill.git
cd lobster-mbti-skill

# 安装依赖
npm install
```

### 配置

1. 确保浏览器已登录 Twitter
2. 配置推特发帖设置（可选）

```json
// config/default.json
{
  "strategy": "balanced",
  "autoTweet": true,
  "tweet": {
    "prefix": "🪦 SBTI 测试完成！\n\n🦞 类型：",
    "suffix": "\n\n#SBTI #性格测试 #龙虾文明"
  }
}
```

### 使用

```bash
# 启动自动化测试
npx ts-node src/main.ts

# 指定策略
npx ts-node src/main.ts rational
npx ts-node src/main.ts emotional

# 仅预览（不发推）
npx ts-node src/main.ts balanced --dry-run
```

## 📖 策略说明

| 策略 | 选择 | 适合人群 | 特点 |
|------|------|----------|------|
| `rational` | C 为主 | 策划者、执行者 | 目标导向、果断、积极 |
| `emotional` | A 为主 | 艺术家、梦想家 | 内心敏感、理想主义 |
| `balanced` | B 为主 | 调解者、顾问 | 中立包容、温和稳健 |
| `random` | 随机 | 娱乐至死 | 无厘头、纯玩 |

## 🏗️ 项目结构

```
lobster-mbti-skill/
├── SKILL.md              # 技能说明（供小溪读取）
├── README.md             # 项目文档
├── config/
│   └── default.json      # 默认配置
├── src/
│   ├── main.ts           # 入口文件
│   ├── sbti.ts           # 核心逻辑
│   ├── auto-run.ts       # 浏览器自动化
│   └── browser.ts        # CDP 连接管理
└── scripts/
    └── tweet.ts          # 推特发帖
```

## 🔧 技术栈

- **TypeScript** - 类型安全
- **Playwright** - 浏览器自动化 (CDP)
- **OpenClaw** - Agent 框架

## 📡 工作流程

```
1. 打开浏览器 → https://sbti.unun.dev/
2. 点击"开始测试"
3. 按策略自动选择 31 道题
4. 提交并截图结果
5. 生成推文内容
6. 自动发推（可选）
```

## ⚠️ 注意事项

1. **推特风控**：自动发帖可能触发风控，建议先 dry-run 测试
2. **浏览器状态**：确保 Twitter 已登录
3. **网络稳定**：测试需要稳定的网络连接

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 许可证

MIT License

---

🦞 **Made with ❤️ by 小溪**
