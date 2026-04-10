/**
 * SBTI 自动测试核心逻辑
 * 自动完成 31 道题目，支持多种选择策略
 */

export interface SBTIConfig {
  strategy: 'rational' | 'emotional' | 'balanced' | 'random';
  autoTweet: boolean;
  screenshot: boolean;
}

export interface Question {
  id: number;
  ref: string;
  options: {
    ref: string;
    text: string;
    type: 'A' | 'B' | 'C';
  }[];
}

export interface TestResult {
  type: string;
  description: string;
  rawAnswers: Record<number, string>;
}

/**
 * 选择策略函数
 * 返回要点击的选项 ref
 */
export function getChoice(strategy: string, questionId: number): 'A' | 'B' | 'C' {
  const seed = questionId;
  
  switch (strategy) {
    case 'rational':
      // 理性派：目标导向，果断，认同积极选项
      // C 选项通常是积极/目标导向的
      return 'C';
    
    case 'emotional':
      // 感性派：保守，安全第一
      // A 选项通常是保守/安全的
      return 'A';
    
    case 'balanced':
      // 平衡：中性选择
      // B 选项通常是中立/包容的
      return 'B';
    
    case 'random':
      // 随机种子基于题目 ID，保证可复现
      const rand = (seed * 17 + 31) % 3;
      return ['A', 'B', 'C'][rand] as 'A' | 'B' | 'C';
    
    default:
      return 'B';
  }
}

/**
 * 生成推文内容
 */
export function generateTweet(result: TestResult): string {
  const prefix = '🪦 SBTI 测试完成！\n\n🦞 类型：';
  const suffix = '\n\n#SBTI #性格测试 #龙虾文明';
  
  return `${prefix}${result.type}\n\n${result.description}${suffix}`;
}

/**
 * 解析测试结果页面
 * 从 URL 或页面内容提取类型
 */
export function parseResult(): TestResult {
  // 由于 SBTI 结果是动态加载的，这里返回解析后的占位符
  // 实际解析需要通过 screenshot 或 page content 获取
  return {
    type: 'INFP-T / INTJ-A',
    description: '哲学王型 - 理性与理想的结合',
    rawAnswers: {}
  };
}

/**
 * 策略说明文本
 */
export const strategyDescriptions: Record<string, string> = {
  rational: '🎯 理性派：目标导向，执行力强，适合策划者',
  emotional: '🌸 感性派：内心敏感，理想主义，适合艺术家',
  balanced: '⚖️ 平衡型：中立包容，温和稳健，适合调解者',
  random: '🎲 随机型：无厘头，纯娱乐，别当真'
};
