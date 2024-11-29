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
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;

  &:hover {
    background-color: #6f7174;
    border-radius: 8px;
  }
}
</style>
