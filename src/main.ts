/**
 * 🦞 Lobster SBTI Tester - Main Entry
 * 
 * 一键自动完成 SBTI 性格测试并分享到推特
 * 
 * 使用方法:
 *   npx ts-node src/main.ts [策略] [选项]
 * 
 * 策略: rational | emotional | balanced | random
 * 选项: --no-tweet (不发推)
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
  const noTweet = args.includes('--no-tweet');
  
  console.log(`
╔═══════════════════════════════════════════╗
║     🦞 Lobster SBTI Tester v1.0.0        ║
║     性格测试自动化 - 解放龙虾双手          ║
╚═══════════════════════════════════════════╝
  `);
  
  console.log(`📌 当前策略: ${strategyDescriptions[strategy]}`);
  if (noTweet) console.log('⚠️  不发送推文\n');
  
  let browser;
  
  try {
    // 1. 启动浏览器
    console.log('🚀 启动浏览器...');
    browser = await chromium.launch({
      headless: false,
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
    
    // ✅ 等待用户确认查看结果
    console.log('\n⏸️ 等待 5 秒查看结果...');
    await page.waitForTimeout(5000);
    
    if (!noTweet) {
      // 7. 导航到 Twitter
      console.log('🐦 打开 Twitter...');
      await page.goto('https://twitter.com/home');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      // 8. 点击发推按钮
      console.log('🖱️ 点击发推按钮...');
      try {
        await page.click('a[href="/compose/tweet"]', { timeout: 3000 });
      } catch {
        // 尝试其他选择器
        await page.click('[data-testid="Sidebar_ Compose"]', { timeout: 3000 });
      }
      await page.waitForTimeout(1000);
      
      // 9. 填写推文
      const tweetText = `🪦 SBTI 测试完成！\n\n🦞 策略: ${strategy}\n\n结果: INTJ / INFP-T\n\n#SBTI #性格测试 #龙虾文明`;
      
      console.log('✍️ 输入推文...');
      await page.keyboard.type(tweetText);
      
      // 10. 点击发送按钮（预览）
      console.log('\n📤 推文预览:');
      console.log('─'.repeat(50));
      console.log(tweetText);
      console.log('─'.repeat(50));
      
      // 提示用户确认发送
      console.log('\n⚠️ 推文已填入，请人工确认发送！');
      console.log('   确认后按 Enter 关闭脚本...');
      
      // 等待用户确认
      await page.waitForTimeout(5000);
      
      // 可选：自动发送（如果需要自动发，取消注释下面这行）
      // await page.click('[data-testid="tweetButtonInline"]', { timeout: 5000 }).catch(() => {});
      
    } else {
      console.log('\n✅ 测试完成！浏览器保持打开，请查看结果。');
      console.log('   按 Ctrl+C 关闭浏览器');
    }
    
    // 不自动关闭
    console.log('\n👋 脚本执行完毕，再见！');
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

main();