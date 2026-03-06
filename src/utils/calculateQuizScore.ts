import type { QuizStatus } from '@/types'

/**
 * 计算测验分数的配置选项
 */
export interface CalculateScoreOptions {
  /**
   * 每题的基础分数
   * @default 100
   */
  scorePerQuestion?: number

  /**
   * 是否使用时间加成
   * 如果为 true，最终分数 = 基础分 × 时间系数
   * 如果为 false，最终分数 = 基础分
   * @default true
   */
  useTimeBonus?: boolean
}

/**
 * 计算测验最终分数
 * @param statuses - 答题状态数组，包含每道题的答题结果
 * @param timeLeft - 剩余时间（秒），用于计算时间加成
 * @param options - 可选配置项
 * @returns 最终分数（向下取整）
 */
export function calculateQuizScore(
  statuses: QuizStatus[],
  timeLeft: number,
  options: CalculateScoreOptions = {},
): number {
  // 解构配置选项，设置默认值
  const { scorePerQuestion = 100, useTimeBonus = true } = options

  // 1️⃣ 计算基础分数：统计答对的题目数
  let baseScore = 0
  for (const status of statuses) {
    if (status === 'win') {
      baseScore += scorePerQuestion
    }
  }

  // 2️⃣ 如果不使用时间加成，直接返回基础分数
  if (!useTimeBonus) {
    return baseScore
  }

  // 3️⃣ 计算最终分数：基础分 × 时间系数
  const finalScore = baseScore * timeLeft

  // 4️⃣ 向下取整并返回
  return Math.floor(finalScore)
}
