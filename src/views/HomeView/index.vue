<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { LeaderboardEntry } from '@/types'
import DefaultLayout from '@/layouts/DefaultLayout/index.vue'
import VLeaderboard from '@/components/VLeaderboard/index.vue'
import VModal from '@/components/VModal/index.vue'

const router = useRouter()

const { setValue: saveCurrentUser } = useLocalStorage('currentUser', '')
const { data: leaderboard } = useLocalStorage<LeaderboardEntry[]>(
  'leaderboard',
  [],
)

const isModalOpen = ref(false)
const userName = ref('')

// 打开模态框
const openModal = () => {
  isModalOpen.value = true
}

// 关闭模态框
const closeModal = () => {
  isModalOpen.value = false
  userName.value = ''
}

// 开始测验
const startQuiz = () => {
  if (userName.value.trim()) {
    // 保存用户名到 localStorage
    saveCurrentUser(userName.value.trim())
    // 跳转到测验页
    router.push('/quiz')
    closeModal()
  }
}
</script>

<template>
  <!-- 用户名输入模态框 -->
  <VModal :show="isModalOpen" @on-close="closeModal">
    <div class="max-w-md p-4">
      <h2 class="font-bold text-custom-gray-900 text-2xl text-center mb-3">
        欢迎来到趣问派对o(*￣▽￣*)ブ
      </h2>
      <p class="text-custom-gray-600 text-sm text-center mb-8">
        请输入您的名字开始游戏
      </p>

      <div class="relative mb-6">
        <input
          v-model="userName"
          type="text"
          class="w-full text-base p-4 rounded-lg border-2 border-custom-gray-200 transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none hover:border-custom-gray-400 placeholder:text-custom-gray-400"
          placeholder="请输入您的名字"
          maxlength="20"
          @keyup.enter="startQuiz"
        />

        <!-- -bottom-6: 距底部 -24px（负值表示向下）-->
        <span class="absolute right-4 -bottom-6 text-xs text-custom-gray-400">
          {{ userName.length }}/20
        </span>
      </div>

      <div class="flex gap-3 mt-8">
        <!-- 
          disabled:opacity-50: 禁用时透明度 50%
          disabled:cursor-not-allowed: 禁用时鼠标样式
        -->
        <button
          class="flex-1 cursor-pointer font-bold text-white text-sm rounded-lg px-6 py-3.5 bg-primary border-2 border-primary transition-all duration-300 hover:bg-[#c72f32] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!userName.trim()"
          @click="startQuiz"
        >
          开始测验
        </button>

        <button
          class="flex-1 cursor-pointer font-bold text-primary text-sm rounded-lg px-6 py-3.5 bg-white border-2 border-primary transition-all duration-300 hover:bg-primary/5 hover:-translate-y-0.5 active:translate-y-0"
          @click="closeModal"
        >
          取消
        </button>
      </div>
    </div>
  </VModal>

  <DefaultLayout>
    <header
      class="flex items-center justify-between p-6 border-b border-custom-gray-200"
    >
      <span class="font-bold text-custom-gray-900 text-base">
        准备好来一场小测验了吗？
      </span>

      <button
        class="cursor-pointer font-bold text-white text-sm rounded-lg px-6 py-4 bg-primary transition-all duration-300 hover:bg-[#c72f32] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        @click="openModal"
      >
        开始新测验
      </button>
    </header>

    <VLeaderboard :leaderboard="leaderboard" class="mt-8" />
  </DefaultLayout>
</template>
