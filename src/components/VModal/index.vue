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
  const modalWrapper = document.querySelector('.modal-wrapper')

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
    <div v-if="show" class="modal-wrapper">
      <div class="modal">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style src="./VModal.scss" lang="scss" scoped />
