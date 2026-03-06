<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Quiz, QuizStatus } from '@/types'
import DefaultLayout from '@/layouts/DefaultLayout/index.vue'

// Hook
import { useLocalStorage } from '@/hooks/useLocalStorage'

// api
import { getQuizzesService } from '@/api/quiz'

// utils
import shuffleArray from '@/utils/shuffleArray'

const router = useRouter()
const { setValue: saveScore } = useLocalStorage('score', 0)

const step = ref(0)
const width = ref(100)
const timer = ref<number | null>(null)
const statuses = ref<QuizStatus[]>([])
const quizzesList = ref<Quiz[]>([])

// 获取 quizzes 数据
const getQuizzes = async () => {
  const res = await getQuizzesService()
  quizzesList.value = res
}
getQuizzes()

const quizzes = computed(() => {
  return shuffleArray([...quizzesList.value]) as Quiz[]
})

const quiz = computed(() => {
  return quizzes.value[step.value]
})

const answers = computed(() => {
  return shuffleArray([...quiz.value.items])
})

const statusText = computed(() => {
  if (statuses.value[step.value] === 'timeout') {
    return '时间到了！'
  }

  return statuses.value[step.value] === 'win'
    ? quiz.value.response.win
    : quiz.value.response.lose
})

const stopTimer = () => {
  if (timer.value !== null) {
    clearTimeout(timer.value)
    timer.value = null
  }
}

const startTimer = () => {
  if (width.value <= 0) {
    return stopTimer()
  }

  width.value -= 1
  timer.value = window.setTimeout(startTimer, 100)
}

const calculateScore = () => {
  let score = 0

  for (const status of statuses.value) {
    if (status === 'win') score += 100
  }

  const timeLeft = width.value / 10
  const finalScore = Math.floor(score * timeLeft)

  return finalScore
}

