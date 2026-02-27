<script setup>
import DefaultLayout from '@/layouts/DefaultLayout/index.vue'

// Mock Api
import quizzesList from '@/assets/mock/quizzes.json'

// utils
import { shuffleArray } from '@/utils/index.js'

import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const step = ref(0)
const width = ref(100)
const timer = ref(null)
const statuses = ref([])

const router = useRouter()

// 将原始题目列表打乱顺序
const quizzes = computed(() => {
  return shuffleArray(quizzesList)
})

// 获取当前这道题的数据
const quiz = computed(() => {
  return quizzes.value[step.value]
})

// 将当前题目的选项打乱顺序
const answers = computed(() => {
  return shuffleArray(quiz.value.items)
})

const statusText = computed(() => {
  if (statuses.value[step.value] === 'timeout') {
    return '时间到了！'
  }

  // 如果答对了，返回胜利提示；否则返回失败提示
  return statuses.value[step.value] === 'win'
    ? quiz.value.response.win
    : quiz.value.response.lose
})

const stopTimer = () => {
  clearTimeout(timer.value)
  timer.value = null
}

// 启动/继续计时器 (这是一个递归调用的函数)
const startTimer = () => {
  // 如果时间到了，就停止计时器
  if (width.value <= 0) {
    return stopTimer()
  }

  // 宽度减1 (模拟倒计时)
  width.value -= 1
  // 每隔 100ms 重新执行自己一次
  timer.value = setTimeout(startTimer, 100)
}

// 计算最终得分
const calculateScore = () => {
  let score = 0

  // 遍历每道题的状态，答对加100分
  for (const status of statuses.value) {
    if (status === 'win') score += 100
  }

  // 计算时间奖励 (剩余时间越多，倍率越高)
  const timeLeft = width.value / 10
  const finalScore = Math.floor(score * timeLeft)

  return finalScore
}

// 切换到下一题
const changeStep = () => {
  setTimeout(() => {
    width.value = 100

    // 检查是否还有下一题
    if (step.value + 1 > quizzes.value.length - 1) {
      localStorage.setItem('score', JSON.stringify(calculateScore()))

      return router.push('/result')
    }

    step.value += 1

    startTimer()
  }, 3000)
}

const onWin = () => {
  statuses.value[step.value] = 'win'
}

const onLose = () => {
  statuses.value[step.value] = 'lose'
}

const onTimeout = () => {
  statuses.value[step.value] = 'timeout'
}

const checkAnswer = (answerId) => {
  stopTimer()

  quiz.value.currectAnswer === answerId ? onWin() : onLose()

  changeStep()
}

const counterClasses = (counter) => {
  if (statuses.value[counter]) {
    return `quiz-counters__couter quiz-counters__couter--${statuses.value[counter]}`
  }

  return `quiz-counters__couter quiz-counters__couter--${counter === step.value ? 'current' : 'normal'}`
}

watch(width, (value) => {
  if (value <= 0) {
    onTimeout()
    changeStep()
  }
})

onMounted(startTimer)
</script>

<template>
  <!-- 一个过渡动画，当状态出现时显示提示文字 -->
  <Transition name="fade">
    <div v-if="statuses[step]" :class="`status status--${statuses[step]}`">
      <span class="status__text">{{ statusText }}</span>
    </div>
  </Transition>

  <DefaultLayout class="quiz-view">
    <div class="timeout" :style="`width: ${width}%`"></div>

    <h1 class="quiz-view__title">{{ quiz.title }}</h1>

    <div class="quizzes quiz-view__quizzes">
      <template v-for="answer in answers" :key="answer.id">
        <div class="quiz" @click="checkAnswer(answer.id)">
          <span class="quiz__title">{{ answer.title }}</span>
        </div>
      </template>
    </div>

    <!-- 题目进度指示器 -->
    <div class="quiz-counters">
      <template v-for="counter in quizzes.length" :key="counter">
        <span :class="counterClasses(counter - 1)" />
      </template>
    </div>
  </DefaultLayout>
</template>

<style src="./QuizView.scss" lang="scss" scoped />
