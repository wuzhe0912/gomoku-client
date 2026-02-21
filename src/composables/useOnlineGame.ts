import { ref } from 'vue'
import { createInitialGameState } from '@/game/board'
import { WsClient, type ConnectionStatus } from '@/net/ws'
import type { Coord, GameState, Player } from '@/types/game'
import type { ServerMessage } from '@/types/net'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws'

export type OnlinePhase = 'idle' | 'waiting' | 'playing' | 'ended'

export function useOnlineGame() {
  const state = ref<GameState>(createInitialGameState())
  const phase = ref<OnlinePhase>('idle')
  const connectionStatus = ref<ConnectionStatus>('disconnected')
  const roomId = ref<string | null>(null)
  const myColor = ref<Player | null>(null)
  const playerToken = ref<string | null>(null)
  const opponentConnected = ref(true)
  const timerRemaining = ref<number | null>(null)
  const errorMessage = ref<string | null>(null)
  const gameOverReason = ref<string | null>(null)

  let client: WsClient | null = null

  function handleMessage(msg: ServerMessage) {
    errorMessage.value = null

    switch (msg.type) {
      case 'room_created':
        roomId.value = msg.room_id
        playerToken.value = msg.player_token
        myColor.value = msg.color
        if (msg.color === 'black') {
          phase.value = 'waiting'
        }
        // Save session for reconnect
        _saveSession(msg.room_id, msg.player_token)
        break

      case 'player_joined':
        // Opponent joined, game will start
        break

      case 'game_started':
        myColor.value = msg.your_color
        phase.value = 'playing'
        state.value = createInitialGameState()
        opponentConnected.value = true
        break

      case 'stone_placed': {
        const s = state.value
        s.board[msg.row]![msg.col] = msg.color
        s.moveCount++
        s.lastMove = { row: msg.row, col: msg.col }
        if (msg.next_turn) {
          s.currentPlayer = msg.next_turn
        }
        break
      }

      case 'game_over':
        state.value.isGameOver = true
        state.value.winner = msg.winner
        gameOverReason.value = msg.reason
        phase.value = 'ended'
        timerRemaining.value = null
        break

      case 'state_sync':
        state.value.board = msg.board
        state.value.currentPlayer = msg.current_turn
        state.value.moveCount = msg.move_count
        state.value.isGameOver = false
        state.value.winner = null
        myColor.value = msg.your_color
        timerRemaining.value = msg.timer_remaining
        phase.value = 'playing'
        break

      case 'turn_timer':
        timerRemaining.value = msg.remaining
        break

      case 'opponent_disconnected':
        opponentConnected.value = false
        break

      case 'opponent_reconnected':
        opponentConnected.value = true
        break

      case 'error':
        errorMessage.value = msg.message
        break
    }
  }

  function _ensureClient() {
    if (client) return
    client = new WsClient({
      url: WS_URL,
      onMessage: handleMessage,
      onStatusChange: (s) => {
        connectionStatus.value = s
        // Auto-reconnect to room when connection re-established
        if (s === 'connected' && roomId.value && playerToken.value && phase.value !== 'idle') {
          client!.send({
            type: 'reconnect',
            room_id: roomId.value,
            player_token: playerToken.value,
          })
        }
      },
    })
  }

  function createRoom() {
    _ensureClient()
    client!.connect()
    // Wait for connection, then send create_room
    const check = setInterval(() => {
      if (connectionStatus.value === 'connected') {
        clearInterval(check)
        client!.send({ type: 'create_room' })
      }
    }, 50)
  }

  function joinRoom(id: string) {
    _ensureClient()
    client!.connect()
    const check = setInterval(() => {
      if (connectionStatus.value === 'connected') {
        clearInterval(check)
        client!.send({ type: 'join_room', room_id: id })
      }
    }, 50)
  }

  function placeStone(coord: Coord): boolean {
    if (phase.value !== 'playing') return false
    if (state.value.isGameOver) return false
    if (state.value.currentPlayer !== myColor.value) return false
    if (state.value.board[coord.row]![coord.col] !== null) return false

    client?.send({ type: 'place_stone', row: coord.row, col: coord.col })
    return true
  }

  function leaveRoom() {
    client?.send({ type: 'leave_room' })
    _resetState()
    client?.close()
    client = null
    _clearSession()
  }

  function _resetState() {
    state.value = createInitialGameState()
    phase.value = 'idle'
    roomId.value = null
    myColor.value = null
    playerToken.value = null
    opponentConnected.value = true
    timerRemaining.value = null
    errorMessage.value = null
    gameOverReason.value = null
  }

  function getShareUrl(): string {
    const base = window.location.origin + window.location.pathname
    return `${base}?room=${roomId.value}`
  }

  // Session persistence for reconnect
  function _saveSession(rid: string, token: string) {
    try {
      sessionStorage.setItem('gomoku_room', JSON.stringify({ room_id: rid, player_token: token }))
    } catch { /* ignore */ }
  }

  function _clearSession() {
    try {
      sessionStorage.removeItem('gomoku_room')
    } catch { /* ignore */ }
  }

  function tryReconnectFromSession() {
    try {
      const raw = sessionStorage.getItem('gomoku_room')
      if (!raw) return false
      const { room_id, player_token } = JSON.parse(raw)
      if (!room_id || !player_token) return false
      roomId.value = room_id
      playerToken.value = player_token
      _ensureClient()
      client!.connect()
      return true
    } catch {
      return false
    }
  }

  function disconnect() {
    client?.close()
    client = null
    _resetState()
    _clearSession()
  }

  return {
    state,
    phase,
    connectionStatus,
    roomId,
    myColor,
    opponentConnected,
    timerRemaining,
    errorMessage,
    gameOverReason,
    createRoom,
    joinRoom,
    placeStone,
    leaveRoom,
    getShareUrl,
    tryReconnectFromSession,
    disconnect,
  }
}
