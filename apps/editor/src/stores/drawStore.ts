import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Draw, Modify } from 'ol/interaction'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { useMapStore } from './mapStore'

export const useDrawStore = defineStore('draw', () => {
  const mapStore = useMapStore()
  const drawSource = ref(new VectorSource())
  const drawLayer = ref(new VectorLayer({
    source: drawSource.value
  }))
  const currentDraw = ref<Draw | null>(null)

  function initDrawLayer() {
    if (!mapStore.map) return
    mapStore.map.addLayer(drawLayer.value)
  }

  function startDraw(type: 'Point' | 'LineString' | 'Polygon') {
    if (!mapStore.map) return
    
    // 清除之前的绘制工具
    stopDraw()
    
    currentDraw.value = new Draw({
      source: drawSource.value,
      type
    })
    
    mapStore.map.addInteraction(currentDraw.value)
  }

  function stopDraw() {
    if (!mapStore.map || !currentDraw.value) return
    mapStore.map.removeInteraction(currentDraw.value)
    currentDraw.value = null
  }

  return {
    drawSource,
    drawLayer,
    startDraw,
    stopDraw,
    initDrawLayer
  }
}) 