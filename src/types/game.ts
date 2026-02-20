export type Player = 'black' | 'white'

export type Cell = Player | null

export interface Coord {
  row: number
  col: number
}

export type Board = Cell[][]

export interface GameState {
  board: Board
  currentPlayer: Player
  moveCount: number
  lastMove: Coord | null
  isGameOver: boolean
  winner: Player | null
}
