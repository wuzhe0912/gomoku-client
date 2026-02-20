import { BOARD_SIZE } from './constants'
import type { Board, Cell, Coord, GameState, Player } from '../types/game'

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from<Cell>({ length: BOARD_SIZE }).fill(null),
  )
}

export function createInitialGameState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'black',
    moveCount: 0,
    lastMove: null,
    isGameOver: false,
    winner: null,
  }
}

export function isValidCoord(coord: Coord): boolean {
  return (
    coord.row >= 0 &&
    coord.row < BOARD_SIZE &&
    coord.col >= 0 &&
    coord.col < BOARD_SIZE
  )
}

export function isCellEmpty(board: Board, coord: Coord): boolean {
  return board[coord.row]![coord.col] === null
}

export function opponent(player: Player): Player {
  return player === 'black' ? 'white' : 'black'
}
