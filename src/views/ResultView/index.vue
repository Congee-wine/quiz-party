<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import VModal from '@/components/VModal/index.vue'
import DefaultLayout from '@/layouts/DefaultLayout/index.vue'
import type { Character, LeaderboardEntry } from '@/types'

// Mock Api
import characters from '@/assets/mock/characters.json'

const router = useRouter()

const score = ref(0)
const isModalOpen = ref(false)

const character = computed(() => {
  // 从高到低查找匹配的角色
  return (
    (characters as Character[]).find((c) => score.value >= c.minimumScore) ||
    characters[characters.length - 1]
  )
})

onBeforeMount(() => {
  const storedScore = localStorage.getItem('score')
  if (storedScore) {
    score.value = JSON.parse(storedScore)
  }
})

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const updateLeaderboard = (newEntry: LeaderboardEntry) => {
  let leaderboard: LeaderboardEntry[] = []

  const storedLeaderboard = localStorage.getItem('leaderboard')
  if (storedLeaderboard) {
    leaderboard = JSON.parse(storedLeaderboard)
  }

  leaderboard.push(newEntry)
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
}

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
    <span class="result-view__description"
      >恭喜！您在本次测验中获得了 {{ score }} 分！</span
    >

    <div class="result-view__actions">
      <button class="result-view__show-results" @click="openModal">
        查看结果
      </button>
      <RouterLink to="/quiz" class="result-view__retry">重试</RouterLink>
    </div>
  </DefaultLayout>
</template>

<style src="./ResultView.scss" lang="scss" scoped />
