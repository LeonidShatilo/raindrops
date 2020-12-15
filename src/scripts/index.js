const fullscreen = document.getElementById('fullscreen'),
      container = document.querySelector('.container');

fullscreen.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    container.requestFullscreen();
  }
});