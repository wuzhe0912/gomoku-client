import { ref } from 'vue'
import { createInitialGameState, isCellEmpty, isValidCoord, opponent } from '@/game/board'
import { checkWin, isDraw } from '@/game/win'
import { DIFFICULTY_CONFIG } from '@/types/ai'
import type { AiDifficulty, GameMode } from '@/types/ai'
import type { Coord, GameState } from '@/types/game'
import { useAiWorker } from '@/composables/useAiWorker'

export function useGameState() {
  const state = ref<GameState>(createInitialGameState())
  const gameMode = ref<GameMode>('pvp')
  const aiDifficulty = ref<AiDifficulty>('normal')
  const isAiThinking = ref(false)
  const lastAiElapsedMs = ref(0)

  const { compute, terminate } = useAiWorker()
  let generation = 0

  function placeStone(coord: Coord): boolean {
    const s = state.value
    if (s.isGameOver) return false
    if (!isValidCoord(coord)) return false
    if (!isCellEmpty(s.board, coord)) return false
    if (isAiThinking.value) return false

    s.board[coord.row]![coord.col] = s.currentPlayer
    s.moveCount++
    s.lastMove = coord

    const winner = checkWin(s.board, coord)
    if (winner) {
      s.isGameOver = true
      s.winner = winner
      return true
    }

    if (isDraw(s.moveCount)) {
      s.isGameOver = true
      s.winner = null
      return true
    }

    s.currentPlayer = opponent(s.currentPlayer)

    if (gameMode.value === 'pve' && !s.isGameOver) {
      requestAiMove()
    }

    return true
  }

  async function requestAiMove() {
    const s = state.value
    const gen = ++generation
    isAiThinking.value = true

    const config = DIFFICULTY_CONFIG[aiDifficulty.value]

    try {
      const result = await compute(
        s.board,
        s.currentPlayer,
        s.moveCount,
        config.depth,
        config.slaMs,
      )

      if (gen !== generation) return

      if (s.isGameOver) return

      s.board[result.coord.row]![result.coord.col] = s.currentPlayer
      s.moveCount++
      s.lastMove = result.coord
      lastAiElapsedMs.value = result.elapsedMs

      console.log(
        `[AI] ${aiDifficulty.value} depth=${result.searchedDepth} time=${result.elapsedMs.toFixed(1)}ms sla=${config.slaMs}ms`,
      )

      const winner = checkWin(s.board, result.coord)
      if (winner) {
        s.isGameOver = true
        s.winner = winner
      } else if (isDraw(s.moveCount)) {
        s.isGameOver = true
        s.winner = null
      } else {
        s.currentPlayer = opponent(s.currentPlayer)
      }
    } catch (err) {
      console.error('AI worker error:', err)
    } finally {
      if (gen === generation) {
        isAiThinking.value = false
      }
    }
  }

  function resetGame() {
    generation++
    isAiThinking.value = false
    state.value = createInitialGameState()
  }

  function setGameMode(mode: GameMode) {
    if (mode === gameMode.value) return
    gameMode.value = mode
    resetGame()
  }

  function setAiDifficulty(difficulty: AiDifficulty) {
    if (difficulty === aiDifficulty.value) return
    aiDifficulty.value = difficulty
    resetGame()
  }

  return {
    state,
    gameMode,
    aiDifficulty,
    isAiThinking,
    lastAiElapsedMs,
    placeStone,
    resetGame,
    setGameMode,
    setAiDifficulty,
    terminate,
  }
}
