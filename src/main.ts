/**
 * 🦞 Lobster SBTI Tester - Main Entry
 * 
 * 一键自动完成 SBTI 性格测试
 * 
 * 使用方法:
 *   npx ts-node src/main.ts [策略] [选项]
 * 
 * 策略: rational | emotional | balanced | random
 * 选项: --dry-run (仅预览，不发推)
 */

import { chromium } from 'playwright';
import {
  openTestPage,
  clickStartButton,
  getProgress,
  answerAllQuestions,
  submitTest,
  screenshotResult
} from './auto-run';
import { generateTweet, strategyDescriptions } from './sbti';

async function main() {
  // 解析命令行参数
  const args = process.argv.slice(2);
  const strategy = (args[0] as 'rational' | 'emotional' | 'balanced' | 'random') || 'balanced';
  const dryRun = args.includes('--dry-run');
  
  console.log(`
╔═══════════════════════════════════════════╗
║     🦞 Lobster SBTI Tester v1.0.0        ║
║     性格测试自动化 - 解放龙虾双手          ║
╚═══════════════════════════════════════════╝
  `);
  
  console.log(`📌 当前策略: ${strategyDescriptions[strategy]}`);
  if (dryRun) {
    console.log('⚠️  DRY-RUN 模式：不实际发帖\n');
  }
  
  let browser;
  
  try {
    // 1. 启动浏览器
    console.log('🚀 启动浏览器...');
    browser = await chromium.launch({
      headless: false, // 需要可见以便 Twitter 操作
      args: ['--disable-blink-features=AutomationControlled']
    });
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    
    const page = await context.newPage();
    
    // 2. 打开测试页
    console.log('📍 打开 SBTI 测试页...');
    await openTestPage({ page, browser });
    
    // 3. 点击开始
    console.log('🖱️ 点击"开始测试"...');
    await clickStartButton({ page, browser });
    
    // 4. 答题
    console.log(`📝 开始答题 (策略: ${strategy})...`);
    const { answered, errors } = await answerAllQuestions(
      { page, browser },
      strategy
    );
    
    console.log(`\n✅ 答题完成！ answered=${answered}, errors=${errors}`);
    
    // 5. 提交
    console.log('🚀 提交测试...');
    await submitTest({ page, browser });
    
    // 6. 截图
    console.log('📸 截图结果...');
    const screenshot = await screenshotResult({ page, browser });
    
    // 保存截图
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `sbti-result-${strategy}-${timestamp}.png`;
    const fs = await import('fs');
    fs.writeFileSync(filename, screenshot);
    console.log(`💾 截图已保存: ${filename}`);
    
    // 7. 生成推文
    const tweet = generateTweet({
      type: '待解析',
      description: '完整测试已自动完成',
      rawAnswers: {}
    });
    
    console.log('\n📤 推文预览:');
    console.log('─'.repeat(50));
    console.log(tweet);
    console.log('─'.repeat(50));
    
    if (!dryRun) {
      // TODO: 调用 Twitter API 发帖
      console.log('\n⚠️ 自动发帖功能待实现');
      console.log('   请手动复制上方内容发帖');
    } else {
      console.log('\n✅ DRY-RUN 完成，未实际发帖');
    }
    
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  console.log('\n🎉 测试完成！');
}

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n\n👋 再见！');
  process.exit(0);
});

main();
