const titleEl = document.getElementById("message-title");
const textEl = document.getElementById("message-text");
const paintLayer = document.getElementById("paint-layer");
let audioContext;

const soundPatterns = {
  meow: { type: "triangle", start: 760, end: 950, duration: 0.22, release: 0.18 },
  quack: { type: "sine", start: 620, end: 430, duration: 0.16, release: 0.1 },
  moo: { type: "sawtooth", start: 180, end: 145, duration: 0.3, release: 0.2 },
  oink: { type: "square", start: 240, end: 220, duration: 0.2, release: 0.15 },
  baa: { type: "triangle", start: 400, end: 360, duration: 0.24, release: 0.14 },
  woof: { type: "sine", start: 160, end: 95, duration: 0.18, release: 0.12 }
};

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    showSurprise(button, event);
  });
});

function showSurprise(button, event) {
  titleEl.textContent = button.dataset.title;
  textEl.textContent = button.dataset.message;
  playAnimalNoise(button.dataset.sound || "meow");

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

function playAnimalNoise(soundName) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const pattern = soundPatterns[soundName] || soundPatterns.meow;
  const now = audioContext.currentTime;
  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + pattern.duration + pattern.release);
  masterGain.connect(audioContext.destination);

  const oscillator = audioContext.createOscillator();
  oscillator.type = pattern.type;
  oscillator.frequency.setValueAtTime(pattern.start, now);
  oscillator.frequency.exponentialRampToValueAtTime(pattern.end, now + pattern.duration);
  oscillator.connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + pattern.duration + pattern.release);
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

