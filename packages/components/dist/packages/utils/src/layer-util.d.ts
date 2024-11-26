import { default as ImageLayer, Options as ImageLayerOptions } from 'ol/layer/Image';
import { default as TileLayer } from 'ol/layer/Tile';
import { XYZ } from 'ol/source.js';
import { ImageWMS } from 'ol/source';
import { Options as WMSSourceOptions } from 'ol/source/ImageWMS';

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
    private static TDT_TOKEN;
    constructor(TDT_TOKEN?: string);
    /**
     * 创建天地图矢量图层
     * TODO: 需要实现具体逻辑
     */
    static createTdtVecLayer(): TileLayer<XYZ>;
    static createTdtImageLayer(): TileLayer;
    static createTdtImageAnoLayer(): TileLayer;
    static createGeoserverWMSLayer(options: GeoserverWMSOptions): ImageLayer<ImageWMS>;
    static createGeoserverWMTSLayer(): ImageLayer;
}
export {};
