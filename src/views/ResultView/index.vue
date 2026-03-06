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
    <div class="flex flex-col items-center max-w-96">
      <div
        class="relative w-32 h-32 rounded-full overflow-hidden border-[3px] border-primary"
      >
        <!-- 
          头像图片
          - absolute inset-0: 绝对定位，填满父容器
          - w-full h-full: 宽高 100%
          - object-cover: 保持比例裁剪
        -->
        <img
          :src="character.image"
          :alt="character.name"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <span class="font-bold text-custom-gray-900 text-2xl mt-8">
        {{ character.name }}
      </span>

      <p class="text-center text-custom-gray-400 mt-6">
        您成功获得了角色
        <span class="font-bold text-custom-gray-900"
          >«{{ character.name }}»</span
        >！
        {{ character.summary }}
      </p>
    </div>

    <button
      class="w-full mt-12 px-6 py-4 rounded-lg font-bold text-sm text-white bg-primary border border-primary cursor-pointer outline-none"
      @click="onCharacterSubmited"
    >
      接受角色
    </button>
  </VModal>

  <!-- min-h-screen: 最小高度 100vh -->
  <DefaultLayout class="flex flex-col min-h-screen items-center justify-center">
    <h1 class="font-bold text-custom-gray-900 text-[28px]">结束了！</h1>

    <span class="text-custom-gray-400 mt-4">
      恭喜！您在本次测验中获得了 {{ score }} 分！
    </span>

    <div class="mt-14">
      <button
        class="px-6 py-4 rounded-lg font-bold text-sm text-white bg-primary border border-primary cursor-pointer outline-none"
        @click="openModal"
      >
        查看结果
      </button>

      <!-- inline-block: 行内块元素（让 padding 生效）-->
      <RouterLink
        to="/quiz"
        class="inline-block ml-4 px-6 py-4 rounded-lg font-bold text-sm text-primary border border-primary"
      >
        重试
      </RouterLink>
    </div>
  </DefaultLayout>
</template>

<style scoped>
/*
深度选择器：修改 VModal 内部样式，限制模态框的最大宽度
*/
:deep(.rounded-2xl) {
  max-width: 24rem;
}
</style>
