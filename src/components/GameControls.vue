<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

defineEmits<{
  reset: []
}>()
</script>

<template>
  <button
    :class="[
      'min-h-[44px] rounded-lg px-5 py-2 text-sm font-medium shadow transition-colors',
      disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800',
    ]"
    :disabled="disabled"
    @click="$emit('reset')"
  >
    重新開始
  </button>
</template>
