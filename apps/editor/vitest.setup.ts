import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'
import ElementPlus from 'element-plus'

// 配置全局设置
config.global.plugins = [ElementPlus]

// 配置全局 stubs
config.global.stubs = {
  transition: false,
  'el-icon': true
}

// 配置全局 mocks（如果需要）
config.global.mocks = {
  // ...
}
