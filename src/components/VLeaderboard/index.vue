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
  <section id="leaderboard" class="p-6">
    <h2 class="text-2xl font-bold text-custom-gray-900">排行榜</h2>

    <div
      v-if="leaderboard.length"
      class="mt-12 grid gap-6 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]"
    >
      <div
        v-for="(leader, index) in leaderboard"
        :key="index"
        class="flex flex-col items-center rounded-2xl px-16 py-8 bg-white border-2 border-primary"
      >
        <div
          class="overflow-hidden w-32 h-32 rounded-full border-[3px] border-primary"
        >
          <!-- object-cover: 保持比例裁剪-->
          <img
            :src="leader.image"
            :alt="leader.characterName"
            class="w-full h-full object-cover"
          />
        </div>

        <span class="text-xl mt-4 text-danger font-bold">
          {{ leader.userName }}
        </span>

        <span class="text-xl mt-4 text-custom-gray-900">
          {{ leader.characterName }}
        </span>

        <span class="font-bold text-xl mt-4 text-custom-gray-900">
          {{ leader.score }} 分
        </span>
      </div>
    </div>

    <div v-else class="mt-4 text-custom-gray-400 text-center">
      <span>暂无评分记录...</span>
    </div>
  </section>
</template>
