import { findBestMove } from '@/ai/minimax'
import type { ComputeMoveMessage, WorkerResponse } from '@/types/ai'

self.onmessage = (e: MessageEvent<ComputeMoveMessage>) => {
  const msg = e.data
  if (msg.type !== 'compute-move') return

  const start = performance.now()

  try {
    const coord = findBestMove(msg.board, msg.currentPlayer, msg.moveCount, msg.depth)
    const elapsed = performance.now() - start

    const response: WorkerResponse = {
      type: 'move-result',
      coord,
      elapsedMs: elapsed,
      searchedDepth: msg.depth,
    }
    self.postMessage(response)
  } catch (err) {
    const response: WorkerResponse = {
      type: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
    }
    self.postMessage(response)
  }
}
