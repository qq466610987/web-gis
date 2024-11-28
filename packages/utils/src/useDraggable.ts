import { onBeforeUnmount, unref, watchEffect } from 'vue'
import type { ComputedRef, MaybeRef, Ref } from 'vue'
import { isNumber, isString } from 'xe-utils'

export const useDraggable = (
  targetRef: MaybeRef<HTMLElement | undefined>,
  dragRef: MaybeRef<HTMLElement | undefined>,
  draggable: Ref<boolean>,
  containerRef: MaybeRef<HTMLElement | undefined>,
) => {
  if (!unref(targetRef) || !unref(dragRef) || !unref(containerRef)) {
    throw new Error('targetRef or dragRef or containerRef is required')
  }

  let transform = {
    offsetX: 0,
    offsetY: 0,
  }

  const onMousedown = (e: MouseEvent) => {
    const downX = e.clientX
    const downY = e.clientY
    const { offsetX, offsetY } = transform

    const targetRect = unref(targetRef)!.getBoundingClientRect()
    const targetLeft = targetRect.left
    const targetTop = targetRect.top
    const targetWidth = targetRect.width
    const targetHeight = targetRect.height

    const containerRect = unref(containerRef)?.getBoundingClientRect()
    const clientWidth = document.documentElement.clientWidth
    const clientHeight = document.documentElement.clientHeight

    const containerLeft = containerRect?.left ?? 0
    const containerTop = containerRect?.top ?? 0
    const containerRight = containerRect ? clientWidth - containerRect.left - containerRect.width : 0
    const containerBottom = containerRect ? clientHeight - containerRect.height - containerRect.top : 0

    const minLeft = -targetLeft + offsetX + containerLeft
    const minTop = -targetTop + offsetY + containerTop
    const maxLeft = clientWidth - targetLeft - targetWidth + offsetX - containerRight
    const maxTop = clientHeight - targetTop - targetHeight + offsetY - containerBottom

    const onMousemove = (e: MouseEvent) => {
      const moveX = Math.min(Math.max(offsetX + e.clientX - downX, minLeft), maxLeft)
      const moveY = Math.min(Math.max(offsetY + e.clientY - downY, minTop), maxTop)

      transform = {
        offsetX: moveX,
        offsetY: moveY,
      }
      unref(targetRef)!.style.transform = `translate(${addUnit(moveX)}, ${addUnit(moveY)})`
    }

    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseup)
    }

    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }

  const onDraggable = () => {
    if (unref(dragRef) && unref(targetRef)) {
      unref(dragRef)!.addEventListener('mousedown', onMousedown)
    }
  }

  const offDraggable = () => {
    if (unref(dragRef) && unref(targetRef)) {
      unref(dragRef)!.removeEventListener('mousedown', onMousedown)
    }
  }

  watchEffect(() => {
    if (draggable.value) {
      onDraggable()
    } else {
      offDraggable()
    }
  })

  onBeforeUnmount(() => {
    offDraggable()
  })
}

export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (!value) return ''
  if (isNumber(value) || isStringNumber(value)) {
    return `${value}${defaultUnit}`
  } else if (isString(value)) {
    return value
  }
}

export const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false
  }
  return !Number.isNaN(Number(val))
}

export default useDraggable