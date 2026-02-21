import type { ClientMessage, ServerMessage } from '@/types/net'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected'

export interface WsClientOptions {
  url: string
  onMessage: (msg: ServerMessage) => void
  onStatusChange: (status: ConnectionStatus) => void
}

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000]

export class WsClient {
  private ws: WebSocket | null = null
  private opts: WsClientOptions
  private reconnectAttempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private intentionallyClosed = false

  constructor(opts: WsClientOptions) {
    this.opts = opts
  }

  connect() {
    this.intentionallyClosed = false
    this.reconnectAttempt = 0
    this._connect()
  }

  private _connect() {
    this.opts.onStatusChange('connecting')

    const ws = new WebSocket(this.opts.url)

    ws.onopen = () => {
      this.reconnectAttempt = 0
      this.opts.onStatusChange('connected')
    }

    ws.onmessage = (e) => {
      try {
        const msg: ServerMessage = JSON.parse(e.data)
        this.opts.onMessage(msg)
      } catch {
        console.error('[WS] Failed to parse message:', e.data)
      }
    }

    ws.onclose = () => {
      this.ws = null
      this.opts.onStatusChange('disconnected')
      if (!this.intentionallyClosed) {
        this._scheduleReconnect()
      }
    }

    ws.onerror = () => {
      // onclose will fire after onerror, so reconnect is handled there
    }

    this.ws = ws
  }

  private _scheduleReconnect() {
    const delay = RECONNECT_DELAYS[
      Math.min(this.reconnectAttempt, RECONNECT_DELAYS.length - 1)
    ]!
    this.reconnectAttempt++
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this._connect()
    }, delay)
  }

  send(msg: ClientMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg))
    }
  }

  close() {
    this.intentionallyClosed = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
    this.ws = null
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
