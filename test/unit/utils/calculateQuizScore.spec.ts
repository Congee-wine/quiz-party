import { describe, it, expect } from 'vitest'
import { calculateQuizScore } from '@/utils/calculateQuizScore'
import type { QuizStatus } from '@/types'

describe('calculateQuizScore', () => {
  // 测试用例 1：基础功能
  it('应该正确计算基础分数（全部答对）', () => {
    const statuses: QuizStatus[] = ['win', 'win', 'win']
    const timeLeft = 5
    const score = calculateQuizScore(statuses, timeLeft)

    // 3题 × 100分 × 5秒 = 1500分
    expect(score).toBe(1500)
  })

  // 测试用例 2：部分答对
  it('应该正确计算基础分数（部分答对）', () => {
    const statuses: QuizStatus[] = ['win', 'lose', 'win', 'timeout']
    const timeLeft = 3
    const score = calculateQuizScore(statuses, timeLeft)

    // 2题 × 100分 × 3秒 = 600分
    expect(score).toBe(600)
  })

  // 测试用例 3：全部答错
  it('应该返回 0 分（全部答错）', () => {
    const statuses: QuizStatus[] = ['lose', 'lose', 'timeout']
    const timeLeft = 5
    const score = calculateQuizScore(statuses, timeLeft)

    expect(score).toBe(0)
  })

  // 测试用例 4：空数组
  it('应该返回 0 分（空数组）', () => {
    const statuses: QuizStatus[] = []
    const timeLeft = 5
    const score = calculateQuizScore(statuses, timeLeft)

    expect(score).toBe(0)
  })

  // 测试用例 5：时间为 0
  it('应该返回 0 分（时间为 0）', () => {
    const statuses: QuizStatus[] = ['win', 'win']
    const timeLeft = 0
    const score = calculateQuizScore(statuses, timeLeft)

    expect(score).toBe(0)
  })

  // 测试用例 6：自定义每题分数
  it('应该支持自定义每题分数', () => {
    const statuses: QuizStatus[] = ['win', 'win']
    const timeLeft = 2
    const score = calculateQuizScore(statuses, timeLeft, {
      scorePerQuestion: 50,
    })

    // 2题 × 50分 × 2秒 = 200分
    expect(score).toBe(200)
  })

  // 测试用例 7：不使用时间加成
  it('应该支持禁用时间加成', () => {
    const statuses: QuizStatus[] = ['win', 'win', 'win']
    const timeLeft = 10
    const score = calculateQuizScore(statuses, timeLeft, {
      useTimeBonus: false,
    })

    // 3题 × 100分 = 300分（忽略时间）
    expect(score).toBe(300)
  })

  // 测试用例 8：向下取整
  it('应该向下取整（小数分数）', () => {
    const statuses: QuizStatus[] = ['win']
    const timeLeft = 2.7
    const score = calculateQuizScore(statuses, timeLeft)

    // 1题 × 100分 × 2.7秒 = 270分（向下取整）
    expect(score).toBe(270)
  })

  // 测试用例 9：组合配置
  it('应该支持组合配置选项', () => {
    const statuses: QuizStatus[] = ['win', 'lose', 'win']
    const timeLeft = 3
    const score = calculateQuizScore(statuses, timeLeft, {
      scorePerQuestion: 75,
      useTimeBonus: true,
    })

    // 2题 × 75分 × 3秒 = 450分
    expect(score).toBe(450)
  })
})
