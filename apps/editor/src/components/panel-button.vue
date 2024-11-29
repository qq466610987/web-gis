<script setup lang="ts">
interface Props {
  text?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: string
}

defineProps<Props>()
</script>

<template>
  <div class="panel-button">
    <el-icon class="text-2xl">
      <slot name="icon"></slot>
    </el-icon>
    <span>{{ text }}</span>
  </div>
</template>

<style scoped lang="scss">
.panel-button {
  min-width: 50px;
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;

  &:hover {
    color: #409eff;
  }
}
</style>
