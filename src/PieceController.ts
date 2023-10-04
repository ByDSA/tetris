import Board from "./Board";
import { BOARD_COLS, BOARD_ROWS, Position } from "./GameGlobals";
import Piece from "./Piece";
import SHAPES, { Shape } from "./Shapes";

type Params = {
  mergeCurrentPiece: ()=> void;
 board: Board;
};
export default class PieceController {
  #currentPiece: Piece | null;

  #mergeCurrentPiece: ()=> void;

  #board: Board;

  constructor( { mergeCurrentPiece, board }: Params) {
    this.#board = board;
    this.#mergeCurrentPiece = mergeCurrentPiece;
    this.#currentPiece = null;
  }

  tryToMoveTo(position: Position) {
    if (!this.#currentPiece)
      return;

    if (!this.#isColliding(position, this.#currentPiece.shape))
      this.#currentPiece.position = position;
  }

  // eslint-disable-next-line accessor-pairs
  get currentPiece() {
    return this.#currentPiece;
  }

  createPiece() {
    const newPiece = new Piece( {
      color: "red",
      position: {
        x: 2,
        y: 0,
      },
      shape: Object.entries(SHAPES)[Math.floor(Math.random() * Object.keys(SHAPES).length)][1],
    } );

    this.#currentPiece = newPiece;
  }

  isCurrentPieceCollidingWithBoard() {
    if (!this.#currentPiece)
      return false;

    return this.#isCollidingWithBoardOrBottom(
      this.#currentPiece.position,
      this.#currentPiece.shape,
    );
  }

  #isCollidingWithBoardOrBottom(position: Position, shape: Shape): boolean {
    const isCollindingWithBottom = position.y + shape.length > BOARD_ROWS;

    if (isCollindingWithBottom)
      return true;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] > 0) {
          if (
            this.#board.hasSolidIn( {
              y: y + position.y,
              x: x + position.x,
            } )
          )
            return true;
        }
      }
    }

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  #isCollidingWithSideEdges(position: Position, shape: Shape): boolean {
    if (position.x < 0 || position.x + shape[0].length > BOARD_COLS)
      return true;

    return false;
  }

  #isColliding(position: Position, shape: Shape): boolean {
    const currentPiece = this.#currentPiece;

    if (!currentPiece)
      return false;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] > 0) {
          if (
            this.#board.hasSolidIn( {
              y: y + position.y,
              x: x + position.x,
            } ) || this.#isCollidingWithSideEdges(position, shape)
          )
            return true;
        }
      }
    }

    return false;
  }

  tryToRotate() {
    if (!this.#currentPiece)
      return;

    const { shape, position } = this.#currentPiece;
    const newShape = shape[0].map((_, index) => shape.map((row) => row[index]).reverse());

    if (!this.#isColliding(position, newShape))
      this.#currentPiece.shape = newShape;
  }

  tryToMoveDown() {
    if (!this.#currentPiece)
      return;

    const currentPosition = this.#currentPiece.position;
    const nextPosition = {
      x: currentPosition.x,
      y: currentPosition.y + 1,
    };

    if (this.#isCollidingWithBoardOrBottom(nextPosition, this.#currentPiece.shape))
      this.#mergeCurrentPiece();
    else
      this.#currentPiece.position = nextPosition;
  }
}
