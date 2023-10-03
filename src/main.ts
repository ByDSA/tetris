import Game from "./Game";
import "./style.css";

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("canvas") as HTMLCanvasElement;
const game = new Game( {
  canvas,
} );
const startButton = document.querySelector<HTMLButtonElement>("#start");

if (!startButton)
  throw new Error("No start button found!");

startButton.addEventListener("click", () => {
  game.init();
} );
