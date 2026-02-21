<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import GameControls from '@/components/GameControls.vue'
import GameModeSelector from '@/components/GameModeSelector.vue'
import GameStatus from '@/components/GameStatus.vue'
import { useGameState } from '@/composables/useGameState'

const {
  state,
  gameMode,
  aiDifficulty,
  isAiThinking,
  placeStone,
  resetGame,
  setGameMode,
  setAiDifficulty,
} = useGameState()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-4 sm:py-8">
    <h1 class="mb-4 text-2xl font-bold tracking-tight text-gray-800 sm:mb-6 sm:text-3xl">
      五子棋 Gomoku
    </h1>
    <GameModeSelector
      :game-mode="gameMode"
      :ai-difficulty="aiDifficulty"
      :disabled="state.moveCount > 0"
      class="mb-3"
      @update:game-mode="setGameMode"
      @update:ai-difficulty="setAiDifficulty"
    />
    <GameStatus
      :current-player="state.currentPlayer"
      :is-game-over="state.isGameOver"
      :winner="state.winner"
      :is-ai-thinking="isAiThinking"
      class="mb-4"
    />
    <GameBoard
      :board="state.board"
      :last-move="state.lastMove"
      :is-game-over="state.isGameOver"
      :disabled="isAiThinking"
      @place="placeStone"
    />
    <GameControls
      class="mt-4 sm:mt-6"
      :disabled="state.moveCount === 0 && !isAiThinking"
      @reset="resetGame"
    />
    <p
      v-if="state.isGameOver"
      class="mt-3 text-sm text-gray-500"
    >
      點擊「重新開始」以再來一局
    </p>
  </div>
</template>
