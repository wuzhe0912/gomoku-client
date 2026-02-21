import { checkWin, isDraw } from '@/game/win'
import { getCandidates } from '@/ai/candidates'
import { evaluate } from '@/ai/evaluate'
import type { Board, Coord, Player } from '@/types/game'

const WIN_SCORE = 1_000_000

function opponentOf(player: Player): Player {
  return player === 'black' ? 'white' : 'black'
}

let timedOut = false

function negamax(
  board: Board,
  player: Player,
  depth: number,
  alpha: number,
  beta: number,
  moveCount: number,
  lastMove: Coord | null,
  deadline: number,
): number {
  if (performance.now() > deadline) {
    timedOut = true
    return 0
  }

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
      deadline,
    )
    board[coord.row]![coord.col] = null

    if (timedOut) return 0

    if (score > bestScore) bestScore = score
    if (score > alpha) alpha = score
    if (alpha >= beta) break
  }

  return bestScore
}

function searchAtDepth(
  board: Board,
  player: Player,
  moveCount: number,
  depth: number,
  candidates: Coord[],
  deadline: number,
): { move: Coord; completed: boolean } {
  let bestMove = candidates[0]!
  let bestScore = -Infinity
  timedOut = false

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
      deadline,
    )
    board[coord.row]![coord.col] = null

    if (timedOut) return { move: bestMove, completed: false }

    if (score > bestScore) {
      bestScore = score
      bestMove = coord
    }
  }

  return { move: bestMove, completed: true }
}

export interface FindBestMoveResult {
  coord: Coord
  searchedDepth: number
}

export function findBestMove(
  board: Board,
  player: Player,
  moveCount: number,
  targetDepth: number,
  slaMs: number,
): FindBestMoveResult {
  const candidates = getCandidates(board, moveCount)
  if (candidates.length === 1) {
    return { coord: candidates[0]!, searchedDepth: 0 }
  }

  const start = performance.now()
  // Reserve 40% of time budget as safety margin for deeper iterations
  const deadline = start + slaMs * 0.6
  let bestMove = candidates[0]!
  let completedDepth = 0

  // Iterative deepening: depth 2, 4, 6, ...
  for (let d = 2; d <= targetDepth; d += 2) {
    const result = searchAtDepth(board, player, moveCount, d, candidates, deadline)
    if (result.completed) {
      bestMove = result.move
      completedDepth = d
    } else {
      // Timed out during this depth — use last completed result
      break
    }

    // Check if we've used more than 60% of total SLA
    if (performance.now() - start > slaMs * 0.6) break
  }

  return { coord: bestMove, searchedDepth: completedDepth }
}
