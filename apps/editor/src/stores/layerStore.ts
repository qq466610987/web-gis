import { defineStore } from 'pinia'
import { ref } from 'vue'
import TileLayer from 'ol/layer/Tile'
import ImageLayer from 'ol/layer/Image'
import VectorLayer from 'ol/layer/Vector'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { useMapStore } from './mapStore'

export interface LayerConfig {
  id: string
  name: string
  type: 'xyz' | 'wms' | 'wmts' | 'geojson'
  url: string
  visible: boolean
  opacity: number
  zIndex: number
  params?: Record<string, any>
}

export const useLayerStore = defineStore('layer', () => {
  const mapStore = useMapStore()
  const layers = ref<Map<string, LayerConfig>>(new Map())
  const olLayers = ref<Map<string, TileLayer | ImageLayer | VectorLayer>>(new Map())

  function createLayer(config: LayerConfig) {
    let layer: TileLayer | ImageLayer | VectorLayer

    switch (config.type) {
      case 'xyz':
        layer = new TileLayer({
          source: new XYZ({
            url: config.url
          }),
          visible: config.visible,
          opacity: config.opacity,
          zIndex: config.zIndex
        })
        break

      case 'wms':
        layer = new TileLayer({
          source: new TileWMS({
            url: config.url,
            params: { ...config.params, 'TILED': true }
          }),
          visible: config.visible,
          opacity: config.opacity,
          zIndex: config.zIndex
        })
        break

      case 'geojson':
        layer = new VectorLayer({
          source: new VectorSource({
            url: config.url,
            format: new GeoJSON()
          }),
          visible: config.visible,
          opacity: config.opacity,
          zIndex: config.zIndex
        })
        break

      default:
        throw new Error(`Unsupported layer type: ${config.type}`)
    }

    layers.value.set(config.id, config)
    olLayers.value.set(config.id, layer)
    mapStore.map?.addLayer(layer)

    return layer
  }

  function removeLayer(id: string) {
    const layer = olLayers.value.get(id)
    if (layer) {
      mapStore.map?.removeLayer(layer)
      olLayers.value.delete(id)
      layers.value.delete(id)
    }
  }

  function updateLayer(id: string, updates: Partial<LayerConfig>) {
    const config = layers.value.get(id)
    const layer = olLayers.value.get(id)
    
    if (config && layer) {
      Object.assign(config, updates)
      
      if ('visible' in updates) {
        layer.setVisible(updates.visible!)
      }
      if ('opacity' in updates) {
        layer.setOpacity(updates.opacity!)
      }
      if ('zIndex' in updates) {
        layer.setZIndex(updates.zIndex!)
      }
    }
  }

  return {
    layers,
    olLayers,
    createLayer,
    removeLayer,
    updateLayer
  }
}) 