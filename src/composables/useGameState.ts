import { ref } from 'vue'
import { createInitialGameState, isCellEmpty, isValidCoord, opponent } from '../game/board'
import type { Coord, GameState } from '../types/game'

export function useGameState() {
  const state = ref<GameState>(createInitialGameState())

  function placeStone(coord: Coord): boolean {
    const s = state.value
    if (s.isGameOver) return false
    if (!isValidCoord(coord)) return false
    if (!isCellEmpty(s.board, coord)) return false

    s.board[coord.row]![coord.col] = s.currentPlayer
    s.moveCount++
    s.lastMove = coord
    s.currentPlayer = opponent(s.currentPlayer)
    return true
  }

  function resetGame() {
    state.value = createInitialGameState()
  }

  return {
    state,
    placeStone,
    resetGame,
  }
}
