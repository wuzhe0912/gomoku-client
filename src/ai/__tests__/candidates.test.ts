import { describe, expect, it } from 'vitest'
import { getCandidates } from '@/ai/candidates'
import { createEmptyBoard } from '@/game/board'
import { BOARD_SIZE } from '@/game/constants'

describe('getCandidates', () => {
  it('returns center for first move', () => {
    const board = createEmptyBoard()
    const candidates = getCandidates(board, 0)
    expect(candidates).toEqual([{ row: 7, col: 7 }])
  })

  it('returns neighbors within 2 cells of existing stones', () => {
    const board = createEmptyBoard()
    board[7]![7] = 'black'
    const candidates = getCandidates(board, 1)

    // All candidates should be within 2 cells of (7,7)
    for (const c of candidates) {
      const dist = Math.max(Math.abs(c.row - 7), Math.abs(c.col - 7))
      expect(dist).toBeLessThanOrEqual(2)
      expect(dist).toBeGreaterThan(0)
    }

    // Should not include the occupied cell itself
    expect(candidates.find(c => c.row === 7 && c.col === 7)).toBeUndefined()
  })

  it('does not include occupied cells', () => {
    const board = createEmptyBoard()
    board[7]![7] = 'black'
    board[7]![8] = 'white'
    const candidates = getCandidates(board, 2)

    for (const c of candidates) {
      expect(board[c.row]![c.col]).toBeNull()
    }
  })

  it('has no duplicates', () => {
    const board = createEmptyBoard()
    board[7]![7] = 'black'
    board[7]![8] = 'white'
    const candidates = getCandidates(board, 2)

    const keys = candidates.map(c => c.row * BOARD_SIZE + c.col)
    const unique = new Set(keys)
    expect(unique.size).toBe(keys.length)
  })

  it('sorts by distance to center (closer first)', () => {
    const board = createEmptyBoard()
    board[0]![0] = 'black'
    board[14]![14] = 'white'
    const candidates = getCandidates(board, 2)
    const center = Math.floor(BOARD_SIZE / 2)

    for (let i = 1; i < candidates.length; i++) {
      const prevDist =
        Math.abs(candidates[i - 1]!.row - center) +
        Math.abs(candidates[i - 1]!.col - center)
      const currDist =
        Math.abs(candidates[i]!.row - center) +
        Math.abs(candidates[i]!.col - center)
      expect(currDist).toBeGreaterThanOrEqual(prevDist)
    }
  })
})
