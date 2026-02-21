import type { Board, Coord, Player } from '@/types/game'
import type { WorkerResponse } from '@/types/ai'

let worker: Worker | null = null

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../ai/worker.ts', import.meta.url), {
      type: 'module',
    })
  }
  return worker
}

export interface ComputeResult {
  coord: Coord
  elapsedMs: number
  searchedDepth: number
}

export function useAiWorker() {
  function compute(
    board: Board,
    currentPlayer: Player,
    moveCount: number,
    depth: number,
    slaMs: number,
  ): Promise<ComputeResult> {
    const w = getWorker()
    return new Promise((resolve, reject) => {
      w.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const msg = e.data
        if (msg.type === 'move-result') {
          resolve({
            coord: msg.coord,
            elapsedMs: msg.elapsedMs,
            searchedDepth: msg.searchedDepth,
          })
        } else if (msg.type === 'error') {
          reject(new Error(msg.message))
        }
      }
      w.onerror = (err) => reject(err)
      w.postMessage({
        type: 'compute-move',
        board,
        currentPlayer,
        moveCount,
        depth,
        slaMs,
      })
    })
  }

  function terminate() {
    if (worker) {
      worker.terminate()
      worker = null
    }
  }

  return { compute, terminate }
}
