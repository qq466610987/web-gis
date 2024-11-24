<template>
  <div class="panel-content">
    <el-space direction="vertical" size="large" fill>
      <el-button type="primary" @click="showAddLayerDialog">
        <el-icon><Plus /></el-icon>
        添加图层
      </el-button>

      <el-input
        v-model="searchKeyword"
        placeholder="搜索图层"
        prefix-icon="Search"
      />
      
      <el-tree
        :data="layerTree"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        @check="handleLayerVisibilityChange"
      >
        <template #default="{ node, data }">
          <el-space align="center" :size="12">
            <el-icon><component :is="getLayerIcon(data.type)" /></el-icon>
            <span>{{ node.label }}</span>
            <el-space v-if="!data.isGroup">
              <el-slider 
                v-model="data.opacity" 
                :min="0" 
                :max="1" 
                :step="0.1"
                style="width: 80px"
                @change="(val) => handleOpacityChange(data.id, val)"
              />
              <el-button 
                type="danger" 
                link
                @click.stop="handleRemoveLayer(data.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-space>
          </el-space>
        </template>
      </el-tree>
    </el-space>

    <!-- 添加图层对话框 -->
    <el-dialog
      v-model="addLayerDialogVisible"
      title="添加图层"
      width="500px"
    >
      <el-form ref="formRef" :model="layerForm" label-width="100px">
        <el-form-item label="图层名称" prop="name">
          <el-input v-model="layerForm.name" />
        </el-form-item>
        
        <el-form-item label="图层类型" prop="type">
          <el-select v-model="layerForm.type" style="width: 100%">
            <el-option label="XYZ 瓦片服务" value="xyz" />
            <el-option label="WMS 服务" value="wms" />
            <el-option label="GeoJSON" value="geojson" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="服务地址" prop="url">
          <el-input v-model="layerForm.url" />
        </el-form-item>

        <template v-if="layerForm.type === 'wms'">
          <el-form-item label="图层" prop="params.LAYERS">
            <el-input v-model="layerForm.params.LAYERS" />
          </el-form-item>
          
          <el-form-item label="版本" prop="params.VERSION">
            <el-input v-model="layerForm.params.VERSION" />
          </el-form-item>
        </template>
      </el-form>
      
      <template #footer>
        <el-button @click="addLayerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddLayer">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLayerStore, type LayerConfig } from '@/stores/layerStore'
import { nanoid } from 'nanoid'

const layerStore = useLayerStore()
const searchKeyword = ref('')
const addLayerDialogVisible = ref(false)

const layerForm = ref<Partial<LayerConfig>>({
  name: '',
  type: 'xyz',
  url: '',
  visible: true,
  opacity: 1,
  zIndex: 0,
  params: {
    VERSION: '1.1.1',
    LAYERS: ''
  }
})

const layerTree = computed(() => {
  const tree = [
    {
      id: 'base',
      label: '底图',
      isGroup: true,
      children: [
        { id: 'osm', label: 'OpenStreetMap', type: 'xyz' }
      ]
    },
    {
      id: 'overlay',
      label: '业务图层',
      isGroup: true,
      children: Array.from(layerStore.layers.values()).map(layer => ({
        id: layer.id,
        label: layer.name,
        type: layer.type,
        opacity: layer.opacity
      }))
    }
  ]

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    return tree.map(group => ({
      ...group,
      children: group.children.filter(item => 
        item.label.toLowerCase().includes(keyword)
      )
    }))
  }

  return tree
})

const getLayerIcon = (type: string) => {
  switch (type) {
    case 'xyz':
    case 'wms':
      return 'Picture'
    case 'geojson':
      return 'Location'
    default:
      return 'Folder'
  }
}

const showAddLayerDialog = () => {
  layerForm.value = {
    name: '',
    type: 'xyz',
    url: '',
    visible: true,
    opacity: 1,
    zIndex: layerStore.layers.size,
    params: {
      VERSION: '1.1.1',
      LAYERS: ''
    }
  }
  addLayerDialogVisible.value = true
}

const handleAddLayer = () => {
  const config: LayerConfig = {
    id: nanoid(),
    name: layerForm.value.name!,
    type: layerForm.value.type!,
    url: layerForm.value.url!,
    visible: true,
    opacity: 1,
    zIndex: layerStore.layers.size,
    params: layerForm.value.params
  }

  layerStore.createLayer(config)
  addLayerDialogVisible.value = false
}

const handleLayerVisibilityChange = (data: any, { checkedKeys }: any) => {
  if (data.isGroup) return
  
  layerStore.updateLayer(data.id, {
    visible: checkedKeys.includes(data.id)
  })
}

const handleOpacityChange = (id: string, opacity: number) => {
  layerStore.updateLayer(id, { opacity })
}

const handleRemoveLayer = (id: string) => {
  layerStore.removeLayer(id)
}
</script>

<style scoped lang="scss">
.panel-content {
  padding: 20px;
}

:deep(.el-tree-node__content) {
  height: auto;
  padding: 8px 0;
}
</style> 