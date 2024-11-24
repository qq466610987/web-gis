import { defineStore } from 'pinia'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const map = ref<Map | null>(null)
  const currentBaseMap = ref<string>('osm')

  const baseMapSources = {
    osm: new OSM(),
    satellite: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    })
  }

  function initMap(target: HTMLElement) {
    map.value = new Map({
      target,
      layers: [
        new TileLayer({
          source: baseMapSources[currentBaseMap.value]
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    })
  }

  function changeBaseMap(type: keyof typeof baseMapSources) {
    if (!map.value) return
    
    currentBaseMap.value = type
    const layers = map.value.getLayers()
    const baseLayer = layers.getArray()[0]
    baseLayer.setSource(baseMapSources[type])
  }

  return {
    map,
    currentBaseMap,
    initMap,
    changeBaseMap
  }
}) 