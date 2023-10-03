import { BLOCK_SIZE, COLS, Position, ROWS } from "./GameGlobals";
import Piece from "./Piece";
import SHAPES, { Shape } from "./Shapes";

export type IsCollidingFunc = (position: Position, shape: Shape)=> boolean;

type Params = {
  canvas: HTMLCanvasElement;
};
export default class Game {
  #ctx: CanvasRenderingContext2D;

  steps!: number;

  currentPiece!: Piece;

  board!: Shape;

  constructor( { canvas }: Params) {
    // eslint-disable-next-line no-param-reassign
    canvas.width = BLOCK_SIZE * COLS;
    // eslint-disable-next-line no-param-reassign
    canvas.height = BLOCK_SIZE * ROWS;
    const ctx = canvas.getContext("2d");

    if (!ctx)
      throw new Error("No canvas context found!");

    this.#ctx = ctx;

    // Key listeners
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          this.onUp();
          break;
        case "ArrowDown":
          this.onDown();
          break;
        case "ArrowLeft":
          this.onLeft();
          break;
        case "ArrowRight":
          this.onRight();
          break;
        default:
      }
    } );
  }

  reset() {
    this.board = Array.from( {
      length: ROWS,
    }, () => Array.from( {
      length: COLS,
    }, () => 0));

    this.steps = 0;

    this.#createPiece();

    startMusic();
  }

  #update() {
    this.steps++;
    const speed = Math.round(this.steps / 400);

    if (this.steps % (30 - speed) === 0)
      this.#tryToMoveDown();
  }

  #tryToMoveTo(position: Position) {
    if (!this.#isColliding(position, this.currentPiece.shape))
      this.currentPiece.position = position;
  }

  #tryToMoveDown() {
    const currentPosition = this.currentPiece.position;
    const nextPosition = {
      x: currentPosition.x,
      y: currentPosition.y + 1,
    };

    if (this.#isCollidingWithSideEdges(nextPosition, this.currentPiece.shape))
      return;

    if (this.#isCollidingWithBoardOrBottom(nextPosition, this.currentPiece.shape))
      this.#merge();
    else
      this.currentPiece.position = nextPosition;
  }

  init() {
    const haveToCallDraw = this.steps === undefined;

    this.reset();

    if (haveToCallDraw)
      this.draw();
  }

  onRight() {
    const currentPosition = this.currentPiece.position;
    const nextPosition = {
      x: currentPosition.x + 1,
      y: currentPosition.y,
    };

    this.#tryToMoveTo(nextPosition);
  }

  onLeft() {
    const currentPosition = this.currentPiece.position;
    const nextPosition = {
      x: currentPosition.x - 1,
      y: currentPosition.y,
    };

    this.#tryToMoveTo(nextPosition);
  }

  onDown() {
    this.#tryToMoveDown();
  }

  onUp() {
    const { shape } = this.currentPiece;
    const newShape = shape[0].map((_, index) => shape.map((row) => row[index]).reverse());

    if (!this.#isColliding(this.currentPiece.position, newShape))
      this.currentPiece.shape = newShape;
  }

  #merge() {
    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        if (this.currentPiece.shape[y][x] > 0) {
          const row = y + this.currentPiece.position.y;
          const col = x + this.currentPiece.position.x;

          this.board[row][col] = this.currentPiece.shape[y][x];
        }
      }
    }

    this.#updateLines();

    this.#createPiece();
  }

  #createPiece() {
    const newPiece = new Piece( {
      color: "red",
      position: {
        x: 2,
        y: 0,
      },
      shape: Object.entries(SHAPES)[Math.floor(Math.random() * Object.keys(SHAPES).length)][1],
    } );

    if (this.#isCollidingWithBoardOrBottom(newPiece.position, newPiece.shape)) {
      alert("Game Over!");
      this.reset();
    } else
      this.currentPiece = newPiece;
  }

  #updateLines() {
    this.board.forEach((row, rowIndex) => {
      if (row.every((value) => value > 0)) {
        this.board.splice(rowIndex, 1);
        this.board.unshift(Array.from( {
          length: COLS,
        }, () => 0));
      }
    } );
  }

  #isCollidingWithBoardOrBottom(position: Position, shape: Shape): boolean {
    const isCollindingWithBottom = position.y + shape.length > ROWS;

    if (isCollindingWithBottom)
      return true;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] > 0) {
          if (
            this.board[y + position.y][x + position.x] > 0
          )
            return true;
        }
      }
    }

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  #isCollidingWithSideEdges(position: Position, shape: Shape): boolean {
    if (position.x < 0 || position.x + shape[0].length > COLS)
      return true;

    return false;
  }

  #isColliding(position: Position, shape: Shape): boolean {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] > 0) {
          if (
            this.board[y + position.y] === undefined
            || this.board[y + position.y][x + position.x] === undefined
            || this.board[y + position.y][x + position.x] > 0
          )
            return true;
        }
      }
    }

    return false;
  }

  draw() {
    this.#update();
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
    this.currentPiece.draw(this.#ctx);

    this.#ctx.fillStyle = "yellow";

    this.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value > 0) {
          this.#ctx.fillRect(
            colIndex * BLOCK_SIZE,
            rowIndex * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE,
          );
        }
      } );
    } );

    // draw grid
    this.#ctx.strokeStyle = "black";
    this.#ctx.lineWidth = 0.5;
    this.#ctx.beginPath();

    for (let x = 0; x <= this.#ctx.canvas.width; x += BLOCK_SIZE) {
      this.#ctx.moveTo(x, 0);
      this.#ctx.lineTo(x, this.#ctx.canvas.height);
    }

    for (let y = 0; y <= this.#ctx.canvas.height; y += BLOCK_SIZE) {
      this.#ctx.moveTo(0, y);
      this.#ctx.lineTo(this.#ctx.canvas.width, y);
    }

    this.#ctx.stroke();

    requestAnimationFrame(this.draw.bind(this));
  }
}

let audio: HTMLAudioElement | undefined;

function startMusic() {
  audio ??= new Audio("Tetris.mp3");

  audio.volume = 0.4;
  audio.play();
  audio.currentTime = 0;
  audio.loop = true;
}
