import Game from "./Game";
import "./style.css";

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("canvas") as HTMLCanvasElement;

// eslint-disable-next-line no-new
new Game( {
  canvas,
} );
