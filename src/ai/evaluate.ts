import { BOARD_SIZE } from '@/game/constants'
import type { Board, Player } from '@/types/game'

const DIRECTIONS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
]

// Score lookup: SCORES[openEnds][length]
// openEnds: 0 = fully blocked, 1 = half-open, 2 = fully open
// length: 1-4 (5+ is a win, handled separately)
const SCORES: number[][] = [
  [0, 0, 0, 0, 0],     // 0 open ends
  [0, 2, 15, 150, 15_000],   // 1 open end
  [0, 5, 50, 1_500, 100_000], // 2 open ends
]

const OPPONENT_THREAT_MULTIPLIER = 1.1

export function evaluate(board: Board, player: Player): number {
  let myScore = 0
  let oppScore = 0

  for (const [dr, dc] of DIRECTIONS) {
    // To avoid double-counting, only scan in one direction per axis.
    // We scan starting from each cell, extending in the positive direction.
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const cell = board[r]![c]
        if (cell === null) continue

        // Only start counting a segment from its first cell.
        // Check if the previous cell in this direction is the same color.
        const pr = r - dr
        const pc = c - dc
        if (
          pr >= 0 && pr < BOARD_SIZE &&
          pc >= 0 && pc < BOARD_SIZE &&
          board[pr]![pc] === cell
        ) {
          continue // This cell is part of a segment we already started counting
        }

        // Count consecutive same-color stones in this direction
        let length = 0
        let nr = r
        let nc = c
        while (
          nr >= 0 && nr < BOARD_SIZE &&
          nc >= 0 && nc < BOARD_SIZE &&
          board[nr]![nc] === cell
        ) {
          length++
          nr += dr
          nc += dc
        }

        if (length >= 5) {
          // Already a win
          if (cell === player) {
            myScore += 1_000_000
          } else {
            oppScore += 1_000_000
          }
          continue
        }

        // Count open ends
        let openEnds = 0

        // Check before the segment
        const br = r - dr
        const bc = c - dc
        if (
          br >= 0 && br < BOARD_SIZE &&
          bc >= 0 && bc < BOARD_SIZE &&
          board[br]![bc] === null
        ) {
          openEnds++
        }

        // Check after the segment
        if (
          nr >= 0 && nr < BOARD_SIZE &&
          nc >= 0 && nc < BOARD_SIZE &&
          board[nr]![nc] === null
        ) {
          openEnds++
        }

        const score = SCORES[openEnds]![length]!
        if (cell === player) {
          myScore += score
        } else {
          oppScore += score
        }
      }
    }
  }

  return myScore - oppScore * OPPONENT_THREAT_MULTIPLIER
}
