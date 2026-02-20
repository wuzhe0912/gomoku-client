import { ref } from 'vue'
import { createInitialGameState } from '../game/board'
import type { GameState } from '../types/game'

export function useGameState() {
  const state = ref<GameState>(createInitialGameState())

  function resetGame() {
    state.value = createInitialGameState()
  }

  return {
    state,
    resetGame,
  }
}
