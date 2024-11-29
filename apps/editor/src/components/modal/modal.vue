<script setup lang="ts" name="WModal">
import type { ModalProps, ModalEmits, ModalSlots } from './types'
import { useDraggable } from '@web-gis/utils'
import { onMounted, ref, useTemplateRef } from 'vue'
import transitionEvents from './transition'

const props = withDefaults(defineProps<ModalProps>(), {
  title: '标题',
  isDraggable: true,
})

const emit = defineEmits<ModalEmits>()
defineSlots<ModalSlots>()

const headerRef = useTemplateRef('headerRef')
const modalRef = useTemplateRef('modalRef')

onMounted(() => {
  if (props.isDraggable === true && modalRef.value && headerRef.value) {
    useDraggable(modalRef.value!, headerRef.value!, ref(true), document.getElementById('main-container')!)
  }
})

// 收起内容框
const isCollapse = ref(false)
</script>

<template>
  <div class="w-modal" ref="modalRef" v-show="modelValue">
    <div class="w-modal__header" ref="headerRef">
      <slot name="header">
        <div>
          {{ title }}
        </div>
        <div class="flex gap-1 text-lg">
          <el-icon class="w-modal-icon">
            <ArrowDownBold @click="isCollapse = !isCollapse" />
          </el-icon>
          <el-icon class="w-modal-icon" @click="emit('update:modelValue', false)">
            <CloseBold />
          </el-icon>
        </div>
      </slot>
    </div>

    <transition name="slide" v-on="transitionEvents">
      <div class="w-modal-body__wrapper" v-show="!isCollapse">
        <slot>
          <div class="h-[100px]">内容</div>
        </slot>
      </div>
    </transition>
    <slot name="footer"></slot>
    <div class="w-modal-footer__resize" />
  </div>
</template>

<style lang="scss" scoped>
.w-modal {
  position: absolute;
  top: v-bind('top');
  left: v-bind('left');
  z-index: 1001;
  min-width: 200px;
  overflow: auto;
  resize: both;
  background-color: rgb(60 56 56 / 71.3%);
  box-shadow: 0 0 15px rgb(0 0 0 / 30%);
}

.w-modal__header {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  user-select: none;
  border-bottom: 5px solid rgb(40 35 35 / 77%);

  &:hover {
    cursor: move;
    background-color: rgb(0 0 0 / 54.1%);
  }
}

.w-modal-icon {
  cursor: pointer;

  &:hover {
    color: rgb(7 141 230);
  }
}

.w-modal__body {
}

.w-modal-footer__resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  background: linear-gradient(-45deg, #58a 6px, transparent 0);

  &:hover {
    cursor: se-resize;
  }
}

.w-modal.g-resize::-webkit-resizer {
  background-color: transparent;
}
</style>
