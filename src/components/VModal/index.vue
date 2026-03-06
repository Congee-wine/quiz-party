<script setup lang="ts">
import { toRef, watch } from 'vue'

// 定义 props
interface Props {
  show: boolean
}

const props = defineProps<Props>()

// 定义 emits
const emit = defineEmits<{
  'on-close': []
}>()

const show = toRef(props, 'show')

const onClose = () => {
  emit('on-close')
}

const onBackgroundClicked = (e: MouseEvent) => {
  const modalWrapper = document.querySelector('#modal-wrapper')

  if (e.target === modalWrapper) {
    onClose()
  }
}

const onEscapeKeyClicked = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose()
  }
}

const watchHandler = (canShow: boolean) => {
  if (canShow) {
    document.addEventListener('keyup', onEscapeKeyClicked)
    document.addEventListener('click', onBackgroundClicked)
  } else {
    document.removeEventListener('keyup', onEscapeKeyClicked)
    document.removeEventListener('click', onBackgroundClicked)
  }
}

watch(show, watchHandler, { immediate: true })
</script>

<template>
  <Transition name="modal">
    <!-- 
      - inset-0: 等同于 top-0 right-0 bottom-0 left-0，全屏覆盖
      - bg-custom-gray-200/10: 使用自定义灰色，透明度 10%（/10 表示 opacity: 0.1）
    -->
    <div
      v-if="show"
      id="modal-wrapper"
      class="fixed inset-0 flex items-center justify-center backdrop-blur-[8px] bg-custom-gray-200/10"
    >
      <!-- 
        - bg-white/60: 白色背景，透明度 60%
        - animate-modal-show: 自定义进入动画（需要在 CSS 中定义）
      -->
      <div
        class="rounded-2xl py-12 px-6 bg-white/70 shadow-sm animate-modal-show"
      >
        <slot />
      </div>
    </div>
  </Transition>
</template>

<!-- 
  保留部分 CSS 用于动画
  Tailwind v4 的动画需要在 CSS 中定义 @keyframes
  Vue 的 Transition 组件也需要 CSS 过渡类
-->
<style scoped>
/* Vue Transition 进入/离开过渡 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

/* 模态框进入动画 */
@keyframes modal-show {
  from {
    opacity: 0.7;
    margin-top: -10rem;
  }
  to {
    opacity: 1;
    margin-top: 0;
  }
}

/* 模态框离开动画 */
@keyframes modal-leave {
  from {
    opacity: 1;
    margin-top: 0;
  }
  to {
    opacity: 0;
    margin-top: -10rem; /* -160px */
  }
}

/* 应用动画 */
.animate-modal-show {
  animation: modal-show 0.5s forwards;
}

/* 离开时的动画 */
.modal-leave-to .animate-modal-show {
  animation: modal-leave 0.5s forwards;
}
</style>
