<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { BOARD_SIZE } from '../game/constants'
import type { Board, Coord } from '../types/game'

const props = defineProps<{
  board: Board
  lastMove: Coord | null
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

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = BOARD_PX * dpr
  canvas.height = BOARD_PX * dpr
  canvas.style.width = `${BOARD_PX}px`
  canvas.style.height = `${BOARD_PX}px`
  ctx.scale(dpr, dpr)

  drawBoard(ctx)
}

onMounted(render)
watch(() => props.board, render, { deep: true })
</script>

<template>
  <canvas
    ref="canvasRef"
    class="cursor-pointer rounded shadow-md"
    :style="{ width: `${BOARD_PX}px`, height: `${BOARD_PX}px` }"
  />
</template>
