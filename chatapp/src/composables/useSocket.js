import { ref, onUnmounted } from 'vue'
import socketManager from '../socketManager.js'

export function useSocket() {
  const socket = socketManager.getInstance()
  const eventHandlers = ref({})

  const on = (event, handler) => {
    socket.on(event, handler)
    
    if (!eventHandlers.value[event]) {
      eventHandlers.value[event] = []
    }
    eventHandlers.value[event].push(handler)
  }

  const emit = (event, data) => {
    socket.emit(event, data)
  }

  const off = (event, handler) => {
    socket.off(event, handler)
    
    if (eventHandlers.value[event]) {
      const index = eventHandlers.value[event].indexOf(handler)
      if (index > -1) {
        eventHandlers.value[event].splice(index, 1)
      }
    }
  }

  const cleanup = () => {
    Object.entries(eventHandlers.value).forEach(([event, handlers]) => {
      handlers.forEach(handler => {
        socket.off(event, handler)
      })
    })
    eventHandlers.value = {}
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    socket,
    on,
    emit,
    off,
    cleanup
  }
}