enum Key {
  ARROW_UP = "ArrowUp",
  ARROW_DOWN = "ArrowDown",
  ARROW_LEFT = "ArrowLeft",
  ARROW_RIGHT = "ArrowRight",
  SPACE = " "
}

type Params = {
  onUp: ()=> void;
  onDown: ()=> void;
  onLeft: ()=> void;
  onRight: ()=> void;
};
// eslint-disable-next-line import/prefer-default-export
export function addKeyListeners( { onDown, onLeft, onRight, onUp }: Params) {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case Key.ARROW_UP:
        onUp();
        break;
      case Key.ARROW_DOWN:
        onDown();
        break;
      case Key.ARROW_LEFT:
        onLeft();
        break;
      case Key.ARROW_RIGHT:
        onRight();
        break;
      default:
    }
  } );
}
