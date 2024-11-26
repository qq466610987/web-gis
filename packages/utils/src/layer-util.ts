import ImageLayer from 'ol/layer/Image'
import TileLayer from 'ol/layer/Tile'
import { XYZ } from 'ol/source.js'
import { ImageWMS } from 'ol/source'
import { Options as ImageLayerOptions } from 'ol/layer/Image'
import { Options as WMSSourceOptions } from 'ol/source/ImageWMS'
import ImageSource from 'ol/source/Image'
import Tile from 'ol/Tile'

interface GeoserverWMSOptions {
  url: string;
  layerName: string;
  workspace?: string;
  sourceOptions?: Partial<WMSSourceOptions>;
  layerOptions?: Partial<ImageLayerOptions>;
}

/**
 * 图层工具类
 * 用于创建各种地图图层，包括天地图底图和 GeoServer 服务图层
 */
export default class LayerUtil {
  private static TDT_TOKEN = '0f2b24825c004c4f2179d093c9bf2f7b'

  constructor(TDT_TOKEN = '0f2b24825c004c4f2179d093c9bf2f7b') {
    LayerUtil.TDT_TOKEN = TDT_TOKEN
  }

  /**
   * 创建天地图矢量图层
   * TODO: 需要实现具体逻辑
   */
  static createTdtVecLayer(): TileLayer<XYZ> {
    return new TileLayer({
      source: new XYZ({
        url: `http://t{0-7}.tianditu.gov.cn/cia_w/wmts?` +
          `SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img` +
          `&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${LayerUtil.TDT_TOKEN}`,
      }),
      maxZoom: 18,
    })
  }

  static createTdtImageLayer(): TileLayer {
    return new TileLayer({
      source: new XYZ({
        url: `http://t{0-7}.tianditu.gov.cn/img_w/wmts?` +
          `SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img` +
          `&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${LayerUtil.TDT_TOKEN}`,
      }),
      maxZoom: 18,
    })
  }

  static createTdtImageAnoLayer(): TileLayer {
    return new TileLayer({
      source: new XYZ({
        url: `http://t{0-7}.tianditu.gov.cn/cia_w/wmts?` +
          `SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia` +
          `&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${LayerUtil.TDT_TOKEN}`,
      }),
      maxZoom: 18,
    })
  }

  static createGeoserverWMSLayer(options: GeoserverWMSOptions): ImageLayer<ImageWMS> {
    // 默认配置
    const {
      url = 'http://36.134.229.118:8081/geoserver/wms',
      layerName,
      workspace = 'publicuse',
      sourceOptions = {},
      layerOptions = {},
    } = options

    return new ImageLayer({
      source: new ImageWMS({
        url,
        params: {
          LAYERS: `${workspace}:${layerName}`,
          TILED: true,
          SRS: 'EPSG:4490',
          ...sourceOptions.params,
        },
        serverType: 'geoserver',
        ...sourceOptions,
      }),
      opacity: 0.5,
      ...layerOptions,
    })
  }

  static createGeoserverWMTSLayer(): ImageLayer {
    return new ImageLayer({})
  }
}

