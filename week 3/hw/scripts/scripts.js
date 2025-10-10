const mainImage = document.getElementById('mainImage');
const thumbs = document.querySelectorAll('.thumbs img');
const navButtons = document.querySelectorAll('.nav-btn');

let current = 0;

function showImage(index) {
  current = index;
  mainImage.src = `pictures/Coalball-ugly-${index + 1}.jpg`;
}

thumbs.forEach((thumb, index) => {
  thumb.addEventListener('click', () => showImage(index));
});

navButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => showImage(index));
});
