const img = document.getElementById('certificate-img');
const container = document.getElementById('viewer-container');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const resetBtn = document.getElementById('reset');
const zoomLevelText = document.getElementById('zoom-level');

let scale = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

const updateTransform = () => {
  img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  zoomLevelText.innerText = `${Math.round(scale * 100)}%`;
};

// Zoom logic
const zoom = (delta) => {
  const newScale = scale + delta;
  if (newScale >= 0.1 && newScale <= 5) {
    scale = newScale;
    updateTransform();
  }
};

zoomInBtn.addEventListener('click', () => zoom(0.2));
zoomOutBtn.addEventListener('click', () => zoom(-0.2));
resetBtn.addEventListener('click', () => {
  scale = 1;
  translateX = 0;
  translateY = 0;
  updateTransform();
});

// Wheel zoom
container.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  zoom(delta);
}, { passive: false });

// Pan logic
container.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  updateTransform();
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Touch support for mobile
container.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX - translateX;
    startY = e.touches[0].clientY - translateY;
  }
});

container.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  translateX = e.touches[0].clientX - startX;
  translateY = e.touches[0].clientY - startY;
  updateTransform();
});

container.addEventListener('touchend', () => {
  isDragging = false;
});

// Initial fit-to-screen logic
const fitToScreen = () => {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  if (!imgWidth || !imgHeight) return;

  const widthRatio = (containerWidth * 0.95) / imgWidth;
  const heightRatio = (containerHeight * 0.95) / imgHeight;
  
  scale = Math.min(widthRatio, heightRatio, 1);
  translateX = 0;
  translateY = 0;
  updateTransform();
};

if (img.complete) {
  fitToScreen();
} else {
  img.onload = fitToScreen;
}

window.addEventListener('resize', fitToScreen);
