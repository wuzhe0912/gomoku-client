<script setup lang="ts">
import type { Player } from '../types/game'

defineProps<{
  currentPlayer: Player
}>()
</script>

<template>
  <div class="flex items-center gap-2 text-lg font-medium text-gray-700">
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
  </div>
</template>
