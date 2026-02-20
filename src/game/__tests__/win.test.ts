import { describe, expect, it } from 'vitest';
import { checkWin, isDraw } from '../win';
import { createEmptyBoard } from '../board';
import { BOARD_SIZE } from '../constants';
import type { Board, Coord, Player } from '../../types/game';

function placeStones(board: Board, coords: Coord[], player: Player) {
  for (const c of coords) {
    board[c.row]![c.col] = player;
  }
}

describe('checkWin', () => {
  it('detects horizontal win', () => {
    const board = createEmptyBoard();
    const coords: Coord[] = [
      { row: 7, col: 3 },
      { row: 7, col: 4 },
      { row: 7, col: 5 },
      { row: 7, col: 6 },
      { row: 7, col: 7 },
    ];
    placeStones(board, coords, 'black');
    expect(checkWin(board, { row: 7, col: 5 })).toBe('black');
  });

  it('detects vertical win', () => {
    const board = createEmptyBoard();
    const coords: Coord[] = [
      { row: 2, col: 4 },
      { row: 3, col: 4 },
      { row: 4, col: 4 },
      { row: 5, col: 4 },
      { row: 6, col: 4 },
    ];
    placeStones(board, coords, 'white');
    expect(checkWin(board, { row: 6, col: 4 })).toBe('white');
  });

  it('detects diagonal ↘ win', () => {
    const board = createEmptyBoard();
    const coords: Coord[] = [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
      { row: 3, col: 3 },
      { row: 4, col: 4 },
    ];
    placeStones(board, coords, 'black');
    expect(checkWin(board, { row: 2, col: 2 })).toBe('black');
  });

  it('detects diagonal ↗ win', () => {
    const board = createEmptyBoard();
    const coords: Coord[] = [
      { row: 10, col: 2 },
      { row: 9, col: 3 },
      { row: 8, col: 4 },
      { row: 7, col: 5 },
      { row: 6, col: 6 },
    ];
    placeStones(board, coords, 'white');
    expect(checkWin(board, { row: 8, col: 4 })).toBe('white');
  });

  it('returns null for four in a row', () => {
    const board = createEmptyBoard();
    const coords: Coord[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ];
    placeStones(board, coords, 'black');
    expect(checkWin(board, { row: 0, col: 3 })).toBeNull();
  });

  it('returns null on empty board', () => {
    const board = createEmptyBoard();
    board[7]![7] = 'black';
    expect(checkWin(board, { row: 7, col: 7 })).toBeNull();
  });

  it('does not count mixed colors', () => {
    const board = createEmptyBoard();
    placeStones(
      board,
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      'black',
    );
    placeStones(
      board,
      [
        { row: 0, col: 3 },
        { row: 0, col: 4 },
      ],
      'white',
    );
    expect(checkWin(board, { row: 0, col: 2 })).toBeNull();
  });

  it('detects win at board edge', () => {
    const board = createEmptyBoard();
    const coords: Coord[] = [
      { row: 0, col: 10 },
      { row: 0, col: 11 },
      { row: 0, col: 12 },
      { row: 0, col: 13 },
      { row: 0, col: 14 },
    ];
    placeStones(board, coords, 'black');
    expect(checkWin(board, { row: 0, col: 14 })).toBe('black');
  });

  it('detects win when lastMove is at the start of the line', () => {
    const board = createEmptyBoard();
    const coords: Coord[] = [
      { row: 5, col: 0 },
      { row: 5, col: 1 },
      { row: 5, col: 2 },
      { row: 5, col: 3 },
      { row: 5, col: 4 },
    ];
    placeStones(board, coords, 'white');
    expect(checkWin(board, { row: 5, col: 0 })).toBe('white');
  });
});

describe('isDraw', () => {
  it('returns false when board is not full', () => {
    expect(isDraw(100)).toBe(false);
  });

  it('returns true when board is full', () => {
    expect(isDraw(BOARD_SIZE * BOARD_SIZE)).toBe(true);
  });

  it('returns false at 224 moves', () => {
    expect(isDraw(224)).toBe(false);
  });
});
