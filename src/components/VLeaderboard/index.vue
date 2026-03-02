<script setup lang="ts">
import type { LeaderboardEntry } from '@/types'

// 定义 props
interface Props {
  leaderboard: LeaderboardEntry[]
}

// 使用 defineProps 接收 props
defineProps<Props>()
</script>

<template>
  <section id="leaderboard" class="leaderboard">
    <h2 class="leaderboard__title">排行榜</h2>

    <div v-if="leaderboard.length" class="leaders leaderboard__leaders">
      <template v-for="(leader, index) in leaderboard" :key="index">
        <div class="leader">
          <div class="leader__image-box">
            <img
              :src="leader.image"
              :alt="leader.characterName"
              class="leader__image"
            />
          </div>

          <span
            style="color: firebrick; font-weight: 700"
            class="leader__name"
            >{{ leader.userName }}</span
          >
          <span class="leader__name">{{ leader.characterName }}</span>
          <span class="leader__score">{{ leader.score }} 分</span>
        </div>
      </template>
    </div>

    <div v-else class="leaderboard__empty">
      <span>暂无评分记录...</span>
    </div>
  </section>
</template>

<style src="./VLeaderboard.scss" lang="scss" scoped />
