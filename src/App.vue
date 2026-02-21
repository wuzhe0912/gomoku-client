<script setup lang="ts">
import GameBoard from './components/GameBoard.vue'
import GameControls from './components/GameControls.vue'
import GameStatus from './components/GameStatus.vue'
import { useGameState } from './composables/useGameState'

const { state, placeStone, resetGame } = useGameState()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-4 sm:py-8">
    <h1 class="mb-4 text-2xl font-bold tracking-tight text-gray-800 sm:mb-6 sm:text-3xl">
      五子棋 Gomoku
    </h1>
    <GameStatus
      :current-player="state.currentPlayer"
      :is-game-over="state.isGameOver"
      :winner="state.winner"
      class="mb-4"
    />
    <GameBoard
      :board="state.board"
      :last-move="state.lastMove"
      :is-game-over="state.isGameOver"
      @place="placeStone"
    />
    <GameControls
      class="mt-4 sm:mt-6"
      :disabled="state.moveCount === 0"
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
