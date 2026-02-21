<script setup lang="ts">
import type { Player } from '../types/game'

defineProps<{
  currentPlayer: Player
  isGameOver: boolean
  winner: Player | null
}>()
</script>

<template>
  <div class="flex items-center gap-2 text-base font-medium text-gray-700 sm:text-lg">
    <template v-if="isGameOver">
      <template v-if="winner">
        <span
          class="inline-block h-5 w-5 rounded-full border"
          :class="
            winner === 'black'
              ? 'border-gray-800 bg-gray-900'
              : 'border-gray-300 bg-white'
          "
        />
        <span>{{ winner === 'black' ? '黑棋' : '白棋' }}獲勝！</span>
      </template>
      <template v-else>
        <span>平手！</span>
      </template>
    </template>
    <template v-else>
      <span>目前回合：</span>
      <span
        class="inline-block h-5 w-5 rounded-full border"
        :class="
          currentPlayer === 'black'
            ? 'border-gray-800 bg-gray-900'
            : 'border-gray-300 bg-white'
        "
      />
      <span>{{ currentPlayer === 'black' ? '黑棋' : '白棋' }}</span>
    </template>
  </div>
</template>
