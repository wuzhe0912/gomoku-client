<script setup lang="ts">
import { ref } from 'vue'
import type { OnlinePhase } from '@/composables/useOnlineGame'
import type { ConnectionStatus } from '@/net/ws'
import type { Player } from '@/types/game'

defineProps<{
  phase: OnlinePhase
  connectionStatus: ConnectionStatus
  roomId: string | null
  myColor: Player | null
  opponentConnected: boolean
  errorMessage: string | null
  gameOverReason: string | null
  winner: Player | null
  timerRemaining: number | null
  currentPlayer: Player
}>()

const emit = defineEmits<{
  createRoom: []
  joinRoom: [id: string]
  leaveRoom: []
  copyLink: []
}>()

const joinInput = ref('')

function handleJoin() {
  const id = joinInput.value.trim()
  if (id) emit('joinRoom', id)
}

const reasonLabels: Record<string, string> = {
  five_in_row: '五子連線',
  timeout: '超時判負',
  disconnect: '對手離線',
  draw: '平手',
}
</script>

<template>
  <div class="flex w-full max-w-[400px] flex-col items-center gap-3">
    <!-- Idle: create or join -->
    <template v-if="phase === 'idle'">
      <button
        class="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-green-500 active:bg-green-700"
        @click="emit('createRoom')"
      >
        建立房間
      </button>
      <div class="flex w-full gap-2">
        <input
          v-model="joinInput"
          type="text"
          placeholder="輸入房間代碼"
          class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          @keydown.enter="handleJoin"
        />
        <button
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 active:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
          :disabled="!joinInput.trim()"
          @click="handleJoin"
        >
          加入
        </button>
      </div>
    </template>

    <!-- Waiting for opponent -->
    <template v-if="phase === 'waiting'">
      <div class="w-full rounded-lg border border-dashed border-gray-400 bg-white p-4 text-center">
        <p class="mb-1 text-sm text-gray-500">房間代碼</p>
        <p class="mb-3 text-2xl font-mono font-bold tracking-widest text-gray-800">{{ roomId }}</p>
        <p class="mb-3 text-sm text-gray-500">等待對手加入...</p>
        <button
          class="rounded bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-300"
          @click="emit('copyLink')"
        >
          複製邀請連結
        </button>
      </div>
      <button
        class="text-sm text-gray-500 hover:text-gray-700"
        @click="emit('leaveRoom')"
      >
        取消
      </button>
    </template>

    <!-- Playing: status bar -->
    <template v-if="phase === 'playing'">
      <div class="flex w-full items-center justify-between rounded-lg bg-white px-4 py-2 shadow-sm">
        <div class="flex items-center gap-2 text-sm">
          <span>你是</span>
          <span
            class="inline-block h-4 w-4 rounded-full border"
            :class="myColor === 'black' ? 'border-gray-800 bg-gray-900' : 'border-gray-300 bg-white'"
          />
          <span>{{ myColor === 'black' ? '黑棋' : '白棋' }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <template v-if="!opponentConnected">
            <span class="text-orange-500">對手離線中...</span>
          </template>
          <template v-else-if="timerRemaining !== null && currentPlayer === myColor">
            <span :class="timerRemaining <= 10 ? 'font-bold text-red-500' : 'text-gray-600'">
              {{ Math.ceil(timerRemaining) }}s
            </span>
          </template>
        </div>
      </div>
    </template>

    <!-- Game ended -->
    <template v-if="phase === 'ended'">
      <div class="w-full rounded-lg bg-white p-4 text-center shadow-sm">
        <p class="mb-1 text-lg font-bold text-gray-800">
          <template v-if="winner === myColor">你贏了！</template>
          <template v-else-if="winner">你輸了</template>
          <template v-else>平手！</template>
        </p>
        <p class="text-sm text-gray-500">
          {{ reasonLabels[gameOverReason ?? ''] ?? '' }}
        </p>
      </div>
      <button
        class="rounded-lg bg-gray-700 px-5 py-2 text-sm font-medium text-white shadow hover:bg-gray-600"
        @click="emit('leaveRoom')"
      >
        返回大廳
      </button>
    </template>

    <!-- Connection / error info -->
    <p v-if="connectionStatus === 'connecting'" class="text-xs text-gray-400">
      連線中...
    </p>
    <p v-if="errorMessage" class="text-xs text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>
