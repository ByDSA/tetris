import Board from "./Board";
import { BLOCK_SIZE, BOARD_COLS, BOARD_ROWS, Position } from "./GameGlobals";
import { addKeyListeners } from "./Keyboard";
import { startMusic, stopMusic } from "./Music";
import PieceController from "./PieceController";
import { Shape } from "./Shapes";

export type IsCollidingFunc = (position: Position, shape: Shape)=> boolean;

type Params = {
  canvas: HTMLCanvasElement;
};
export default class Game {
  #ctx: CanvasRenderingContext2D;

  #steps!: number;

  #running: boolean;

  #board!: Board;

  #pieceController!: PieceController;

  constructor( { canvas }: Params) {
    this.#running = false;

    this.#reset();

    // eslint-disable-next-line no-param-reassign
    canvas.width = BLOCK_SIZE * BOARD_COLS;
    // eslint-disable-next-line no-param-reassign
    canvas.height = BLOCK_SIZE * BOARD_ROWS;
    const ctx = canvas.getContext("2d");

    if (!ctx)
      throw new Error("No canvas context found!");

    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

    this.#ctx = ctx;

    this.#draw();

    addKeyListeners( {
      onDown: this.#onDown.bind(this),
      onLeft: this.#onLeft.bind(this),
      onRight: this.#onRight.bind(this),
      onUp: this.#onUp.bind(this),
    } );
  }

  #reset() {
    this.#board = new Board();

    this.#steps = 0;

    this.#pieceController = new PieceController( {
      mergeCurrentPiece: this.#mergeCurrentPiece.bind(this),
      board: this.#board,
    } );
  }

  #update() {
    this.#steps++;

    const speed = Math.round(this.#steps / 400);

    if (this.#steps % (30 - speed) === 0)
      this.#pieceController.tryToMoveDown();

    this.#draw();

    if (this.#running)
      requestAnimationFrame(this.#update.bind(this));
  }

  start() {
    if (this.#running)
      return;

    this.#running = true;

    this.#reset();

    this.#createPiece();

    startMusic();

    this.#draw();
    requestAnimationFrame(this.#update.bind(this));
  }

  #onRight() {
    if (!this.#running) {
      this.start();

      return;
    }

    if (!this.#pieceController.currentPiece)
      return;

    const currentPosition = this.#pieceController.currentPiece.position;
    const nextPosition = {
      x: currentPosition.x + 1,
      y: currentPosition.y,
    };

    this.#pieceController.tryToMoveTo(nextPosition);
  }

  #onLeft() {
    if (!this.#running) {
      this.start();

      return;
    }

    if (!this.#pieceController.currentPiece)
      return;

    const currentPosition = this.#pieceController.currentPiece.position;
    const nextPosition = {
      x: currentPosition.x - 1,
      y: currentPosition.y,
    };

    this.#pieceController.tryToMoveTo(nextPosition);
  }

  #onDown() {
    if (!this.#running) {
      this.start();

      return;
    }

    if (!this.#pieceController.currentPiece)
      return;

    this.#pieceController.tryToMoveDown();
  }

  #onUp() {
    if (!this.#running) {
      this.start();

      return;
    }

    if (!this.#pieceController.currentPiece)
      return;

    this.#pieceController.tryToRotate();
  }

  #mergeCurrentPiece() {
    const { currentPiece } = this.#pieceController;

    if (!currentPiece)
      return;

    this.#board.merge(currentPiece);

    this.#createPiece();
  }

  #createPiece() {
    this.#pieceController.createPiece();

    if (this.#checkGameOver())
      this.#gameOver();
  }

  #gameOver() {
    stopMusic();
    alert("Game Over!");
    this.#reset();
    this.#running = false;
  }

  #checkGameOver(): boolean {
    const { currentPiece } = this.#pieceController;

    if (!currentPiece)
      return false;

    return this.#pieceController.isCurrentPieceCollidingWithBoard();
  }

  #draw() {
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
    this.#pieceController.currentPiece?.draw(this.#ctx);

    this.#ctx.fillStyle = "yellow";

    this.#board.draw(this.#ctx);
  }
}
