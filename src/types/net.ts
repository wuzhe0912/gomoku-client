import type { Player, Cell } from '@/types/game'

// ---------------------------------------------------------------------------
// Client → Server
// ---------------------------------------------------------------------------

export interface CreateRoomMsg {
  type: 'create_room'
}

export interface JoinRoomMsg {
  type: 'join_room'
  room_id: string
}

export interface PlaceStoneMsg {
  type: 'place_stone'
  row: number
  col: number
}

export interface LeaveRoomMsg {
  type: 'leave_room'
}

export interface ReconnectMsg {
  type: 'reconnect'
  room_id: string
  player_token: string
}

export type ClientMessage =
  | CreateRoomMsg
  | JoinRoomMsg
  | PlaceStoneMsg
  | LeaveRoomMsg
  | ReconnectMsg

// ---------------------------------------------------------------------------
// Server → Client
// ---------------------------------------------------------------------------

export interface RoomCreatedMsg {
  type: 'room_created'
  room_id: string
  player_token: string
  color: Player
}

export interface PlayerJoinedMsg {
  type: 'player_joined'
  color: Player
}

export interface GameStartedMsg {
  type: 'game_started'
  your_color: Player
}

export interface StonePlacedMsg {
  type: 'stone_placed'
  row: number
  col: number
  color: Player
  next_turn: Player | null
}

export interface GameOverMsg {
  type: 'game_over'
  winner: Player | null
  reason: 'five_in_row' | 'timeout' | 'disconnect' | 'draw'
}

export interface StateSyncMsg {
  type: 'state_sync'
  board: Cell[][]
  current_turn: Player
  move_count: number
  your_color: Player
  timer_remaining: number
}

export interface TurnTimerMsg {
  type: 'turn_timer'
  remaining: number
}

export interface OpponentDisconnectedMsg {
  type: 'opponent_disconnected'
}

export interface OpponentReconnectedMsg {
  type: 'opponent_reconnected'
}

export interface ErrorMsg {
  type: 'error'
  message: string
}

export type ServerMessage =
  | RoomCreatedMsg
  | PlayerJoinedMsg
  | GameStartedMsg
  | StonePlacedMsg
  | GameOverMsg
  | StateSyncMsg
  | TurnTimerMsg
  | OpponentDisconnectedMsg
  | OpponentReconnectedMsg
  | ErrorMsg
