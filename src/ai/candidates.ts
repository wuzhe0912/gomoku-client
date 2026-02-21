import { BOARD_SIZE } from '@/game/constants'
import type { Board, Coord } from '@/types/game'

const CENTER = Math.floor(BOARD_SIZE / 2)

function distanceToCenter(row: number, col: number): number {
  return Math.abs(row - CENTER) + Math.abs(col - CENTER)
}

export function getCandidates(board: Board, moveCount: number): Coord[] {
  if (moveCount === 0) {
    return [{ row: CENTER, col: CENTER }]
  }

  const seen = new Set<number>()
  const candidates: Coord[] = []

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r]![c] === null) continue

      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr
          const nc = c + dc
          if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) continue
          if (board[nr]![nc] !== null) continue
          const key = nr * BOARD_SIZE + nc
          if (seen.has(key)) continue
          seen.add(key)
          candidates.push({ row: nr, col: nc })
        }
      }
    }
  }

  candidates.sort((a, b) => distanceToCenter(a.row, a.col) - distanceToCenter(b.row, b.col))
  return candidates
}
