export function initCanvas(socket) {
  const canvas = document.getElementById("drawCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let drawing = false;
  let color = document.getElementById("colorPicker").value;
  let strokeWidth = document.getElementById("strokeWidth").value;

  const startDraw = (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  };

  const draw = (e) => {
    if (!drawing) return;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    socket.emit("draw", "default-room", {
      x: e.clientX,
      y: e.clientY,
      color,
      strokeWidth,
    });
  };

  const stopDraw = () => {
    drawing = false;
  };

  socket.on("draw", ({ drawData }) => {
    ctx.lineWidth = drawData.strokeWidth;
    ctx.strokeStyle = drawData.color;
    ctx.lineCap = "round";
    ctx.lineTo(drawData.x, drawData.y);
    ctx.stroke();
  });

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseout", stopDraw);
}
