const titleEl = document.getElementById("message-title");
const textEl = document.getElementById("message-text");
const paintLayer = document.getElementById("paint-layer");

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    showSurprise(button, event);
  });
});

function showSurprise(button, event) {
  titleEl.textContent = button.dataset.title;
  textEl.textContent = button.dataset.message;

  const splat = document.createElement("div");
  splat.className = "paint-splat";

  const size = 70 + Math.floor(Math.random() * 45);
  const driftX = (Math.random() - 0.5) * 700;
  const driftY = (Math.random() - 0.5) * 700;
  const layerRect = paintLayer.getBoundingClientRect();
  splat.style.left = `${event.clientX - layerRect.left - size / 2}px`;
  splat.style.top = `${event.clientY - layerRect.top - size / 2}px`;
  splat.style.width = `${size}px`;
  splat.style.height = `${size}px`;
  splat.style.background = getButtonColor(button);
  splat.style.setProperty("--drift-x", `${driftX}px`);
  splat.style.setProperty("--drift-y", `${driftY}px`);
  paintLayer.appendChild(splat);

  setTimeout(() => {
    splat.remove();
  }, 12000);
}

function getButtonColor(button) {
  const className = Array.from(button.classList).find((name) => ["pink", "blue", "yellow", "green", "purple", "orange"].includes(name));

  switch (className) {
    case "pink":
      return "radial-gradient(circle at 30% 30%, #fbcfe8, #f472b6 55%, #ec4899 80%)";
    case "blue":
      return "radial-gradient(circle at 30% 30%, #bfdbfe, #60a5fa 55%, #2563eb 80%)";
    case "yellow":
      return "radial-gradient(circle at 30% 30%, #fde68a, #fbbf24 55%, #f59e0b 80%)";
    case "green":
      return "radial-gradient(circle at 30% 30%, #bbf7d0, #34d399 55%, #10b981 80%)";
    case "purple":
      return "radial-gradient(circle at 30% 30%, #e9d5ff, #a78bfa 55%, #8b5cf6 80%)";
    default:
      return "radial-gradient(circle at 30% 30%, #fed7aa, #fb923c 55%, #f97316 80%)";
  }
}

