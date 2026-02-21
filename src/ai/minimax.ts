import { checkWin, isDraw } from '@/game/win'
import { getCandidates } from '@/ai/candidates'
import { evaluate } from '@/ai/evaluate'
import type { Board, Coord, Player } from '@/types/game'

const WIN_SCORE = 1_000_000

function opponentOf(player: Player): Player {
  return player === 'black' ? 'white' : 'black'
}

function negamax(
  board: Board,
  player: Player,
  depth: number,
  alpha: number,
  beta: number,
  moveCount: number,
  lastMove: Coord | null,
): number {
  // Check terminal: win by last move
  if (lastMove && checkWin(board, lastMove)) {
    // The player who just moved (opponent of current player) won
    return -(WIN_SCORE + depth)
  }

  if (isDraw(moveCount)) return 0
  if (depth === 0) return evaluate(board, player)

  const candidates = getCandidates(board, moveCount)
  if (candidates.length === 0) return evaluate(board, player)

  let bestScore = -Infinity

  for (const coord of candidates) {
    board[coord.row]![coord.col] = player
    const score = -negamax(
      board,
      opponentOf(player),
      depth - 1,
      -beta,
      -alpha,
      moveCount + 1,
      coord,
    )
    board[coord.row]![coord.col] = null

    if (score > bestScore) bestScore = score
    if (score > alpha) alpha = score
    if (alpha >= beta) break
  }

  return bestScore
}

export function findBestMove(
  board: Board,
  player: Player,
  moveCount: number,
  depth: number,
): Coord {
  const candidates = getCandidates(board, moveCount)
  if (candidates.length === 1) return candidates[0]!

  let bestMove = candidates[0]!
  let bestScore = -Infinity

  for (const coord of candidates) {
    board[coord.row]![coord.col] = player
    const score = -negamax(
      board,
      opponentOf(player),
      depth - 1,
      -Infinity,
      -bestScore,
      moveCount + 1,
      coord,
    )
    board[coord.row]![coord.col] = null

    if (score > bestScore) {
      bestScore = score
      bestMove = coord
    }
  }

  return bestMove
}
