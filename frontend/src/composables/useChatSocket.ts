import { ref, onUnmounted } from 'vue'
import { log } from '../services/logger'

export function useChatSocket() {
    const socket = ref<WebSocket | null>(null)
    const isConnected = ref(false)
    const lastError = ref<string | null>(null)

    // Callbacks for events
    let onMessageCallback: (data: any) => void = () => { }

    const connect = (token: string) => {
        if (socket.value) {
            if (socket.value.readyState === WebSocket.OPEN || socket.value.readyState === WebSocket.CONNECTING) {
                return // Already connecting or connected
            }
            socket.value.close()
        }

        // Determine the WS URL (relative to the current host to benefit from Vite proxy)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const host = window.location.host
        const wsUrl = `${protocol}//${host}/api/ws/chat?token=${token}`

        log.info('ChatSocket', `Connecting to ${wsUrl}`)

        try {
            socket.value = new WebSocket(wsUrl)

            socket.value.onopen = () => {
                isConnected.value = true
                lastError.value = null
                log.info('ChatSocket', 'WebSocket connected')
            }

            socket.value.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    log.info('ChatSocket', '📥 Received RAW WS message:', data)
                    onMessageCallback(data)
                } catch (err) {
                    log.error('ChatSocket', '❌ Error parsing WS message', err)
                }
            }

            socket.value.onerror = (event) => {
                log.error('ChatSocket', 'WebSocket error occurred', event)
                lastError.value = 'Error de conexión WebSocket'
            }

            socket.value.onclose = () => {
                isConnected.value = false
                log.info('ChatSocket', 'WebSocket closed')
            }
        } catch (err) {
            log.error('ChatSocket', 'Exception during connection', err)
            lastError.value = 'No se pudo iniciar la conexión WebSocket'
        }
    }

    const joinConversation = (conversationId: string) => {
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
            log.info('ChatSocket', `Joining conversation: ${conversationId}`)
            socket.value.send(JSON.stringify({
                type: 'join',
                conversation_id: conversationId
            }))
        } else {
            log.warn('ChatSocket', 'Cannot join conversation: Socket not open')
        }
    }

    const sendMessage = (conversationId: string, content: string) => {
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
            log.info('ChatSocket', `📤 Sending message via WS to: ${conversationId}`)
            socket.value.send(JSON.stringify({
                type: 'message',
                conversation_id: conversationId,
                content
            }))
            return true
        }
        log.error('ChatSocket', '❌ Cannot send via WS: Socket not open')
        return false
    }

    const onEvent = (callback: (data: any) => void) => {
        onMessageCallback = callback
    }

    const disconnect = () => {
        if (socket.value) {
            log.info('ChatSocket', 'Manually disconnecting socket')
            socket.value.close()
            socket.value = null
        }
    }

    onUnmounted(() => {
        disconnect()
    })

    return {
        isConnected,
        lastError,
        connect,
        disconnect,
        joinConversation,
        sendMessage,
        onEvent
    }
}
