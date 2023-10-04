import { BOARD_COLS, BOARD_ROWS } from "./GameGlobals";
import Piece from "./Piece";
import { Shape } from "./Shapes";

export default class Board {
  #data!: Shape;

  constructor() {
    this.#data = Array.from( {
      length: BOARD_ROWS,
    }, () => Array.from( {
      length: BOARD_COLS,
    }, () => 0));
  }

  hasSolidIn(position: {x: number; y: number} ) {
    return this.#data[position.y][position.x] > 0;
  }

  isDefinedIn(position: {x: number; y: number} ) {
    return this.#data[position.y][position.x] !== undefined;
  }

  merge(piece: Piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] > 0) {
          const row = y + piece.position.y;
          const col = x + piece.position.x;

          this.#data[row][col] = piece.shape[y][x];
        }
      }
    }

    this.#updateLines();
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.#data.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value > 0) {
          ctx.fillRect(
            colIndex,
            rowIndex,
            1,
            1,
          );
        }
      } );
    } );

    // draw grid
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.0125;
    ctx.beginPath();

    for (let x = 0; x <= BOARD_COLS; x++) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, BOARD_ROWS);
    }

    for (let y = 0; y <= BOARD_ROWS; y++) {
      ctx.moveTo(0, y);
      ctx.lineTo(BOARD_COLS, y);
    }

    ctx.stroke();
  }

  #updateLines() {
    this.#data.forEach((row, rowIndex) => {
      if (row.every((value) => value > 0)) {
        this.#data.splice(rowIndex, 1);
        this.#data.unshift(Array.from( {
          length: BOARD_COLS,
        }, () => 0));
      }
    } );
  }
}
