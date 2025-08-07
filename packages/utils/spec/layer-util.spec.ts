import { describe, expect, test, vi } from 'vitest'
import LayerUtil from '../src/layer-util'

describe('LayerUtils', () => {
  test('可以正确的创建天地图', () => {
    const layers = [
      LayerUtil.createTdtVecLayer(),
      LayerUtil.createTdtImageLayer(),
      LayerUtil.createTdtImageAnoLayer(),
    ]
    layers.forEach((layer) => {
      expect(layer).not.toBeNull()
      expect(layer.getSource()?.getUrls()?.length).toBe(8)
    })
    
  })
})
