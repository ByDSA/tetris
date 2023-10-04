# Descripción

Proyecto básico de tetris para TypeScript en frontend con un canvas.

Prueba online: https://tetris.danisales.es/

# Partes
Para matrices de posición, el primer índice es la fila y el segundo la columna.

## Entidades: board, piece y shape
**Variables globales**:
- `BLOCK_SIZE`: tamaño de los bloques en píxeles.
- `BOARD_COLS`: ancho del tablero en bloques.
- `BOARD_ROWS`: alto del tablero en bloques.

**Board**: compuesto por una matriz de valores 0-1 (0: vacío, 1: ocupado) de tamaño `BOARD_ROWS`x`BOARD_COLS`.

**Shape**: matriz de valores 0-1 (0: vacío, 1: ocupado) de tamaño libre para representar la pieza descendente.

**Piece**: es la pieza descendente. Contiene una posición (x, y) y una shape.

## Game loop
Funciones `update` y `draw`.

`update` llama al final a `draw`. `requestAnimationFrame(update)` al final de la función update para que se vuelva a llamar cada frame al game loop.

## Control del usuario
Con `document.addEventListener("keydown", (e) => {})` se capturan las teclas pulsadas por el usuario.

Se usan las teclas izquierda-derecha para mover horizontalmente la pieza, la tecla de arriba para rotar la pieza y la tecla de abajo para acelerar la caída de la pieza.

## Diferentes piezas
Diferentes piezas (sin rotar):

SQUARE:
```
[
  [1, 1],
  [1, 1],
]
```
Z:
```
[
  [1, 1, 0],
  [0, 1, 1],
]
```
Z_INV:
```
[
  [0, 1, 1],
  [1, 1, 0],
]
```
L:
```
[
  [1, 0],
  [1, 0],
  [1, 1],
]
```
L_INV:
```
[
  [0, 1],
  [0, 1],
  [1, 1],
]
```
I:
```
[
  [1],
  [1],
  [1],
]
```
T:
```
[
  [1, 1, 1],
  [0, 1, 0],
]
```

## Rotación piezas
Se trata de hacer una transposición de la matriz de la forma para la pieza:
```js
const newShape = shape[0]
.map(
  (_, index) => shape.map(
    (row) => row[index]
  ).reverse()
);
```
## Colisiones (margen y board)
Para comprobar si colisiona con los márgenes laterales, simplemente se comprueba que la posición que a la que se quiere cambiar la pieza no se salga del board (teniendo en cuenta la posición y el shape).

Antes de mover la pieza hay que comprobar que no se salga del board ni atraviese otras piezas ya colocadas en el board:
- Para movimientos laterales: no se permitirá el movimiento si existe una colisión con los límites el board o con cualquiera de las piezas ya colocadas.
- Para el movimiento de bajada: si colisiona tanto con el borde inferior del board como con cualquier pieza ya colocada en el board, se fijará al board y se creará una nueva pieza.

## Auto drop: caída de las piezas
Dentro de la función de `update`, se puede hacer que se sume un contador de frames y que cuando llegue a un valor X, se mueva la pieza hacia abajo y se resetee el contador.

También se puede utilizar el operador módulo para que se mueva la pieza cada X frames.

Se puede cambiar dinámicamente este valor X para aumentar la velocidad del auto drop.