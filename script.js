const titleEl = document.getElementById("message-title");
const textEl = document.getElementById("message-text");
const paintLayer = document.getElementById("paint-layer");

let audioContext;
let masterGain;
let melodyTimer;

function ensureAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.05;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(frequency, duration, volume = 0.06) {
  if (!audioContext || !masterGain) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(masterGain);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration + 0.02);
}

function startBackgroundMusic() {
  ensureAudioContext();

  if (melodyTimer) {
    clearInterval(melodyTimer);
  }

  const melody = [392, 392, 440, 392, 523, 493, 392, 392, 440, 392, 466, 440];
  const durations = [0.2, 0.2, 0.2, 0.2, 0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.2];

  let step = 0;
  const playStep = () => {
    const index = step % melody.length;
    playTone(melody[index], durations[index]);
    step += 1;
  };

  playStep();
  melodyTimer = setInterval(playStep, 220);
}

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    startBackgroundMusic();
    showSurprise(button, event);
  });
});

window.addEventListener("pointerdown", startBackgroundMusic, { once: true });

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

