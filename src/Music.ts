let audio: HTMLAudioElement | undefined;

export function startMusic() {
  audio ??= new Audio("Tetris.mp3");

  audio.volume = 0.4;
  audio.play();
  audio.currentTime = 0;
  audio.loop = true;
}

export function stopMusic() {
  audio?.pause();
  audio?.remove();
  audio = undefined;
}
