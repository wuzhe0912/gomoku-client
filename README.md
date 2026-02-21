# Gomoku Client

五子棋 Web 前端，支援雙人對弈、AI 對戰、線上即時對戰。

## 快速啟動

```bash
cd /Volumes/SSD/2026/gomoku-web-game/gomoku-client
bun install
bun run dev
```

瀏覽器開啟 `http://localhost:5173` 即可使用。

## 遊戲模式

| 模式 | 說明 |
|------|------|
| 雙人對弈 | 本機兩人輪流落子 |
| 人機對戰 | 與 AI 對弈，支援 Easy / Normal / Hard 三種難度 |
| 線上對戰 | 透過 WebSocket 連線 Server，與遠端玩家即時對弈 |

### 線上對戰

需先啟動 Server（見 `gomoku-server/README.md`），預設連線 `ws://localhost:8000/ws`。

可透過 `.env` 覆蓋：

```bash
VITE_WS_URL=ws://your-server:8000/ws
```

## 開發指令

```bash
# 開發模式（hot reload）
bun run dev

# 建置
bun run build

# 跑測試
bun run test
```

## 專案結構

```
src/
├── ai/              # Minimax AI（Web Worker、評估函數、候選點篩選）
├── components/      # Vue 元件（棋盤、狀態列、模式選擇、線上面板）
├── composables/     # 組合式函式（遊戲狀態、AI Worker、線上對戰）
├── game/            # 遊戲核心邏輯（棋盤、勝負判定、常數）
├── net/             # WebSocket 封裝（連線/重連）
├── types/           # TypeScript 型別定義
├── App.vue          # 根元件
└── main.ts          # 入口
```

## 技術棧

- Vue 3 + TypeScript + Vite
- Tailwind CSS v4
- Canvas 棋盤渲染
- Web Worker（AI 計算不阻塞 UI）
- 原生 WebSocket（線上對戰）
- Bun（套件管理與腳本執行）
