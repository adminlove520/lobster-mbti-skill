/**
 * SBTI Browser 自动化
 * 通过 CDP (Chrome DevTools Protocol) 自动完成测试
 */

import type { Browser, Page } from 'playwright';

export interface BrowserDriver {
  page: Page;
  browser: Browser;
}

/**
 * 打开 SBTI 测试页
 */
export async function openTestPage(driver: BrowserDriver): Promise<void> {
  await driver.page.goto('https://sbti.unun.dev/');
  await driver.page.waitForLoadState('domcontentloaded');
}

/**
 * 点击"开始测试"按钮
 */
export async function clickStartButton(driver: BrowserDriver): Promise<void> {
  await driver.page.waitForSelector('button:has-text("开始测试")');
  await driver.page.click('button:has-text("开始测试")');
  await driver.page.waitForTimeout(500);
}

/**
 * 获取当前页面进度 (如 "1 / 31")
 */
export async function getProgress(driver: BrowserDriver): Promise<string> {
  const text = await driver.page.textContent('body');
  const match = text?.match(/(\d+)\s*\/\s*31/);
  return match ? `${match[1]} / 31` : '0 / 31';
}

/**
 * 获取所有题目的选项 refs
 */
export async function getAllOptions(driver: BrowserDriver): Promise<{
  questionId: number;
  options: { ref: string; label: 'A' | 'B' | 'C' }[];
}[]> {
  const snapshot = await driver.page.evaluate(() => {
    const radios = Array.from(document.querySelectorAll('input[type="radio"]'));
    const result: { ref: string; label: string }[] = [];
    
    radios.forEach((radio, index) => {
      const id = radio.getAttribute('id') || '';
      result.push({ ref: id, label: String.fromCharCode(65 + (index % 3)) }); // A, B, or C
    });
    
    return result;
  });
  
  // 按题目分组
  const questions: {
    questionId: number;
    options: { ref: string; label: 'A' | 'B' | 'C' }[];
  }[] = [];
  
  for (let i = 0; i < snapshot.length; i += 3) {
    questions.push({
      questionId: Math.floor(i / 3) + 1,
      options: [
        { ref: snapshot[i].ref, label: 'A' },
        { ref: '[object Object]', label: 'B' },
        { ref: '[object Object]', label: 'C' }
      ]
    });
  }
  
  return questions;
}

/**
 * 答题策略类型
 */
type Strategy = 'rational' | 'emotional' | 'balanced' | 'random';

/**
 * 根据策略选择答案
 */
function chooseByStrategy(strategy: Strategy, questionIndex: number): 'A' | 'B' | 'C' {
  const seed = questionIndex + 1;
  
  switch (strategy) {
    case 'rational':
      // 理性派选 C
      return 'C';
    case 'emotional':
      // 感性派选 A
      return 'A';
    case 'balanced':
      // 平衡选 B
      return 'B';
    case 'random':
      // 随机
      return ['A', 'B', 'C'][(seed * 7 + 3) % 3] as 'A' | 'B' | 'C';
    default:
      return 'B';
  }
}

/**
 * 自动完成所有题目
 */
export async function answerAllQuestions(
  driver: BrowserDriver,
  strategy: Strategy = 'balanced'
): Promise<{ answered: number; errors: number }> {
  let answered = 0;
  let errors = 0;
  
  // 循环直到完成 31 题
  for (let q = 1; q <= 31; q++) {
    try {
      // 获取当前题目进度
      const progress = await getProgress(driver);
      console.log(`当前进度: ${progress}`);
      
      // 如果进度超过 31 说明做完了
      const currentQ = parseInt(progress.split('/')[0].trim());
      if (currentQ > q) {
        q = currentQ;
      }
      if (currentQ > 31) break;
      
      // 等待选项加载
      await driver.page.waitForTimeout(200);
      
      // 获取当前题目的选项
      const choice = chooseByStrategy(strategy, q - 1);
      
      // 点击对应选项 (A/B/C)
      const optionIndex = { A: 0, B: 1, C: 2 }[choice];
      
      // 找到所有未选的 radio buttons for current question
      const radios = await driver.page.locator('input[type="radio"]').all();
      
      // 计算当前题目的选项索引
      // 每道题 3 个选项，按题目顺序排列
      const questionStartIndex = (q - 1) * 3;
      const targetIndex = questionStartIndex + optionIndex;
      
      if (radios[targetIndex]) {
        await radios[targetIndex].click({ force: true });
        answered++;
        console.log(`Q${q}: 选择 ${choice}`);
      } else {
        // fallback: 尝试模糊匹配
        const label = choice === 'A' ? '不认同' : choice === 'B' ? '中立' : '认同';
        const clicked = await driver.page.locator(`input[type="radio"]`).filter({ hasText: new RegExp(`^${label}`) }).first().click({ force: true }).then(() => true).catch(() => false);
        
        if (clicked) {
          answered++;
          console.log(`Q${q}: 选择 ${choice} (fallback)`);
        } else {
          errors++;
          console.log(`Q${q}: 点击失败`);
        }
      }
      
      await driver.page.waitForTimeout(100);
      
    } catch (err) {
      console.error(`Q${q} 出错:`, err);
      errors++;
    }
  }
  
  return { answered, errors };
}

/**
 * 提交测试
 */
export async function submitTest(driver: BrowserDriver): Promise<void> {
  // 等待提交按钮可用
  await driver.page.waitForSelector('button:has-text("提交并查看结果")');
  await driver.page.click('button:has-text("提交并查看结果")');
  await driver.page.waitForTimeout(1000);
}

/**
 * 截图结果页
 */
export async function screenshotResult(driver: BrowserDriver): Promise<Buffer> {
  return await driver.page.screenshot({ fullPage: true }) as Buffer;
}
