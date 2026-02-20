<script setup lang="ts">
import GameBoard from './components/GameBoard.vue'
import GameControls from './components/GameControls.vue'
import GameStatus from './components/GameStatus.vue'
import { useGameState } from './composables/useGameState'

const { state, placeStone, resetGame } = useGameState()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center bg-gray-100 py-8">
    <h1 class="mb-6 text-3xl font-bold tracking-tight text-gray-800">
      五子棋 Gomoku
    </h1>
    <GameStatus :current-player="state.currentPlayer" class="mb-4" />
    <GameBoard :board="state.board" :last-move="state.lastMove" @place="placeStone" />
    <GameControls class="mt-6" @reset="resetGame" />
  </div>
</template>
