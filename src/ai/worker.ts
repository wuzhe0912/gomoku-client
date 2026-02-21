import { findBestMove } from '@/ai/minimax'
import type { ComputeMoveMessage, WorkerResponse } from '@/types/ai'

self.onmessage = (e: MessageEvent<ComputeMoveMessage>) => {
  const msg = e.data
  if (msg.type !== 'compute-move') return

  const start = performance.now()

  try {
    const result = findBestMove(msg.board, msg.currentPlayer, msg.moveCount, msg.depth, msg.slaMs)
    const elapsed = performance.now() - start

    const response: WorkerResponse = {
      type: 'move-result',
      coord: result.coord,
      elapsedMs: elapsed,
      searchedDepth: result.searchedDepth,
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
