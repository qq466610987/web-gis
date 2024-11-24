<template>
  <el-container class="layout-container">
    <el-header class="header" height="auto">
      <div class="ribbon">
        <el-tabs v-model="activePanel" type="card" class="tool-tabs">
          <el-tab-pane 
            v-for="item in toolPanels" 
            :key="item.key"
            :name="item.key"
          >
            <template #label>
              <span class="tab-label">{{ item.label }}</span>
            </template>
            
            <!-- 工具栏内容 -->
            <div class="ribbon-content">
              <template v-if="item.key === 'baseMap'">
                <el-button-group>
                  <el-button type="primary">
                    <template #icon>
                      <el-icon></el-icon>
                    </template>
                    OpenStreetMap
                  </el-button>
                  <el-button>
                    <template #icon>
                      <el-icon><Picture /></el-icon>
                    </template>
                    卫星影像
                  </el-button>
                </el-button-group>
              </template>

              <template v-if="item.key === 'draw'">
                <div class="ribbon-group">
                  <div class="group-title">绘制工具</div>
                  <div class="group-content">
                    <el-button-group>
                      <el-button>
                        <template #icon>
                          <el-icon><Location /></el-icon>
                        </template>
                        点
                      </el-button>
                      <el-button>
                        <template #icon>
                          <el-icon><Share /></el-icon>
                        </template>
                        线
                      </el-button>
                      <el-button>
                        <template #icon>
                          <el-icon><Select /></el-icon>
                        </template>
                        面
                      </el-button>
                    </el-button-group>
                  </div>
                </div>
                
                <div class="ribbon-group">
                  <div class="group-title">编辑工具</div>
                  <div class="group-content">
                    <el-button-group>
                      <el-button>
                        <template #icon>
                          <el-icon><Edit /></el-icon>
                        </template>
                        编辑
                      </el-button>
                      <el-button>
                        <template #icon>
                          <el-icon><Delete /></el-icon>
                        </template>
                        删除
                      </el-button>
                    </el-button-group>
                  </div>
                </div>
              </template>

              <template v-if="item.key === 'layer'">
                <div class="ribbon-group">
                  <div class="group-title">图层操作</div>
                  <div class="group-content">
                    <el-button>
                      <template #icon>
                        <el-icon><Plus /></el-icon>
                      </template>
                      添加图层
                    </el-button>
                    <el-button>
                      <template #icon>
                        <el-icon><Upload /></el-icon>
                      </template>
                      导入数据
                    </el-button>
                  </div>
                </div>
              </template>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-header>
    
    <el-container>
      <el-main class="main-container">
        <div class="map-container" ref="mapContainer"></div>
      </el-main>
      
      <el-aside width="300px" class="panel-container">
        <component :is="sidePanel" v-if="sidePanel" />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { ToolPanelItem } from './types'
import BaseMapPanel from './components/panels/BaseMapPanel.vue'
import DrawPanel from './components/panels/DrawPanel.vue'
import LayerPanel from './components/panels/LayerPanel.vue'

const mapContainer = ref<HTMLElement>()
const activePanel = ref<'baseMap' | 'draw' | 'layer'>('baseMap')

const toolPanels: ToolPanelItem[] = [
  { key: 'baseMap', label: '开始', icon: 'Map' },
  { key: 'draw', label: '绘制', icon: 'EditPen' },
  { key: 'layer', label: '图层', icon: 'Files' }
]

const sidePanelComponents = {
  baseMap: BaseMapPanel,
  draw: DrawPanel,
  layer: LayerPanel
} as const

const sidePanel = computed(() => sidePanelComponents[activePanel.value])

// 创建地图实例
let map: Map | null = null

onMounted(() => {
  if (!mapContainer.value) return
  
  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  })
})
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