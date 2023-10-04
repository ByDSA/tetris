export type Shape = (0 | 1)[][];
const SHAPES = Object.freeze( {
  SQUARE: [
    [1, 1],
    [1, 1],
  ] as Shape,
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ] as Shape,
  Z_INV: [
    [0, 1, 1],
    [1, 1, 0],
  ] as Shape,
  L: [
    [1, 0],
    [1, 0],
    [1, 1],
  ] as Shape,
  L_INV: [
    [0, 1],
    [0, 1],
    [1, 1],
  ] as Shape,
  I: [
    [1],
    [1],
    [1],
  ] as Shape,
  T: [
    [1, 1, 1],
    [0, 1, 0],
  ] as Shape,
} );

export default SHAPES;
