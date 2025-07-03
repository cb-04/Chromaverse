let ctx;
let drawing = false;
let startX, startY;
let currentTool = 'brush';

export function setupCanvas() {
  const canvas = document.getElementById('draw');
  ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000000';

  canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    if (currentTool === 'brush') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    if (currentTool === 'brush') {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (!drawing) return;
    drawing = false;
    if (currentTool === 'line' || currentTool === 'dashed') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
  });
}

export function getCanvasContext() {
  return ctx;
}

export function setTool(tool) {
  currentTool = tool;
  if (tool === 'dashed') {
    ctx.setLineDash([10, 10]);
  } else {
    ctx.setLineDash([]);
  }
}
