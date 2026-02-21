<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { BOARD_SIZE } from '../game/constants'
import type { Board, Coord } from '../types/game'

const props = defineProps<{
  board: Board
  lastMove: Coord | null
  isGameOver: boolean
}>()

const emit = defineEmits<{
  place: [coord: Coord]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const PADDING = 24
const CELL_SIZE = 36
const BOARD_PX = PADDING * 2 + (BOARD_SIZE - 1) * CELL_SIZE

const STAR_POINTS: Coord[] = [
  { row: 3, col: 3 },
  { row: 3, col: 11 },
  { row: 7, col: 7 },
  { row: 11, col: 3 },
  { row: 11, col: 11 },
]

function gridToPixel(row: number, col: number) {
  return {
    x: PADDING + col * CELL_SIZE,
    y: PADDING + row * CELL_SIZE,
  }
}

function drawBoard(ctx: CanvasRenderingContext2D) {
  // Background
  ctx.fillStyle = '#DEB887'
  ctx.fillRect(0, 0, BOARD_PX, BOARD_PX)

  // Grid lines
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1

  for (let i = 0; i < BOARD_SIZE; i++) {
    const start = gridToPixel(i, 0)
    const end = gridToPixel(i, BOARD_SIZE - 1)
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()

    const top = gridToPixel(0, i)
    const bottom = gridToPixel(BOARD_SIZE - 1, i)
    ctx.beginPath()
    ctx.moveTo(top.x, top.y)
    ctx.lineTo(bottom.x, bottom.y)
    ctx.stroke()
  }

  // Star points
  ctx.fillStyle = '#333'
  for (const point of STAR_POINTS) {
    const { x, y } = gridToPixel(point.row, point.col)
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}

const STONE_RADIUS = CELL_SIZE * 0.44

function drawStones(ctx: CanvasRenderingContext2D) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = props.board[row]![col]
      if (!cell) continue

      const { x, y } = gridToPixel(row, col)
      ctx.beginPath()
      ctx.arc(x, y, STONE_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = cell === 'black' ? '#111' : '#f5f5f5'
      ctx.fill()
      ctx.strokeStyle = cell === 'black' ? '#000' : '#ccc'
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }
}

function drawLastMoveHighlight(ctx: CanvasRenderingContext2D) {
  if (!props.lastMove) return
  const { x, y } = gridToPixel(props.lastMove.row, props.lastMove.col)
  ctx.beginPath()
  ctx.arc(x, y, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#e53e3e'
  ctx.fill()
}

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = BOARD_PX * dpr
  canvas.height = BOARD_PX * dpr
  ctx.scale(dpr, dpr)

  drawBoard(ctx)
  drawStones(ctx)
  drawLastMoveHighlight(ctx)
}

function pixelToGrid(px: number, py: number): Coord | null {
  const col = Math.round((px - PADDING) / CELL_SIZE)
  const row = Math.round((py - PADDING) / CELL_SIZE)

  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return null

  const { x, y } = gridToPixel(row, col)
  const threshold = CELL_SIZE * 0.4
  if (Math.abs(px - x) > threshold || Math.abs(py - y) > threshold) return null

  return { row, col }
}

function clientToGrid(clientX: number, clientY: number): Coord | null {
  const canvas = canvasRef.value
  if (!canvas) return null
  const rect = canvas.getBoundingClientRect()
  const scaleX = BOARD_PX / rect.width
  const scaleY = BOARD_PX / rect.height
  const px = (clientX - rect.left) * scaleX
  const py = (clientY - rect.top) * scaleY
  return pixelToGrid(px, py)
}

function handleClick(e: MouseEvent) {
  const coord = clientToGrid(e.clientX, e.clientY)
  if (coord) emit('place', coord)
}

function handleTouch(e: TouchEvent) {
  const touch = e.changedTouches[0]
  if (!touch) return
  const coord = clientToGrid(touch.clientX, touch.clientY)
  if (coord) emit('place', coord)
}

onMounted(render)
watch(() => props.board, render, { deep: true })
watch(() => props.lastMove, render)
</script>

<template>
  <canvas
    ref="canvasRef"
    :class="['w-full max-w-[564px] aspect-square rounded shadow-md', isGameOver ? 'cursor-default' : 'cursor-pointer']"
    @click="handleClick"
    @touchend.prevent="handleTouch"
  />
</template>
