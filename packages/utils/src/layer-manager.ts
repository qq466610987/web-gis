import Map from "ol/Map";
import Layer from "ol/layer/Layer";

/**
 * 用于作为图层操作的统一入口
 * 
 */
class LayerManager {
  private LayerCollection: Layer[];
  
  constructor(map: Map) {}

  addLayer(layer: Layer) {
    this.LayerCollection.push(layer);
  }

  
  
}
