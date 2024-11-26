export interface LayerConfig {
    id: string;
    name: string;
    type: 'xyz' | 'wms' | 'wmts' | 'geojson';
    url: string;
    visible: boolean;
    opacity: number;
    zIndex: number;
    params?: Record<string, any>;
}
export declare const useLayerStore: import('pinia').StoreDefinition<"layer", Pick<{
    layers: import('vue').Ref<Map<string, {
        id: string;
        name: string;
        type: "xyz" | "wms" | "wmts" | "geojson";
        url: string;
        visible: boolean;
        opacity: number;
        zIndex: number;
        params?: Record<string, any> | undefined;
    }> & Omit<Map<string, LayerConfig>, keyof Map<any, any>>, Map<string, LayerConfig> | (Map<string, {
        id: string;
        name: string;
        type: "xyz" | "wms" | "wmts" | "geojson";
        url: string;
        visible: boolean;
        opacity: number;
        zIndex: number;
        params?: Record<string, any> | undefined;
    }> & Omit<Map<string, LayerConfig>, keyof Map<any, any>>)>;
    olLayers: import('vue').Ref<Map<string, any> & Omit<Map<string, any>, keyof Map<any, any>>, Map<string, any> | (Map<string, any> & Omit<Map<string, any>, keyof Map<any, any>>)>;
    createLayer: (config: LayerConfig) => any;
    removeLayer: (id: string) => void;
    updateLayer: (id: string, updates: Partial<LayerConfig>) => void;
}, "layers" | "olLayers">, Pick<{
    layers: import('vue').Ref<Map<string, {
        id: string;
        name: string;
        type: "xyz" | "wms" | "wmts" | "geojson";
        url: string;
        visible: boolean;
        opacity: number;
        zIndex: number;
        params?: Record<string, any> | undefined;
    }> & Omit<Map<string, LayerConfig>, keyof Map<any, any>>, Map<string, LayerConfig> | (Map<string, {
        id: string;
        name: string;
        type: "xyz" | "wms" | "wmts" | "geojson";
        url: string;
        visible: boolean;
        opacity: number;
        zIndex: number;
        params?: Record<string, any> | undefined;
    }> & Omit<Map<string, LayerConfig>, keyof Map<any, any>>)>;
    olLayers: import('vue').Ref<Map<string, any> & Omit<Map<string, any>, keyof Map<any, any>>, Map<string, any> | (Map<string, any> & Omit<Map<string, any>, keyof Map<any, any>>)>;
    createLayer: (config: LayerConfig) => any;
    removeLayer: (id: string) => void;
    updateLayer: (id: string, updates: Partial<LayerConfig>) => void;
}, never>, Pick<{
    layers: import('vue').Ref<Map<string, {
        id: string;
        name: string;
        type: "xyz" | "wms" | "wmts" | "geojson";
        url: string;
        visible: boolean;
        opacity: number;
        zIndex: number;
        params?: Record<string, any> | undefined;
    }> & Omit<Map<string, LayerConfig>, keyof Map<any, any>>, Map<string, LayerConfig> | (Map<string, {
        id: string;
        name: string;
        type: "xyz" | "wms" | "wmts" | "geojson";
        url: string;
        visible: boolean;
        opacity: number;
        zIndex: number;
        params?: Record<string, any> | undefined;
    }> & Omit<Map<string, LayerConfig>, keyof Map<any, any>>)>;
    olLayers: import('vue').Ref<Map<string, any> & Omit<Map<string, any>, keyof Map<any, any>>, Map<string, any> | (Map<string, any> & Omit<Map<string, any>, keyof Map<any, any>>)>;
    createLayer: (config: LayerConfig) => any;
    removeLayer: (id: string) => void;
    updateLayer: (id: string, updates: Partial<LayerConfig>) => void;
}, "removeLayer" | "createLayer" | "updateLayer">>;
