let mainImage = document.getElementById("mainImage");
let thumbs = document.getElementById("thumbs");
let playBtn = document.getElementById("play");
let pauseBtn = document.getElementById("pause");

let current = 0;
let timer = null;

thumbs.forEach((thumb, index) => {
  thumb.addEventListener('click', () => {
    mainImage.src = thumb.src;
    current = index;
  });
});

function showNext() {
  current = (current + 1) % thumbs.length;
  mainImage.src = thumbs[current].src;
}

playBtn.addEventListener('click', () => {
  if (!timer) timer = setInterval(showNext, 2000);
});

pauseBtn.addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
});
