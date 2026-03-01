import request from '@/utils/request'
import type { Quiz, Character } from '@/types'

/**
 * 获取所有测验题目
 */
export function getQuizzesService(): Promise<Quiz[]> {
  return request({
    url: '/api/quizzes',
    method: 'get',
  })
}

/**
 * 获取所有角色
 */
export function getCharactersService(): Promise<Character[]> {
  return request({
    url: '/api/characters',
    method: 'get',
  })
}
