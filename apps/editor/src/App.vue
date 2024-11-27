<template>
  <el-container class="layout-container">
    <el-header class="header" height="auto">
      <div class="ribbon">
        <el-tabs type="border-card" class="tool-tabs" v-model="activeTab">
          <el-tab-pane label="视图" name="view">
            <div class="ribbon-content">
              <div class="ribbon-content__group">
                <PanelButton text="场景">
                  <template #icon>
                    <font-awesome-icon :icon="['fas', 'floppy-disk']" />
                  </template>
                </PanelButton>
              </div>
              <!-- 视角 -->
              <div class="ribbon-content__group">
                <PanelButton text="全球">
                  <template #icon>
                    <font-awesome-icon icon="globe" />
                  </template>
                </PanelButton>
                <PanelButton text="中国">
                  <template #icon>
                    <font-awesome-icon :icon="['fas', 'star']" />
                  </template>
                </PanelButton>
                <PanelButton text="自定义">
                  <template #icon>
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </template>
                </PanelButton>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="图层" name="layer">
            <div class="ribbon-content">
              <div class="ribbon-content__group">
                <PanelButton text="在线">
                  <template #icon>
                    <font-awesome-icon :icon="['fas', 'globe']" />
                  </template>
                </PanelButton>
                <PanelButton text="wmts">
                  <template #icon>
                    <i class="iconfont icon-WMTS"></i>
                  </template>
                </PanelButton>
                <PanelButton text="wms">
                  <template #icon>
                    <i class="iconfont icon-wms"></i>
                  </template>
                </PanelButton>
                <PanelButton text="xyz">
                  <template #icon>
                    <i class="iconfont icon-xyz"></i>
                  </template>
                </PanelButton>
                <PanelButton text="Arcgis">
                  <template #icon>
                    <i class="iconfont icon-ArcGIS"></i>
                  </template>
                </PanelButton>
                <PanelButton text="Geojson">
                  <template #icon>
                    <i class="iconfont icon-geojson"></i>
                  </template>
                </PanelButton>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="工具" name="tool">
            <div class="ribbon-content">
              <div class="ribbon-group"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-header>

    <el-container>
      <el-main class="main-container">
        <div class="map-container" ref="mapContainer"></div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Map, View } from "ol";
import { LayerUtil } from "@web-gis/utils";
import PanelButton from "./components/panel-button.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const mapContainer = ref<HTMLElement>();
// 创建地图实例
let map: Map | null = null;

type RibbonTab = "view" | "layer" | "tool";
const activeTab = ref<RibbonTab>("view");

onMounted(() => {
  if (!mapContainer.value) return;

  map = new Map({
    target: mapContainer.value,
    layers: [LayerUtil.createTdtImageLayer() as any],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });
});
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
}

.header {
  padding: 0;
}

.tool-tabs {
  :deep(.el-tabs__content) {
    padding: 5px;
  }
}

.ribbon {
  :deep(.el-tabs__item) {
    min-width: 80px;
  }
}

.ribbon-content {
  min-height: 50px;
  display: flex;
  gap: 16px;

  .ribbon-content__group {
    box-sizing: border-box;
    padding: 0 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 5px;
    border-right: 2px solid #6a6b6e;
  }
}

.main-container {
  padding: 0;
  position: relative;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.panel-container {
  border-left: 1px solid #dcdfe6;
  background: #fff;
}
</style>
