<template>
  <el-container class="layout-container">
    <el-header class="header" height="auto">
      <div class="ribbon">
        <el-tabs type="card" class="tool-tabs"> </el-tabs>
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
import { ref, onMounted, computed } from "vue";
import { Map, View } from "ol";
import { LayerUtil } from "@web-gis/utils";

const mapContainer = ref<HTMLElement>();
// 创建地图实例
let map: Map | null = null;

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
  border-bottom: 1px solid #dcdfe6;
  background: #f5f7fa;
}

.ribbon {
  .tool-tabs {
    :deep(.el-tabs__header) {
      margin: 0;

      .el-tabs__nav {
        border: none;
      }

      .el-tabs__item {
        height: 32px;
        line-height: 32px;
        border: none;

        &.is-active {
          background: #fff;
        }

        .tab-label {
          font-size: 14px;
        }
      }
    }

    :deep(.el-tabs__content) {
      padding: 8px;
      background: #fff;
    }
  }
}

.ribbon-content {
  display: flex;
  gap: 16px;
  padding: 4px 0;

  .ribbon-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;
    border-right: 1px solid #dcdfe6;

    &:last-child {
      border-right: none;
    }

    .group-title {
      font-size: 12px;
      color: #606266;
      margin-bottom: 4px;
    }

    .group-content {
      display: flex;
      gap: 4px;

      .el-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: auto;
        padding: 4px 8px;

        .el-icon {
          font-size: 20px;
          margin-bottom: 2px;
        }
      }
    }
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
