<script setup>
import VModal from '@/components/VModal/index.vue'
import DefaultLayout from '@/layouts/DefaultLayout/index.vue'

// Mock Api
import characters from '@/assets/mock/characters.json'

import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const score = ref(0)
const isModalOpen = ref(false)

const router = useRouter()

const character = computed(() => {
  // 在 characters 数组中查找第一个 minimumScore <= score 的角色
  return characters.find((c) => score.value >= c.minimumScore)
})

// 组件挂载前执行
onBeforeMount(() => {
  if (localStorage.getItem('score')) {
    score.value = JSON.parse(localStorage.getItem('score'))
  }
})

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// 更新排行榜
const updateLeaderboard = (character) => {
  let leaderboard = []

  // 1. 先去本地存储拿旧的排行榜数据
  if (localStorage.getItem('leaderboard')) {
    leaderboard = JSON.parse(localStorage.getItem('leaderboard'))
  }

  // 2. 把新结果加进去
  leaderboard.push(character)
  // 3. 存回本地存储
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
}

// 用户点击“接受角色”按钮后的处理
const onCharacterSubmited = () => {
  updateLeaderboard({
    image: character.value.image,
    name: character.value.name,
    score: score.value,
  })

  isModalOpen.value = false
  router.push('/')
}
</script>

<template>
  <VModal :show="isModalOpen" @on-close="closeModal">
    <div class="character">
      <div class="character__avatar-box">
        <img
          :src="character.image"
          :alt="character.name"
          class="character__avatar"
        />
      </div>

      <span class="character__name">{{ character.name }}</span>

      <p class="character__summary">
        您成功获得了角色
        <span class="character__summary-bold">«{{ character.name }}»</span>！
        {{ character.summary }}
      </p>
    </div>

    <button class="action" @click="onCharacterSubmited">接受角色</button>
  </VModal>

  <DefaultLayout class="result-view">
    <h1 class="result-view__title">结束了！</h1>
    <span class="result-view__description">
      恭喜！您在本次测验中获得了 {{ score }} 分！
    </span>

    <div class="result-view__actions">
      <button class="result-view__show-results" @click="openModal">
        查看结果
      </button>
      <RouterLink to="/quiz" class="result-view__retry">重试</RouterLink>
    </div>
  </DefaultLayout>
</template>

<style src="./ResultView.scss" lang="scss" scoped />
