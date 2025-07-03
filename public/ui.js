import { setTool } from './canvas.js';

document.getElementById('rainyBtn').addEventListener('click', () => {
  setTheme('rainy.css');
});
document.getElementById('japanBtn').addEventListener('click', () => {
  setTheme('city.css');
});
document.getElementById('classroomBtn').addEventListener('click', () => {
  setTheme('classroom.css');
});


export function setupUI(ctx) {
  document.getElementById('brushBtn').addEventListener('click', () => setTool('brush'));
  document.getElementById('lineBtn').addEventListener('click', () => setTool('line'));
  document.getElementById('dashedBtn').addEventListener('click', () => setTool('dashed'));

  document.getElementById('colorPicker').addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
  });

  document.getElementById('lineWidth').addEventListener('input', (e) => {
    ctx.lineWidth = parseInt(e.target.value);
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    const canvas = document.getElementById('draw');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
  const canvas = document.getElementById('draw');
  const dataUrl = canvas.toDataURL('image/png');

  const img = new Image();
  img.src = dataUrl;
  img.classList.add('gallery-img');

  img.onload = () => {
    const gallery = document.getElementById('gallery');
    gallery.appendChild(img);
  };
});


  document.getElementById('downloadBtn').addEventListener('click', () => {
    const canvas = document.getElementById('draw');
    const link = document.createElement('a');
    link.download = 'my_art.png';
    link.href = canvas.toDataURL();
    link.click();
  });

  document.getElementById('clearGalleryBtn').addEventListener('click', () => {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
  });
}
