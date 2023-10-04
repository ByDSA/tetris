import { Position } from "./GameGlobals";
import { Shape } from "./Shapes";

type Params = {
  position: Position;
  color: string;
  shape: Shape;
};
export default class Piece {
  position: Position;

  color: string;

  shape: Shape;

  constructor( { color, position, shape }: Params) {
    this.color = color;
    this.position = position;
    this.shape = shape;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          ctx.fillRect(
            this.position.x + x,
            this.position.y + y,
            1,
            1,
          );
        }
      } );
    } );
  }
}
