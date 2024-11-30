import { mount } from '@vue/test-utils'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import WModal from '@/components/modal/modal.vue'
import ElementPlus from 'element-plus'
import { ArrowDownBold, CloseBold } from '@element-plus/icons-vue'
import { nextTick } from 'vue'
// Mock useDraggable
vi.mock('@web-gis/utils', () => ({
  useDraggable: vi.fn()
}))

describe('WModal组件', () => {
  const createWrapper = (props = {}) => {
    return mount(WModal, {
      props: {
        title: '测试标题',
        modelValue: true,
        ...props
      },
      global: {
        plugins: [ElementPlus],
        components: {
          ArrowDownBold,
          CloseBold
        },
        stubs: {
          ArrowDownBold: true,
          CloseBold: true
        }
      },
      attachTo: document.body
    })
  }

  it('基础渲染测试', async () => {
    const wrapper = createWrapper()
    await nextTick()
    
    console.log(wrapper.html())
    
    expect(wrapper.element).toBeTruthy()
    expect(wrapper.classes()).toContain('w-modal')
    
    const modal = wrapper.find('div')
    expect(modal.exists()).toBe(true)
  })

  it('props 测试', () => {
    const wrapper = createWrapper({
      title: '测试标题',
      top: '100px',
      left: '100px'
    })
    
    expect(wrapper.get('.w-modal__header').text()).toContain('测试标题')
    expect(wrapper.get('.w-modal').attributes('style')).toContain('top: 100px')
    expect(wrapper.get('.w-modal').attributes('style')).toContain('left: 100px')
  })

  it('显示/隐藏测试', async () => {
    const wrapper = createWrapper({ modelValue: true })
    expect(wrapper.find('.w-modal').isVisible()).toBe(true)

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.find('.w-modal').isVisible()).toBe(false)
  })

  it('关闭按钮测试', async () => {
    const wrapper = createWrapper()
    await wrapper.find('.w-modal-icon:last-child').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
  })

  it('折叠功能测试', async () => {
    const wrapper = createWrapper()
    const collapseIcon = wrapper.find('.w-modal-icon:first-child')
    
    // 初始状态：内容可见
    expect(wrapper.find('.w-modal-body__wrapper').isVisible()).toBe(true)
    
    // 点击折叠
    await collapseIcon.trigger('click')
    expect(wrapper.find('.w-modal-body__wrapper').isVisible()).toBe(false)
    
    // 再次点击展开
    await collapseIcon.trigger('click')
    expect(wrapper.find('.w-modal-body__wrapper').isVisible()).toBe(true)
  })

  it('插槽测试', async () => {
    const wrapper = mount(WModal, {
      props: {
        modelValue: true
      },
      global: {
        plugins: [ElementPlus]
      },
      slots: {
        default: '<div class="test-content">测试内容</div>'
      }
    })
    
    await nextTick()
    
    expect(wrapper.html()).toContain('测试内容')
  })

  it('拖拽功能初始化测试', async () => {
    const wrapper = mount(WModal, {
      props: {
        modelValue: true,
        isDraggable: true
      },
      global: {
        plugins: [ElementPlus]
      }
    })
    
    await nextTick()
    
    const header = wrapper.find('.w-modal__header')
    const modal = wrapper.find('.w-modal')
    
    expect(header.exists()).toBe(true)
    expect(modal.exists()).toBe(true)
  })
})
