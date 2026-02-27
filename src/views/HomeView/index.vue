<script setup lang="ts">
import { ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout/index.vue'
import VLeaderboard from '@/components/VLeaderboard/index.vue'
import type { LeaderboardEntry } from '@/types'

const leaderboard = ref<LeaderboardEntry[]>([])

// 从 localStorage 读取排行榜数据
const storedLeaderboard = localStorage.getItem('leaderboard')
if (storedLeaderboard) {
  leaderboard.value = JSON.parse(storedLeaderboard)
}
</script>

<template>
  <DefaultLayout>
    <header class="header">
      <span class="header__text">准备好来一场小测验了吗？</span>
      <RouterLink class="header__link" to="/quiz">开始新测验</RouterLink>
    </header>

    <VLeaderboard :leaderboard="leaderboard" class="leaderboard" />
  </DefaultLayout>
</template>

<style src="./HomeView.scss" lang="scss" scoped />
