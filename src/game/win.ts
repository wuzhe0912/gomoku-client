import { BOARD_SIZE } from '@/game/constants';
import type { Board, Coord, Player } from '@/types/game';

const DIRECTIONS: [number, number][] = [
  [0, 1],  // horizontal →
  [1, 0],  // vertical ↓
  [1, 1],  // diagonal ↘
  [1, -1], // diagonal ↗
];

export function checkWin(board: Board, lastMove: Coord): Player | null {
  const player = board[lastMove.row]![lastMove.col];
  if (!player) return null;

  for (const [dr, dc] of DIRECTIONS) {
    let count = 1;

    // Extend in positive direction
    for (let i = 1; i <= 4; i++) {
      const r = lastMove.row + dr * i;
      const c = lastMove.col + dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
      if (board[r]![c] !== player) break;
      count++;
    }

    // Extend in negative direction
    for (let i = 1; i <= 4; i++) {
      const r = lastMove.row - dr * i;
      const c = lastMove.col - dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
      if (board[r]![c] !== player) break;
      count++;
    }

    if (count >= 5) return player;
  }

  return null;
}

export function isDraw(moveCount: number): boolean {
  return moveCount >= BOARD_SIZE * BOARD_SIZE;
}
