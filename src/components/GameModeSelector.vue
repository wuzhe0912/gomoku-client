<script setup lang="ts">
import type { AiDifficulty, GameMode } from '@/types/ai'

const props = defineProps<{
  gameMode: GameMode
  aiDifficulty: AiDifficulty
  disabled: boolean
}>()

const emit = defineEmits<{
  'update:gameMode': [mode: GameMode]
  'update:aiDifficulty': [difficulty: AiDifficulty]
}>()

const difficulties: { value: AiDifficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
]
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="flex gap-2">
      <button
        :class="[
          'rounded px-3 py-1.5 text-sm font-medium transition-colors',
          gameMode === 'pvp'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
        :disabled="disabled"
        @click="emit('update:gameMode', 'pvp')"
      >
        雙人對弈
      </button>
      <button
        :class="[
          'rounded px-3 py-1.5 text-sm font-medium transition-colors',
          gameMode === 'pve'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
        :disabled="disabled"
        @click="emit('update:gameMode', 'pve')"
      >
        人機對戰
      </button>
    </div>
    <div v-if="gameMode === 'pve'" class="flex gap-1.5">
      <button
        v-for="d in difficulties"
        :key="d.value"
        :class="[
          'rounded px-2.5 py-1 text-xs font-medium transition-colors',
          aiDifficulty === d.value
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        ]"
        :disabled="disabled"
        @click="emit('update:aiDifficulty', d.value)"
      >
        {{ d.label }}
      </button>
    </div>
  </div>
</template>