const changeStep = () => {
  setTimeout(() => {
    width.value = 100

    // Check if next step is available or not
    if (step.value + 1 > quizzes.value.length - 1) {
      saveScore(calculateScore())

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

const checkAnswer = (answerId: number) => {
  stopTimer()

  quiz.value.currectAnswer === answerId ? onWin() : onLose()

  changeStep()
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
  <!-- 
    答题结果全屏遮罩 (status)
    Vue Transition 组件用于进入/离开动画
  -->
  <Transition name="fade">
    <div
      v-if="statuses[step]"
      :class="[
        'fixed inset-0 z-10 flex items-center justify-center text-center backdrop-blur-[8px]',
        {
          'bg-success/20 text-success': statuses[step] === 'win',
          'bg-danger/20 text-danger': statuses[step] === 'lose',
          'bg-custom-gray-400/20 text-custom-gray-400':
            statuses[step] === 'timeout',
        },
      ]"
    >
      <!-- 
        - max-[425px]:text-5xl: 小屏幕时使用 text-5xl（48px）
        - animate-status-show: 自定义进入动画
      -->
      <span
        class="font-black text-[80px] max-[425px]:text-5xl animate-status-show"
      >
        {{ statusText }}
      </span>
    </div>
  </Transition>

  <!-- min-h-screen: 最小高度 100vh -->
  <DefaultLayout v-if="quiz" class="flex min-h-screen flex-col">
    <div
      class="fixed top-0 right-0 h-1 bg-primary"
      :style="`width: ${width}%`"
    ></div>

    <!-- 
      - max-[1440px]:text-[28px]: 中等屏幕 28px
      - max-[425px]:text-xl: 小屏幕 20px
    -->
    <h1
      class="font-bold text-custom-gray-900 text-[44px] max-[1440px]:text-[28px] max-[425px]:text-xl"
    >
      {{ quiz.title }}
    </h1>

    <!-- 
      - max-[1440px]:mt-20: 中等屏幕 80px
      - quiz-container: 自定义类，用于 CSS counter
    -->
    <div
      class="gap-3 flex flex-wrap justify-center mt-32 max-[1440px]:mt-20 quiz-container"
    >
      <!-- 
        - even:mt-8 even:ml-12: 偶数卡片上边距 32px，左边距 48px
        - max-[425px]:even:ml-0: 小屏幕时取消左边距
        - max-[425px]:not-first:mt-10: 小屏幕时除第一个外都有上边距
      -->
      <template v-for="answer in answers" :key="answer.id">
        <div
          class="quiz-item relative flex items-center basis-[600px] max-[1440px]:basis-[491px] h-[136px] px-6 py-10 rounded border-2 border-primary/[0.086] bg-white cursor-pointer transition-all duration-300 ease hover:border-primary/[0.282] even:mt-8 even:ml-12 max-[425px]:even:ml-0 max-[425px]:not-first:mt-10"
          @click="checkAnswer(answer.id)"
        >
          <span class="text-xl text-custom-gray-900">{{ answer.title }}</span>
        </div>
      </template>
    </div>

    <div class="flex justify-center mt-10 gap-4">
      <template v-for="counter in quizzes.length" :key="counter">
        <span
          :class="[
            'h-6 border-2 border-primary',
            {
              // 普通状态：圆形
              'w-6 rounded-full':
                !statuses[counter - 1] && counter - 1 !== step,
              // 当前题目：椭圆形，浅色背景
              'w-12 rounded-full bg-primary/[0.086]':
                !statuses[counter - 1] && counter - 1 === step,
              // 超时：圆形，灰色背景
              'w-6 rounded-full bg-custom-gray-200':
                statuses[counter - 1] === 'timeout',
              // 答错：圆形，红色背景
              'w-6 rounded-full bg-danger': statuses[counter - 1] === 'lose',
              // 答对：圆形，绿色背景
              'w-6 rounded-full bg-success': statuses[counter - 1] === 'win',
            },
          ]"
        />
      </template>
    </div>
  </DefaultLayout>
</template>

<!-- 
  保留部分 CSS 用于特殊效果
  1. CSS Counter：用于答案卡片的编号圆圈
  2. Vue Transition：进入/离开动画
  3. @keyframes：自定义动画
-->
<style scoped>
/* 
  CSS Counter 用于答案编号
  这是 CSS 的原生功能，Tailwind 无法替代
  CSS计数器是一种强大的功能，允许你使用CSS来自动创建递增的数字，然后将这些数字插入到页面内容中。
  这使得创建有序列表、章节标题编号等变得非常灵活。
    - 要使用CSS计数器，主要有三个步骤：
    - 初始化 (Reset): 在某个父元素上创建一个新的计数器，并设定它的起始值（通常是0）。
    - 递增 (Increment): 在需要编号的子元素上，让计数器的值加一。
    - 显示 (Display): 使用 ::before 或 ::after 伪元素，将计数器的当前值显示出来。
*/
.quiz-container {
  counter-reset: quiz;
}

.quiz-item {
  counter-increment: quiz;
}

/* 
  编号圆圈（使用 ::before 伪元素）
  - 显示答案编号（1, 2, 3, 4...）
  - 圆形，白色背景，主题色边框
  - 定位在卡片左上角外侧
*/
.quiz-item::before {
  content: counter(quiz);
  position: absolute;
  top: -1.5rem;
  left: -1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-custom-gray-900);
  background-color: white;
  border: 3px solid var(--color-primary);
}

/* Vue Transition 进入/离开过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

/* 状态文本进入动画 */
@keyframes status-show {
  from {
    opacity: 0;
    margin-top: -10rem; /* -160px */
  }
  to {
    opacity: 1;
    margin-top: 0;
  }
}

/* 状态文本离开动画 */
@keyframes status-leave {
  from {
    opacity: 1;
    margin-top: 0;
  }
  to {
    opacity: 0;
    margin-top: -10rem; /* -160px */
  }
}

/* 应用动画 */
.animate-status-show {
  animation: status-show 0.5s forwards;
}

/* 离开时的动画 */
.fade-leave-to .animate-status-show {
  animation: status-leave 0.5s forwards;
}
</style>
