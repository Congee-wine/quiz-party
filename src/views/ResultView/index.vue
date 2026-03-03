<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Character, LeaderboardEntry } from '@/types'
import VModal from '@/components/VModal/index.vue'
import DefaultLayout from '@/layouts/DefaultLayout/index.vue'

// Hook
import { useLocalStorage } from '@/hooks/useLocalStorage'

// api
import { getCharactersService } from '@/api/quiz'

const router = useRouter()

const isModalOpen = ref(false)
const characters = ref<Character[]>([])

// 使用 Hook 管理 localStorage
const { data: score } = useLocalStorage<number>('score', 0)
const { data: userName } = useLocalStorage<string>('currentUser', '')
const { data: leaderboard, setValue: setLeaderboard } = useLocalStorage<
  LeaderboardEntry[]
>('leaderboard', [])

// 获取角色数据
const getCharacters = async () => {
  const res = await getCharactersService()
  characters.value = res
}
getCharacters()

const character = computed(() => {
  // 从高到低查找匹配的角色
  return (
    (characters.value as Character[]).find(
      (c) => score.value >= c.minimumScore,
    ) || characters.value[characters.value.length - 1]
  )
})

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const onCharacterSubmited = () => {
  // 使用 Hook 的方法更新排行榜
  const newEntry: LeaderboardEntry = {
    userName: userName.value,
    image: character.value.image,
    characterName: character.value.name,
    score: score.value,
  }

  // 添加新记录到排行榜
  setLeaderboard([...leaderboard.value, newEntry])

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
