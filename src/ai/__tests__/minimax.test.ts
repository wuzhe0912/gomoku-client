import { describe, expect, it } from 'vitest'
import { findBestMove } from '@/ai/minimax'
import { createEmptyBoard } from '@/game/board'
import type { Board, Coord, Player } from '@/types/game'

function placeStones(board: Board, coords: Coord[], player: Player) {
  for (const c of coords) {
    board[c.row]![c.col] = player
  }
}

describe('findBestMove', () => {
  it('returns center on empty board', () => {
    const board = createEmptyBoard()
    const result = findBestMove(board, 'black', 0, 2, 2000)
    expect(result.coord).toEqual({ row: 7, col: 7 })
  })

  it('completes four-in-a-row to win', () => {
    const board = createEmptyBoard()
    placeStones(board, [
      { row: 7, col: 4 },
      { row: 7, col: 5 },
      { row: 7, col: 6 },
      { row: 7, col: 7 },
    ], 'black')
    // Fill some white stones so moveCount is reasonable
    placeStones(board, [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ], 'white')

    const result = findBestMove(board, 'black', 7, 2, 2000)
    // Should complete the five: either col 3 or col 8
    expect(
      (result.coord.row === 7 && result.coord.col === 3) ||
      (result.coord.row === 7 && result.coord.col === 8),
    ).toBe(true)
  })

  it('blocks opponent four-in-a-row', () => {
    const board = createEmptyBoard()
    // White has 4 in a row horizontally
    placeStones(board, [
      { row: 7, col: 4 },
      { row: 7, col: 5 },
      { row: 7, col: 6 },
      { row: 7, col: 7 },
    ], 'white')
    // Black stones scattered (no winning threat)
    placeStones(board, [
      { row: 1, col: 1 },
      { row: 3, col: 3 },
      { row: 5, col: 10 },
      { row: 9, col: 2 },
    ], 'black')

    const result = findBestMove(board, 'black', 8, 2, 2000)
    // Should block at col 3 or col 8
    expect(
      (result.coord.row === 7 && result.coord.col === 3) ||
      (result.coord.row === 7 && result.coord.col === 8),
    ).toBe(true)
  })

  it('returns a valid empty cell', () => {
    const board = createEmptyBoard()
    board[7]![7] = 'black'
    const result = findBestMove(board, 'white', 1, 2, 2000)
    expect(board[result.coord.row]![result.coord.col]).toBeNull()
  })

  it('respects SLA and returns within time budget', () => {
    const board = createEmptyBoard()
    board[7]![7] = 'black'
    board[7]![8] = 'white'
    board[8]![7] = 'black'

    const start = performance.now()
    const result = findBestMove(board, 'white', 3, 6, 500)
    const elapsed = performance.now() - start

    expect(result.coord).toBeDefined()
    // Should complete within a reasonable margin of SLA
    expect(elapsed).toBeLessThan(2000)
  })

  it('searchedDepth reflects iterative deepening', () => {
    const board = createEmptyBoard()
    board[7]![7] = 'black'
    const result = findBestMove(board, 'white', 1, 4, 2000)
    expect(result.searchedDepth).toBeGreaterThanOrEqual(2)
    expect(result.searchedDepth).toBeLessThanOrEqual(4)
  })
})
