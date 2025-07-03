export function saveImage() {
  const canvas = document.getElementById('draw');
  const dataURL = canvas.toDataURL('image/png');

  const img = document.createElement('img');
  img.src = dataURL;
  document.getElementById('gallery').appendChild(img);

  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageData: dataURL })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log("✅ Image saved on server at:", data.path);
      } else {
        console.error("❌ Failed to save on server.");
      }
    })
    .catch(err => console.error("❌ Server error:", err));
}

export function downloadImage() {
  const canvas = document.getElementById('draw');
  const dataURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'forest_drawing.png';
  a.click();
}

export function clearGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
}
