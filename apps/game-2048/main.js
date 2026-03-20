// 2048 游戏核心逻辑
import { saveToLocalStorage, getFromLocalStorage } from '@shared/utils/storage.js'

class Game2048 {
  constructor() {
    this.size = 4
    this.board = []
    this.score = 0
    this.bestScore = getFromLocalStorage('2048_best_score', 0)
    this.gameOver = false
    this.gameWon = false
    this.canMove = true

    this.init()
    this.bindEvents()
  }

  init() {
    // 初始化棋盘
    this.board = Array(this.size).fill().map(() => Array(this.size).fill(0))
    this.score = 0
    this.gameOver = false
    this.gameWon = false
    this.canMove = true

    // 生成两个初始方块
    this.addRandomTile()
    this.addRandomTile()

    // 更新 UI
    this.updateScore()
    this.renderBoard()
    this.hideGameOver()
    this.hideGameWin()
  }

  addRandomTile() {
    const emptyCells = []
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ x: i, y: j })
        }
      }
    }

    if (emptyCells.length > 0) {
      const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      const value = Math.random() < 0.9 ? 2 : 4
      this.board[cell.x][cell.y] = value
      return true
    }
    return false
  }

  renderBoard() {
    const gameBoard = document.getElementById('gameBoard')
    gameBoard.innerHTML = ''

    // 绘制背景格子
    for (let i = 0; i < this.size * this.size; i++) {
      const cell = document.createElement('div')
      cell.className = 'grid-cell'
      gameBoard.appendChild(cell)
    }

    // 绘制方块
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const value = this.board[i][j]
        if (value !== 0) {
          const tile = document.createElement('div')
          let tileClass = 'tile'

          if (value <= 2048) {
            tileClass += ` tile-${value}`
          } else {
            tileClass += ' tile-super'
          }

          tile.className = tileClass
          tile.textContent = value

          // 计算位置
          const cellSize = (gameBoard.clientWidth - 15 * 5) / 4
          tile.style.left = `${j * (cellSize + 15) + 15}px`
          tile.style.top = `${i * (cellSize + 15) + 15}px`

          gameBoard.appendChild(tile)

          // 添加新方块动画
          setTimeout(() => {
            tile.classList.add('tile-new')
          }, 10)
        }
      }
    }
  }

  move(direction) {
    if (!this.canMove || this.gameOver) return false

    let moved = false
    let merged = Array(this.size).fill().map(() => Array(this.size).fill(false))

    // 根据方向处理移动
    switch (direction) {
      case 'up':
        for (let j = 0; j < this.size; j++) {
          for (let i = 1; i < this.size; i++) {
            if (this.board[i][j] !== 0) {
              let k = i
              while (k > 0 && this.board[k - 1][j] === 0) {
                k--
              }

              if (k > 0 && this.board[k - 1][j] === this.board[i][j] && !merged[k - 1][j]) {
                // 合并
                this.board[k - 1][j] *= 2
                this.board[i][j] = 0
                this.score += this.board[k - 1][j]
                merged[k - 1][j] = true
                moved = true

                // 检查是否获胜
                if (this.board[k - 1][j] === 2048 && !this.gameWon) {
                  this.gameWon = true
                  setTimeout(() => this.showGameWin(), 300)
                }
              } else if (k !== i) {
                // 移动
                this.board[k][j] = this.board[i][j]
                this.board[i][j] = 0
                moved = true
              }
            }
          }
        }
        break

      case 'down':
        for (let j = 0; j < this.size; j++) {
          for (let i = this.size - 2; i >= 0; i--) {
            if (this.board[i][j] !== 0) {
              let k = i
              while (k < this.size - 1 && this.board[k + 1][j] === 0) {
                k++
              }

              if (k < this.size - 1 && this.board[k + 1][j] === this.board[i][j] && !merged[k + 1][j]) {
                this.board[k + 1][j] *= 2
                this.board[i][j] = 0
                this.score += this.board[k + 1][j]
                merged[k + 1][j] = true
                moved = true

                if (this.board[k + 1][j] === 2048 && !this.gameWon) {
                  this.gameWon = true
                  setTimeout(() => this.showGameWin(), 300)
                }
              } else if (k !== i) {
                this.board[k][j] = this.board[i][j]
                this.board[i][j] = 0
                moved = true
              }
            }
          }
        }
        break

      case 'left':
        for (let i = 0; i < this.size; i++) {
          for (let j = 1; j < this.size; j++) {
            if (this.board[i][j] !== 0) {
              let k = j
              while (k > 0 && this.board[i][k - 1] === 0) {
                k--
              }

              if (k > 0 && this.board[i][k - 1] === this.board[i][j] && !merged[i][k - 1]) {
                this.board[i][k - 1] *= 2
                this.board[i][j] = 0
                this.score += this.board[i][k - 1]
                merged[i][k - 1] = true
                moved = true

                if (this.board[i][k - 1] === 2048 && !this.gameWon) {
                  this.gameWon = true
                  setTimeout(() => this.showGameWin(), 300)
                }
              } else if (k !== j) {
                this.board[i][k] = this.board[i][j]
                this.board[i][j] = 0
                moved = true
              }
            }
          }
        }
        break

      case 'right':
        for (let i = 0; i < this.size; i++) {
          for (let j = this.size - 2; j >= 0; j--) {
            if (this.board[i][j] !== 0) {
              let k = j
              while (k < this.size - 1 && this.board[i][k + 1] === 0) {
                k++
              }

              if (k < this.size - 1 && this.board[i][k + 1] === this.board[i][j] && !merged[i][k + 1]) {
                this.board[i][k + 1] *= 2
                this.board[i][j] = 0
                this.score += this.board[i][k + 1]
                merged[i][k + 1] = true
                moved = true

                if (this.board[i][k + 1] === 2048 && !this.gameWon) {
                  this.gameWon = true
                  setTimeout(() => this.showGameWin(), 300)
                }
              } else if (k !== j) {
                this.board[i][k] = this.board[i][j]
                this.board[i][j] = 0
                moved = true
              }
            }
          }
        }
        break
    }

    if (moved) {
      this.canMove = false
      this.updateScore()
      this.renderBoard()

      setTimeout(() => {
        this.addRandomTile()
        this.renderBoard()
        this.canMove = true

        // 检查游戏是否结束
        if (!this.canMoveAny() && !this.gameOver) {
          this.gameOver = true
          this.updateBestScore()
          setTimeout(() => this.showGameOver(), 300)
        }
      }, 150)
    }

    return moved
  }

  canMoveAny() {
    // 检查是否有空位
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true
        }
      }
    }

    // 检查是否有可以合并的相邻方块
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const value = this.board[i][j]
        if (i < this.size - 1 && this.board[i + 1][j] === value) return true
        if (j < this.size - 1 && this.board[i][j + 1] === value) return true
      }
    }

    return false
  }

  updateScore() {
    document.getElementById('score').textContent = this.score
    document.getElementById('bestScore').textContent = Math.max(this.score, this.bestScore)
  }

  updateBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score
      saveToLocalStorage('2048_best_score', this.bestScore)
    }
  }

  showGameOver() {
    document.getElementById('finalScore').textContent = this.score
    document.getElementById('gameOver').style.display = 'flex'
  }

  hideGameOver() {
    document.getElementById('gameOver').style.display = 'none'
  }

  showGameWin() {
    document.getElementById('gameWin').style.display = 'flex'
  }

  hideGameWin() {
    document.getElementById('gameWin').style.display = 'none'
  }

  bindEvents() {
    // 键盘事件
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault()

        let direction
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            direction = 'up'
            break
          case 'ArrowDown':
          case 's':
          case 'S':
            direction = 'down'
            break
          case 'ArrowLeft':
          case 'a':
          case 'A':
            direction = 'left'
            break
          case 'ArrowRight':
          case 'd':
          case 'D':
            direction = 'right'
            break
        }

        this.move(direction)
      }
    })

    // 触摸滑动事件
    let touchStartX = 0
    let touchStartY = 0

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }, { passive: true })

    document.addEventListener('touchend', (e) => {
      if (!touchStartX || !touchStartY) return

      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY

      const diffX = touchEndX - touchStartX
      const diffY = touchEndY - touchStartY

      // 判断滑动方向
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // 水平滑动
        if (Math.abs(diffX) > 20) {
          this.move(diffX > 0 ? 'right' : 'left')
        }
      } else {
        // 垂直滑动
        if (Math.abs(diffY) > 20) {
          this.move(diffY > 0 ? 'down' : 'up')
        }
      }

      touchStartX = 0
      touchStartY = 0
    }, { passive: true })

    // 按钮事件
    document.getElementById('newGameBtn').addEventListener('click', () => {
      this.init()
    })

    document.getElementById('restartBtn').addEventListener('click', () => {
      this.init()
    })

    document.getElementById('restartWinBtn').addEventListener('click', () => {
      this.init()
    })

    document.getElementById('continueBtn').addEventListener('click', () => {
      this.hideGameWin()
    })

    // 窗口大小改变时重新渲染
    window.addEventListener('resize', () => {
      this.renderBoard()
    })
  }
}

// 初始化游戏
const game = new Game2048()

console.log('2048 游戏已加载 🎮')
console.log('使用方向键或滑动来开始游戏吧！')
