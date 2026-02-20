<script setup lang="ts">
defineEmits<{
  reset: []
}>()
</script>

<template>
  <button
    class="rounded-lg bg-gray-700 px-5 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-600 active:bg-gray-800"
    @click="$emit('reset')"
  >
    重新開始
  </button>
</template>
