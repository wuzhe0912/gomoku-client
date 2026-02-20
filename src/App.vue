<script setup lang="ts">
import { ref } from "vue";

const darkMode = ref(false);
</script>

<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300',
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900',
    ]"
  >
    <div class="mx-auto max-w-2xl px-4 py-12">
      <!-- Header -->
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-bold tracking-tight">五子棋 Gomoku</h1>
        <p class="mt-2 text-lg text-gray-500">TailwindCSS 樣式確認頁</p>
      </header>

      <!-- Dark mode toggle -->
      <div class="mb-8 flex justify-center">
        <button
          class="rounded-full px-5 py-2 text-sm font-medium shadow-sm transition-all hover:scale-105 active:scale-95"
          :class="
            darkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'
          "
          @click="darkMode = !darkMode"
        >
          {{ darkMode ? "Light Mode" : "Dark Mode" }}
        </button>
      </div>

      <!-- Card grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          class="rounded-xl p-6 shadow-md transition-shadow hover:shadow-lg"
          :class="darkMode ? 'bg-gray-800' : 'bg-white'"
        >
          <div class="mb-3 text-2xl">⚫</div>
          <h2 class="text-lg font-semibold">單人模式</h2>
          <p class="mt-1 text-sm text-gray-500">
            對戰 AI，支援三種難度等級
          </p>
        </div>

        <div
          class="rounded-xl p-6 shadow-md transition-shadow hover:shadow-lg"
          :class="darkMode ? 'bg-gray-800' : 'bg-white'"
        >
          <div class="mb-3 text-2xl">⚪</div>
          <h2 class="text-lg font-semibold">多人對戰</h2>
          <p class="mt-1 text-sm text-gray-500">
            WebSocket 即時連線，與朋友對弈
          </p>
        </div>
      </div>

      <!-- Badge samples -->
      <div class="mt-8 flex flex-wrap justify-center gap-2">
        <span
          class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
          >Vue 3</span
        >
        <span
          class="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700"
          >TypeScript</span
        >
        <span
          class="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700"
          >TailwindCSS</span
        >
        <span
          class="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
          >Canvas 2D</span
        >
      </div>

      <!-- Responsive indicator -->
      <p class="mt-10 text-center text-xs text-gray-400">
        <span class="sm:hidden">📱 Mobile viewport</span>
        <span class="hidden sm:inline lg:hidden">💻 Tablet viewport</span>
        <span class="hidden lg:inline">🖥️ Desktop viewport</span>
      </p>
    </div>
  </div>
</template>
