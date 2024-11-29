export type ModalProps = {
  modelValue: boolean
  title: string
  top: string
  left: string
  isDraggable: boolean
}
export type ModalSlots = {
  default: () => any
  header: () => any
  footer: () => any
}

export type ModalEmits = {
  (e: 'update:modelValue', modelValue: boolean): void
}
