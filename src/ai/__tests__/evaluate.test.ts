import { describe, expect, it } from 'vitest'
import { evaluate } from '@/ai/evaluate'
import { createEmptyBoard } from '@/game/board'
import type { Board, Coord, Player } from '@/types/game'

function placeStones(board: Board, coords: Coord[], player: Player) {
  for (const c of coords) {
    board[c.row]![c.col] = player
  }
}

describe('evaluate', () => {
  it('returns 0 for empty board', () => {
    const board = createEmptyBoard()
    expect(evaluate(board, 'black')).toBe(0)
  })

  it('scores open-two higher than half-open-two', () => {
    // Open two: stones at (7,6) and (7,7), both sides empty
    const board1 = createEmptyBoard()
    placeStones(board1, [{ row: 7, col: 6 }, { row: 7, col: 7 }], 'black')
    const openTwoScore = evaluate(board1, 'black')

    // Half-open two: stones at (7,0) and (7,1), left side is wall
    const board2 = createEmptyBoard()
    placeStones(board2, [{ row: 7, col: 0 }, { row: 7, col: 1 }], 'black')
    const halfOpenTwoScore = evaluate(board2, 'black')

    expect(openTwoScore).toBeGreaterThan(halfOpenTwoScore)
  })

  it('scores open-three much higher than open-two', () => {
    const board1 = createEmptyBoard()
    placeStones(board1, [
      { row: 7, col: 5 },
      { row: 7, col: 6 },
      { row: 7, col: 7 },
    ], 'black')
    const threeScore = evaluate(board1, 'black')

    const board2 = createEmptyBoard()
    placeStones(board2, [
      { row: 7, col: 6 },
      { row: 7, col: 7 },
    ], 'black')
    const twoScore = evaluate(board2, 'black')

    expect(threeScore).toBeGreaterThan(twoScore)
  })

  it('penalizes opponent threats with multiplier', () => {
    // Symmetric board with one side having player stones and other having opponent stones
    const board = createEmptyBoard()
    placeStones(board, [
      { row: 3, col: 6 },
      { row: 3, col: 7 },
      { row: 3, col: 8 },
    ], 'black')
    placeStones(board, [
      { row: 10, col: 6 },
      { row: 10, col: 7 },
      { row: 10, col: 8 },
    ], 'white')

    // From black's perspective, opponent threat is multiplied
    const score = evaluate(board, 'black')
    expect(score).toBeLessThan(0) // opponent's threat weighted higher
  })

  it('detects five-in-a-row as very high score', () => {
    const board = createEmptyBoard()
    placeStones(board, [
      { row: 7, col: 3 },
      { row: 7, col: 4 },
      { row: 7, col: 5 },
      { row: 7, col: 6 },
      { row: 7, col: 7 },
    ], 'black')
    const score = evaluate(board, 'black')
    expect(score).toBeGreaterThan(500_000)
  })

  it('scores four-in-a-row higher than three', () => {
    const board1 = createEmptyBoard()
    placeStones(board1, [
      { row: 7, col: 4 },
      { row: 7, col: 5 },
      { row: 7, col: 6 },
      { row: 7, col: 7 },
    ], 'black')
    const fourScore = evaluate(board1, 'black')

    const board2 = createEmptyBoard()
    placeStones(board2, [
      { row: 7, col: 5 },
      { row: 7, col: 6 },
      { row: 7, col: 7 },
    ], 'black')
    const threeScore = evaluate(board2, 'black')

    expect(fourScore).toBeGreaterThan(threeScore)
  })
})
