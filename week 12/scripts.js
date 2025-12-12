document.addEventListener("DOMContentLoaded", function () {
  const mainImage = document.getElementById("mainImage");
  const mainVideo = document.getElementById("mainVideo");
  const mediaTitle = document.getElementById("mediaTitle");

  const categoryButtons = document.querySelectorAll(".category-btn");
  const categorySections = document.querySelectorAll(".category-section");
  const thumbs = document.querySelectorAll(".thumbs img");

  // 真正切换图片/视频的函数
  function showMedia(type, src, title) {
    if (!src) return;

    if (type === "image") {
      mainVideo.classList.add("hidden");
      mainVideo.pause();

      mainImage.src = src;
      mainImage.classList.remove("hidden");
    } else if (type === "video") {
      mainImage.classList.add("hidden");

      mainVideo.src = src;
      mainVideo.classList.remove("hidden");
    }

    mediaTitle.textContent = title || "Documentation of Multichannel Controller";
  }

  // 从某一个缩略图读出 data-*，然后调用 showMedia
  function showFromThumb(thumb) {
    const type = thumb.dataset.type;                 // image / video
    const src = thumb.dataset.src || thumb.src;      // data-src 或自身 src
    const title = thumb.dataset.title || thumb.alt;  // 标题
    showMedia(type, src, title);
  }

  // 所有缩略图都加点击事件
  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      showFromThumb(thumb);
    });
  });

  // 顶部分类按钮：切换 section，并选中该分类里的第一个缩略图
  categoryButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetSelector = btn.dataset.target;
      const targetSection = document.querySelector(targetSelector);

      // 切按钮样式
      categoryButtons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      // 切 section 显示
      categorySections.forEach(function (sec) {
        if (sec === targetSection) {
          sec.classList.remove("hidden");
        } else {
          sec.classList.add("hidden");
        }
      });

      // 🌟 新增：自动选中这个分类里的第一个缩略图
      const firstThumb = targetSection.querySelector(".thumbs img");
      if (firstThumb) {
        showFromThumb(firstThumb);
      }
    });
  });

  // 页面刚加载时：选中当前 active section 里的第一个缩略图
  const firstActiveSection = document.querySelector(".category-section.active");
  if (firstActiveSection) {
    const firstThumb = firstActiveSection.querySelector(".thumbs img");
    if (firstThumb) {
      showFromThumb(firstThumb);
    }
  }
});
