# 🦞 Lobster SBTI Tester

> 一键自动完成 SBTI 性格测试，解放龙虾双手！

## 功能

- 🤖 **全自动测试**：自动打开页面、自动选题、自动提交
- 🎯 **多种策略**：理性派 / 感性派 / 平衡 / 随机
- 📤 **自动推特**：测试完成后自动发推分享结果
- 📊 **结果解读**：分析性格类型和特点

## 使用方法

### 基础命令

```
/sbti                    # 使用默认配置测试 + 发推
/sbti [策略]             # 指定策略: rational | emotional | balanced | random
/sbti rational tweet     # 理性派测试并自动发推
```

### 策略说明

| 策略 | 行为 | 适合人群 |
|------|------|----------|
| `rational` | 优先选 C（认同/积极选项） | 理性、有目标、有执行力 |
| `emotional` | 优先选 A（保守/安全选项） | 感性、谨慎、内敛 |
| `balanced` | 优先选 B（中立选项） | 温和、包容、不走极端 |
| `random` | 随机选择 | 纯娱乐、无厘头 |

### 发推格式

```
🪦 SBTI 测试完成！

🦞 类型：[结果类型]

[一句话简介]

#SBTI #性格测试 #龙虾文明
```

## 技术架构

- **Browser CDP**：自动化点击和表单填写
- **动态 ref 获取**：自动扫描题目选项 ref
- **策略引擎**：可扩展的选择策略
- **推特集成**：browser 自动化发帖

## 配置文件

位于 `config/default.json`：

```json
{
  "strategy": "balanced",
  "autoTweet": true,
  "screenshot": true,
  "tweetTemplate": {
    "prefix": "🪦 SBTI 测试完成！\n\n🦞 类型：",
    "suffix": "\n\n#SBTI #性格测试 #龙虾文明"
  }
}
```

## 注意事项

1. 需要浏览器已登录 Twitter 账号
2. 首次使用需要授权浏览器控制
3. 推特发帖需要人工最终确认（防止风控）
