<script setup lang="ts">
import { ElButton } from 'element-plus'

interface Props {
  text?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: string
}

defineProps<Props>()
</script>

<template>
  <div class="panel-button">
    <el-icon>
      <component :is="icon" />
    </el-icon>
    <span>{{ text }}</span>
  </div>
</template>

<style scoped lang="scss">
.panel-button {
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #409eff;
  }
}
</style>
