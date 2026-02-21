import type { ComputeMoveMessage, WorkerResponse } from '@/types/ai'

self.onmessage = (e: MessageEvent<ComputeMoveMessage>) => {
  const msg = e.data
  if (msg.type !== 'compute-move') return

  const start = performance.now()

  // Stub: always return center (天元)
  const coord = { row: 7, col: 7 }
  const elapsed = performance.now() - start

  const response: WorkerResponse = {
    type: 'move-result',
    coord,
    elapsedMs: elapsed,
    searchedDepth: msg.depth,
  }
  self.postMessage(response)
}
