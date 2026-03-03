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
    <div class="user-input">
      <h2 class="user-input__title">欢迎来到趣问派对o(*￣▽￣*)ブ</h2>
      <p class="user-input__description">请输入您的名字开始游戏</p>

      <div class="user-input__form">
        <input
          v-model="userName"
          type="text"
          class="user-input__field"
          placeholder="请输入您的名字"
          maxlength="20"
          @keyup.enter="startQuiz"
        />
        <span class="user-input__hint">{{ userName.length }}/20</span>
      </div>

      <div class="user-input__actions">
        <button
          class="user-input__button user-input__button--primary"
          :disabled="!userName.trim()"
          @click="startQuiz"
        >
          开始测验
        </button>
        <button
          class="user-input__button user-input__button--secondary"
          @click="closeModal"
        >
          取消
        </button>
      </div>
    </div>
  </VModal>

  <DefaultLayout>
    <header class="header">
      <span class="header__text">准备好来一场小测验了吗？</span>
      <button class="header__link" @click="openModal">开始新测验</button>
    </header>

    <VLeaderboard :leaderboard="leaderboard" class="leaderboard" />
  </DefaultLayout>
</template>

<style src="./HomeView.scss" lang="scss" scoped />
