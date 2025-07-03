import { setupCanvas, getCanvasContext } from './canvas.js';
import { setupUI } from './ui.js';
import { applyTheme } from './themes.js';

setupCanvas();
setupUI(getCanvasContext());

document.getElementById('rainyBtn').onclick = () => applyTheme('rainy.css');
document.getElementById('japanBtn').onclick = () => applyTheme('japan.css');
document.getElementById('classroomBtn').onclick = () => applyTheme('classroom.css');

export function setTheme(themeFile) {
  const themeLink = document.getElementById('themeLink');
  themeLink.href = `styles/${themeFile}`;
}

document.getElementById('rainyBtn').addEventListener('click', () => {
  setTheme('rainy.css');
});
document.getElementById('japanBtn').addEventListener('click', () => {
  setTheme('japan.css');
});
document.getElementById('classroomBtn').addEventListener('click', () => {
  setTheme('classroom.css');
});

// ==================== Backend integration starts here ====================

// Save drawing function
async function saveDrawing() {
  const canvas = document.getElementById('draw');
  const imageData = canvas.toDataURL('image/png');
  const title = prompt("Enter a title for your artwork:") || "Untitled";

  const res = await fetch('/api/save-drawing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageData, title }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Drawing saved!");
    fetchGallery(); // Refresh gallery after save
  } else {
    alert(data.message || "Failed to save");
  }
}

// Fetch gallery function
async function fetchGallery() {
  const res = await fetch('/api/gallery');
  if (!res.ok) {
    console.log("Not logged in or error fetching gallery");
    return;
  }

  const drawings = await res.json();
  const galleryDiv = document.getElementById('gallery');
  galleryDiv.innerHTML = "";

  drawings.forEach(d => {
    const img = document.createElement('img');
    img.src = `/saved-images/${d.file}`;
    img.alt = d.title;
    img.style.width = "120px";
    img.style.margin = "5px";
    galleryDiv.appendChild(img);
  });
}

// Connect save button
document.getElementById('saveBtn').addEventListener('click', saveDrawing);

// Optionally fetch gallery on page load if logged in
fetchGallery();
