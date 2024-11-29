import WModal from '@/components/modal/modal.vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

describe('Modal组件', () => {
  it('renders correctly', () => {
    const wrapper = mount(() => WModal)
    expect(wrapper.exists()).toBe(true)
  })
  it('可以正确的根据props渲染位置', () => {
    const wrapper = mount(WModal, {
      props: {
        top: '100px',
        left: '100px',
        visible: true,
        isDraggable: false
      },
    })
    expect(wrapper.find('.w-modal').style.top).toBe('100px')
    expect(wrapper.find('.w-modal').style.left).toBe('100px')
  })
})
