// 测验题目选项接口
export interface QuizItem {
  id: number
  title: string
}

// 测验题目接口
export interface Quiz {
  title: string
  items: QuizItem[]
  currectAnswer: number
  response: {
    win: string
    lose: string
  }
}

// 角色接口
export interface Character {
  name: string
  summary: string
  image: string
  minimumScore: number
}

// 排行榜记录接口
export interface LeaderboardEntry {
  name: string
  image: string
  score: number
}

// 答题状态类型
export type QuizStatus = 'win' | 'lose' | 'timeout' | null
