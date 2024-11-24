<template>
  <div class="panel-content">
    <el-radio-group v-model="currentBaseMap" @change="handleBaseMapChange">
      <el-radio-button label="osm">OpenStreetMap</el-radio-button>
      <el-radio-button label="satellite">卫星影像</el-radio-button>
    </el-radio-group>
    
    <div class="map-preview" v-if="previewUrl">
      <img :src="previewUrl" alt="底图预览">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '@/stores/mapStore'

const mapStore = useMapStore()
const currentBaseMap = computed(() => mapStore.currentBaseMap)

const previewUrls = {
  osm: '/previews/osm.png',
  satellite: '/previews/satellite.png'
}

const previewUrl = computed(() => previewUrls[currentBaseMap.value])

const handleBaseMapChange = (type: 'osm' | 'satellite') => {
  mapStore.changeBaseMap(type)
}
</script>

<style scoped lang="scss">
.panel-content {
  padding: 20px;
  
  .map-preview {
    margin-top: 20px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style> 