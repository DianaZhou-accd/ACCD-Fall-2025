// 1. 补充获取视频元素（关键：之前漏了）
const mainImage = document.getElementById('mainImage');
const mainVideo = document.getElementById('mainVideo'); // 新增：获取视频DOM
const thumbs = document.querySelectorAll('.thumbs img');
const navButtons = document.querySelectorAll('.nav-btn');
const mediaTitle = document.getElementById('mediaTitle');

// 2. 重构数组：区分图片/视频类型（不是只存路径）
const mediaPaths = [
  { type: 'image', path: "pictures/before-add-3386P.png", title: "Record 1 - before-add-3386P" },          // 图片1
  { type: 'image', path: "pictures/after-add-3386P-1.png", title: "Record 2 - after-add-3386P-1" }, // 图片2
  { type: 'image', path: "pictures/after-add-3386P-2.png", title: "Record 3 - after-add-3386P-2" }, // 图片3
  { type: 'image', path: "pictures/1.jpg", title: "Record 4 - 1.jpg" },  // 图片4
  { type: 'video', path: "videos&thumbs/video1.mp4", title: "Video 1" },       // 视频1（真实视频路径）
  { type: 'video', path: "videos&thumbs/video2.mp4", title: "Video 2" }        // 视频2（真实视频路径）
];

let current = 0;

function showImage(index) {
  // 3. 补充边界判断：防止索引越界
  if (index < 0 || index >= mediaPaths.length) return;
  current = index;

  // 4. 定义media变量（解决核心报错）
  const media = mediaPaths[index];

  mediaTitle.textContent = media.title;

  // 5. 图片/视频切换逻辑
  if (media.type === 'image') {
    // 显示图片，隐藏视频
    mainImage.src = media.path;
    mainImage.style.display = 'block';
    mainVideo.style.display = 'none';
  } else if (media.type === 'video') {
    // 显示视频，隐藏图片
    mainVideo.src = media.path;
    mainVideo.load(); // 重置视频加载
    mainVideo.style.display = 'block';
    mainImage.style.display = 'none';
  }

  // 保留缩略图选中逻辑
  updateThumbActive(index);
}

function updateThumbActive(activeIndex) {
  thumbs.forEach((thumb, index) => {
    thumb.style.borderColor = index === activeIndex ? '#3860cb' : 'transparent';
  });
}

// 绑定缩略图点击
thumbs.forEach((thumb, index) => {
  thumb.addEventListener('click', () => showImage(index));
});

// 绑定按钮点击
navButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => showImage(index));
});

// 初始化选中第一个缩略图
updateThumbActive(0);