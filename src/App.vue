<script setup lang="ts">
import { onMounted, watch } from 'vue'
import GameBoard from '@/components/GameBoard.vue'
import GameControls from '@/components/GameControls.vue'
import GameModeSelector from '@/components/GameModeSelector.vue'
import GameStatus from '@/components/GameStatus.vue'
import OnlinePanel from '@/components/OnlinePanel.vue'
import { useGameState } from '@/composables/useGameState'
import { useOnlineGame } from '@/composables/useOnlineGame'
import type { Coord } from '@/types/game'

const {
  state,
  gameMode,
  aiDifficulty,
  isAiThinking,
  placeStone: placeStoneLocal,
  resetGame,
  setGameMode,
  setAiDifficulty,
} = useGameState()

const {
  state: onlineState,
  phase: onlinePhase,
  connectionStatus,
  roomId,
  myColor,
  opponentConnected,
  timerRemaining,
  errorMessage,
  gameOverReason,
  createRoom,
  joinRoom,
  placeStone: placeStoneOnline,
  leaveRoom,
  getShareUrl,
  tryReconnectFromSession,
  disconnect: disconnectOnline,
} = useOnlineGame()

function handlePlace(coord: Coord) {
  if (gameMode.value === 'online') {
    placeStoneOnline(coord)
  } else {
    placeStoneLocal(coord)
  }
}

function handleCopyLink() {
  const url = getShareUrl()
  navigator.clipboard.writeText(url).catch(() => {
    window.prompt('複製此連結分享給對手：', url)
  })
}

// Clean up online connection when switching away
watch(gameMode, (newMode, oldMode) => {
  if (oldMode === 'online' && newMode !== 'online') {
    disconnectOnline()
  }
})

// Check URL for room ID or recover from session
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const roomFromUrl = params.get('room')
  if (roomFromUrl) {
    setGameMode('online')
    joinRoom(roomFromUrl)
    window.history.replaceState({}, '', window.location.pathname)
  } else if (tryReconnectFromSession()) {
    setGameMode('online')
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-4 sm:py-8">
    <h1 class="mb-4 text-2xl font-bold tracking-tight text-gray-800 sm:mb-6 sm:text-3xl">
      五子棋 Gomoku
    </h1>
    <GameModeSelector
      :game-mode="gameMode"
      :ai-difficulty="aiDifficulty"
      :disabled="gameMode === 'online' ? onlinePhase !== 'idle' : state.moveCount > 0"
      class="mb-3"
      @update:game-mode="setGameMode"
      @update:ai-difficulty="setAiDifficulty"
    />

    <!-- Online mode panel -->
    <template v-if="gameMode === 'online'">
      <OnlinePanel
        :phase="onlinePhase"
        :connection-status="connectionStatus"
        :room-id="roomId"
        :my-color="myColor"
        :opponent-connected="opponentConnected"
        :error-message="errorMessage"
        :game-over-reason="gameOverReason"
        :winner="onlineState.winner"
        :timer-remaining="timerRemaining"
        :current-player="onlineState.currentPlayer"
        class="mb-4"
        @create-room="createRoom"
        @join-room="joinRoom"
        @leave-room="leaveRoom"
        @copy-link="handleCopyLink"
      />
      <GameBoard
        v-if="onlinePhase === 'playing' || onlinePhase === 'ended'"
        :board="onlineState.board"
        :last-move="onlineState.lastMove"
        :is-game-over="onlineState.isGameOver"
        :disabled="onlineState.currentPlayer !== myColor"
        @place="handlePlace"
      />
    </template>

    <!-- Local mode (PVP / PVE) -->
    <template v-else>
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
        @place="handlePlace"
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
    </template>
  </div>
</template>
