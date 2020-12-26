const container = document.querySelector('.container');
const fullscreen = document.getElementById('fullscreen');
const play = document.getElementById('play');
const tutorial = document.getElementById('tutorial');

fullscreen.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    container.requestFullscreen();
  }
});

play.addEventListener('click', () => {
  document.location.href = './src/play.html';
});

tutorial.addEventListener('click', () => {
  document.location.href = './src/tutorial.html';
});
