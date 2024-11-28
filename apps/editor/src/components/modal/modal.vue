<script setup lang="ts">
import { useDraggable } from '@web-gis/utils'
import { onMounted, ref, useTemplateRef } from 'vue'
import transitionEvents from './transition'

const props = defineProps({
  title: {
    type: String,
    default: '标题',
  },
})
const headerRef = useTemplateRef('headerRef')
const modalRef = useTemplateRef('modalRef')

onMounted(() => {
  if (modalRef.value && headerRef.value) {
    useDraggable(modalRef.value!, headerRef.value!, ref(true), document.getElementById('main-container')!)
  }
})

// 收起内容框
const isCollapse = ref(false)
</script>

<template>
  <div class="w-modal" ref="modalRef">
    <div class="w-modal__header" ref="headerRef">
      <slot name="header">
        <div>
          {{ title }}
        </div>
        <div class="text-lg flex gap-1">
          <el-icon class="w-modal-icon">
            <ArrowDownBold @click="isCollapse = !isCollapse" />
          </el-icon>
          <el-icon class="w-modal-icon">
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
  background-color: rgba(60, 56, 56, 0.462);
  position: absolute;
  z-index: 1001;
  min-width: 200px;
  resize: both;
  overflow: auto;
  &:resizing {
    border: 2px dashed rgb(7, 141, 230);
    opacity: 0.8;
    // 添加阴影效果
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    // 添加过渡效果
    transition: all 0.3s ease;
  }
}

.w-modal__header {
  display: flex;
  justify-content: space-between;
  border-bottom: 5px solid rgba(40, 35, 35, 0.77);
  padding: 8px 15px;
  user-select: none;
  &:hover {
    cursor: move;
    background-color: rgba(0, 0, 0, 0.541);
  }
}

.w-modal-icon {
  cursor: pointer;
  &:hover {
    color: rgb(7, 141, 230);
  }
}
.w-modal__body {
}

.w-modal-footer__resize {
  position: absolute;
  width: 12px;
  height: 12px;
  right: 0;
  bottom: 0;
  background: linear-gradient(-45deg, #58a 6px, transparent 0);
  &:hover {
    cursor: se-resize;
  }
}

.w-modal.g-resize::-webkit-resizer {
  background-color: transparent;
}
</style>
