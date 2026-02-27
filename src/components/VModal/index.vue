<script setup>
import { toRef, watch } from 'vue'

const props = defineProps({
  show: {
    type: String,
    default: 'true',
  },
})

const show = toRef(props, 'show')

const emit = defineEmits(['on-close'])
const onClose = () => {
  emit('on-close')
}

// 点击背景关闭模态框
const onBackgroundClicked = (e) => {
  const modalWrapper = document.querySelector('.modal-wrapper')

  if (e.target === modalWrapper) {
    onClose()
  }
}

// 按下 Esc 键关闭模态框
const onEscapeKeyClicked = (e) => {
  if (e.key === 'Escape') {
    onClose()
  }
}

// 处理事件监听
const watchHandler = (canShow) => {
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
    <div v-if="show" class="modal-wrapper">
      <div class="modal">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style src="./VModal.scss" lang="scss" scoped />
