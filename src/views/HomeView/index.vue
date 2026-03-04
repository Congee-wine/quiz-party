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
    <!-- 
      模态框内容容器
      max-w-md: 最大宽度 448px (28rem)
      p-4: 内边距 16px
    -->
    <div class="max-w-md p-4">
      <!-- 
        标题
        font-bold: 粗体
        text-custom-gray-900: 黑色文字
        text-2xl: 字体大小 24px
        text-center: 居中对齐
        mb-3: 下边距 12px
      -->
      <h2 class="font-bold text-custom-gray-900 text-2xl text-center mb-3">
        欢迎来到趣问派对o(*￣▽￣*)ブ
      </h2>

      <!-- 
        描述文字
        text-custom-gray-600: 灰色文字
        text-sm: 字体大小 14px
        text-center: 居中
        mb-8: 下边距 32px
      -->
      <p class="text-custom-gray-600 text-sm text-center mb-8">
        请输入您的名字开始游戏
      </p>

      <!-- 
        表单容器
        relative: 相对定位（为了绝对定位的字符计数）
        mb-6: 下边距 24px
      -->
      <div class="relative mb-6">
        <!-- 
          输入框
          w-full: 宽度 100%
          text-base: 字体大小 16px
          p-4: 内边距 16px
          rounded-lg: 圆角 8px
          border-2: 边框 2px
          border-custom-gray-200: 边框颜色
          transition-all: 所有属性过渡
          duration-300: 过渡时间 300ms
          
          伪类：
          focus:border-primary: 聚焦时边框变红
          focus:ring-4: 聚焦时外圈 4px
          focus:ring-primary/10: 外圈颜色（primary 的 10% 透明度）
          focus:outline-none: 移除默认轮廓
          hover:border-custom-gray-400: 悬停时边框变深
          placeholder:text-custom-gray-400: 占位符颜色
        -->
        <input
          v-model="userName"
          type="text"
          class="w-full text-base p-4 rounded-lg border-2 border-custom-gray-200 transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none hover:border-custom-gray-400 placeholder:text-custom-gray-400"
          placeholder="请输入您的名字"
          maxlength="20"
          @keyup.enter="startQuiz"
        />

        <!-- 
          字符计数提示
          absolute: 绝对定位
          right-4: 距右边 16px
          -bottom-6: 距底部 -24px（负值表示向下）
          text-xs: 字体大小 12px
          text-custom-gray-400: 灰色
        -->
        <span class="absolute right-4 -bottom-6 text-xs text-custom-gray-400">
          {{ userName.length }}/20
        </span>
      </div>

      <!-- 
        按钮容器
        flex: 弹性布局
        gap-3: 间距 12px
        mt-8: 上边距 32px
      -->
      <div class="flex gap-3 mt-8">
        <!-- 
          主按钮（开始测验）
          flex-1: 占据剩余空间
          cursor-pointer: 鼠标指针
          font-bold: 粗体
          text-white: 白色文字
          text-sm: 字体大小 14px
          rounded-lg: 圆角 8px
          px-6: 左右内边距 24px
          py-3.5: 上下内边距 14px
          bg-primary: 主题色背景
          border-2: 边框 2px
          border-primary: 主题色边框
          transition-all: 所有属性过渡
          duration-300: 过渡时间 300ms
          
          伪类：
          hover:bg-[#c72f32]: 悬停时背景变深（自定义颜色用 []）
          hover:-translate-y-0.5: 悬停时向上移动 2px
          hover:shadow-lg: 悬停时添加阴影
          active:translate-y-0: 点击时回到原位
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

        <!-- 
          次按钮（取消）
          flex-1: 占据剩余空间
          cursor-pointer: 鼠标指针
          font-bold: 粗体
          text-primary: 主题色文字
          text-sm: 字体大小 14px
          rounded-lg: 圆角 8px
          px-6: 左右内边距 24px
          py-3.5: 上下内边距 14px
          bg-white: 白色背景
          border-2: 边框 2px
          border-primary: 主题色边框
          transition-all: 所有属性过渡
          duration-300: 过渡时间 300ms
          
          伪类：
          hover:bg-primary/5: 悬停时背景变为主题色的 5% 透明度
          hover:-translate-y-0.5: 悬停时向上移动 2px
          active:translate-y-0: 点击时回到原位
        -->
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
    <!-- 
      Header 容器
      flex: 弹性布局
      items-center: 垂直居中
      justify-between: 两端对齐
      p-6: 内边距 24px
      border-b: 底部边框
      border-custom-gray-200: 边框颜色
    -->
    <header
      class="flex items-center justify-between p-6 border-b border-custom-gray-200"
    >
      <!-- 
        Header 文字
        font-bold: 粗体
        text-custom-gray-900: 黑色
        text-base: 字体大小 16px
      -->
      <span class="font-bold text-custom-gray-900 text-base">
        准备好来一场小测验了吗？
      </span>

      <!-- 
        开始按钮
        cursor-pointer: 鼠标指针
        font-bold: 粗体
        text-white: 白色文字
        text-sm: 字体大小 14px
        rounded-lg: 圆角 8px
        px-6: 左右内边距 24px
        py-4: 上下内边距 16px
        bg-primary: 主题色背景
        transition-all: 所有属性过渡
        duration-300: 过渡时间 300ms
        hover:bg-[#c72f32]: 悬停时背景变深
        hover:-translate-y-0.5: 悬停时向上移动 2px
        hover:shadow-lg: 悬停时添加阴影
        active:translate-y-0: 点击时回到原位
      -->
      <button
        class="cursor-pointer font-bold text-white text-sm rounded-lg px-6 py-4 bg-primary transition-all duration-300 hover:bg-[#c72f32] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        @click="openModal"
      >
        开始新测验
      </button>
    </header>

    <!-- 
      排行榜容器
      mt-8: 上边距 32px
    -->
    <VLeaderboard :leaderboard="leaderboard" class="mt-8" />
  </DefaultLayout>
</template>

<!-- 不再需要 SCSS 文件，所有样式都用 Tailwind 类名 -->
