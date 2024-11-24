<template>
  <div class="panel-content">
    <el-space direction="vertical" size="large" fill>
      <el-radio-group v-model="drawType" class="draw-tools" @change="handleDrawTypeChange">
        <el-radio-button label="Point">
          <el-icon><Location /></el-icon>
          点
        </el-radio-button>
        <el-radio-button label="LineString">
          <el-icon><Share /></el-icon>
          线
        </el-radio-button>
        <el-radio-button label="Polygon">
          <el-icon><Select /></el-icon>
          面
        </el-radio-button>
      </el-radio-group>
      
      <el-button type="primary" @click="handleStartDraw" :disabled="!drawType">
        开始绘制
      </el-button>
      
      <el-button @click="handleStopDraw">
        停止绘制
      </el-button>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDrawStore } from '@/stores/drawStore'

const drawStore = useDrawStore()
const drawType = ref<'Point' | 'LineString' | 'Polygon'>('Point')

const handleDrawTypeChange = (type: 'Point' | 'LineString' | 'Polygon') => {
  drawType.value = type
}

const handleStartDraw = () => {
  drawStore.startDraw(drawType.value)
}

const handleStopDraw = () => {
  drawStore.stopDraw()
}
</script>

<style scoped lang="scss">
.panel-content {
  padding: 20px;
  
  .draw-tools {
    display: flex;
    gap: 10px;
    
    .el-radio-button {
      flex: 1;
      
      :deep(.el-radio-button__inner) {
        width: 100%;
      }
    }
  }
}
</style> 