import type { Board, Coord, Player } from '@/types/game'

// --- Game Mode & Difficulty ---

export type GameMode = 'pvp' | 'pve'

export type AiDifficulty = 'easy' | 'normal' | 'hard'

export interface DifficultyConfig {
  depth: number
  slaMs: number
}

export const DIFFICULTY_CONFIG: Record<AiDifficulty, DifficultyConfig> = {
  easy: { depth: 2, slaMs: 200 },
  normal: { depth: 4, slaMs: 800 },
  hard: { depth: 6, slaMs: 2000 },
}

// --- Worker Messages ---

export interface ComputeMoveMessage {
  type: 'compute-move'
  board: Board
  currentPlayer: Player
  moveCount: number
  depth: number
  slaMs: number
}

export interface MoveResultMessage {
  type: 'move-result'
  coord: Coord
  elapsedMs: number
  searchedDepth: number
}

export interface WorkerErrorMessage {
  type: 'error'
  message: string
}

export type WorkerRequest = ComputeMoveMessage
export type WorkerResponse = MoveResultMessage | WorkerErrorMessage
