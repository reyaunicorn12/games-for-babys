const titleEl = document.getElementById("message-title");
const textEl = document.getElementById("message-text");
const paintLayer = document.getElementById("paint-layer");
const scoreValueEl = document.getElementById("score-value");
const stageValueEl = document.getElementById("stage-value");
const bitsValueEl = document.getElementById("bits-value");
const storyTitleEl = document.getElementById("story-title");
const storyTextEl = document.getElementById("story-text");
const storyLogEl = document.getElementById("story-log");
const inventoryListEl = document.getElementById("inventory-list");
const starZoneEl = document.getElementById("star-zone");
const starTargetEl = document.getElementById("star-target");
const starStatusEl = document.getElementById("star-status");
const trailStatusEl = document.getElementById("trail-status");
const treasureStatusEl = document.getElementById("treasure-status");
const bossStatusEl = document.getElementById("boss-status");
const bossHealthEl = document.getElementById("boss-health");
const storybookFeedEl = document.getElementById("storybook-feed");
const storyCountEl = document.getElementById("story-count");
const trailButtons = Array.from(document.querySelectorAll(".trail-button"));
const treasureCells = Array.from(document.querySelectorAll(".treasure-cell"));
let audioContext;

const soundPatterns = {
  meow: { type: "triangle", start: 760, end: 950, duration: 0.22, release: 0.18 },
  quack: { type: "sine", start: 620, end: 430, duration: 0.16, release: 0.1 },
  moo: { type: "sawtooth", start: 180, end: 145, duration: 0.3, release: 0.2 },
  oink: { type: "square", start: 240, end: 220, duration: 0.2, release: 0.15 },
  baa: { type: "triangle", start: 400, end: 360, duration: 0.24, release: 0.14 },
  woof: { type: "sine", start: 160, end: 95, duration: 0.18, release: 0.12 }
};

const state = {
  score: 0,
  stage: 0,
  bits: 0,
  inventory: [],
  storyLog: [],
  storyBank: [],
  starGameActive: false,
  starHits: 0,
  trailPattern: [],
  trailPlayer: [],
  trailActive: false,
  starIntervalId: null,
  treasureTarget: null,
  treasureActive: false,
  bossHealth: 0,
  bossActive: false
};

const storyStates = [
  {
    title: "The Moonlight Map",
    text: "The city of Glimmer is waking up, and a tiny comet has dropped a glowing map into your hands. The map hums with possibility, and each choice feels like stepping into a brighter tomorrow.",
    choices: [
      { label: "Follow the sparkling trail", next: 1, reward: "Spark Shard", note: "You followed the glittering path." },
      { label: "Enter the rainbow tunnel", next: 2, reward: "Rainbow Key", note: "You dove into the tunnel of color." },
      { label: "Ask the comet for guidance", next: 3, reward: "Comet Whistle", note: "You asked the comet for help." },
      { label: "Borrow the moon lantern", next: 4, reward: "Moon Lantern", note: "You borrowed the moon's lantern." }
    ]
  },
  {
    title: "Spark Path",
    text: "The trail blooms into a glowing river of stars. A ring of tiny fireflies appears around you, and the air feels full of secrets and possibility.",
    choices: [
      { label: "Collect stardust", next: 5, reward: "Stardust", note: "A pocket of stardust sparkled in your hand." },
      { label: "Open the secret door", next: 6, reward: "Moonstone", note: "You opened a hidden door with a shining glow." },
      { label: "Chat with the fireflies", next: 7, reward: "Glow Dust", note: "The fireflies stitched warm light around your shoes." }
    ]
  },
  {
    title: "Rainbow Tunnel",
    text: "The tunnel sings with every color you touch, and a floating lantern begins to orbit you. Somewhere ahead, a festival of light is waiting to begin.",
    choices: [
      { label: "Chase the lantern", next: 6, reward: "Lantern Glow", note: "The lantern lit your way through the tunnel." },
      { label: "Leap to the next bridge", next: 7, reward: "Sky Ribbon", note: "You bounced across a bright ribbon of light." },
      { label: "Follow the echoing drums", next: 8, reward: "Festival Beat", note: "The drums pulled you deeper into wonder." }
    ]
  },
  {
    title: "Comet's Compass",
    text: "The comet flutters overhead and points you toward a hidden garden where all the lost colors of the city are being kept safe. The path is mysterious and joyful.",
    choices: [
      { label: "Head to the garden", next: 7, reward: "Victory Badge", note: "You reached the garden chamber." },
      { label: "Take a quick detour", next: 8, reward: "Bonus Star", note: "You found an extra star on the way." },
      { label: "Ask the comet for a song", next: 9, reward: "Comet Song", note: "The comet sang you a guiding melody." }
    ]
  },
  {
    title: "Moon Lantern",
    text: "The moon lantern brightens the whole path, and suddenly the city looks less like a place and more like a living storybook. You are becoming part of it.",
    choices: [
      { label: "Read the glowing runes", next: 6, reward: "Rune Scroll", note: "The runes unfolded like tiny stars." },
      { label: "Visit the midnight market", next: 8, reward: "Treasure Coin", note: "You discovered a coin that glittered like a tiny planet." },
      { label: "Wake the sleeping fountain", next: 9, reward: "Fountain Charm", note: "The fountain burst into dancing color." }
    ]
  },
  {
    title: "The Hidden Door",
    text: "Beyond the door lies the echoing hall of echoes, where every sound becomes a colorful memory. The place is full of playful surprises and gentle danger.",
    choices: [
      { label: "Listen to the echoes", next: 8, reward: "Echo Pearl", note: "The echoes hummed like a secret lullaby." },
      { label: "Step through the crystal arch", next: 9, reward: "Crystal Key", note: "The crystal arch opened with a bright sigh." },
      { label: "Challenge the hall", next: 10, reward: "Hero Crown", note: "You answered the hall's challenge with courage." }
    ]
  },
  {
    title: "The Garden of Lost Colors",
    text: "The garden is bursting with painted flowers that bloom in time with your heartbeat. Each petal seems to remember a different piece of the city's magic.",
    choices: [
      { label: "Plant a bright seed", next: 9, reward: "Bright Seed", note: "The seed grew into a shining blossom." },
      { label: "Talk to the flowers", next: 10, reward: "Petal Whisper", note: "The flowers whispered a secret melody." },
      { label: "Follow the humming bees", next: 10, reward: "Bee Charm", note: "The bees escorted you to a golden clearing." }
    ]
  },
  {
    title: "The Festival of Light",
    text: "The festival is beginning. Lanterns rise, music swells, and the streets feel like a dream that learned to dance. You have almost reached the grand finale.",
    choices: [
      { label: "Dance with the lanterns", next: 10, reward: "Festival Ribbon", note: "You danced beneath a shower of light." },
      { label: "Join the parade", next: 10, reward: "Parade Flag", note: "The parade lifted you into the sky for a few happy seconds." },
      { label: "Climb the beacon tower", next: 10, reward: "Beacon Star", note: "You reached the tower and watched the city sparkle." }
    ]
  },
  {
    title: "The Bright Finale",
    text: "The whole playground is glowing with your discoveries. Every button, game, and story beat has become part of your adventure, and the city of Glimmer is shining because of you.",
    choices: []
  },
  {
    title: "The Hero's Crown",
    text: "You have reached the heart of the adventure. This is the final chapter of your colorful quest, where every sparkle you collected becomes part of the celebration.",
    choices: []
  }
];

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    showSurprise(button, event);
  });
});

document.querySelectorAll(".story-choice").forEach((button) => {
  button.addEventListener("click", () => {
    handleStoryChoice(button);
  });
});

document.getElementById("star-start").addEventListener("click", startStarGame);
document.getElementById("trail-start").addEventListener("click", startTrailGame);
document.getElementById("treasure-start").addEventListener("click", startTreasureGame);
document.getElementById("boss-start").addEventListener("click", startBossBattle);
document.getElementById("boss-button").addEventListener("click", hitBoss);
document.getElementById("load-stories").addEventListener("click", loadStoryBank);

trailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleTrailButton(button);
  });
});

treasureCells.forEach((cell) => {
  cell.addEventListener("click", () => {
    handleTreasureCell(cell);
  });
});

updateStats();
renderInventory();
renderStoryLog();
loadStoryBank();
setStoryState(0);

function showSurprise(button, event) {
  titleEl.textContent = button.dataset.title;
  textEl.textContent = button.dataset.message;
  addScore(8);
  addBits(1);
  addStoryEntry(`You pressed ${button.textContent.trim()} and sent out a burst of color.`);
  playAnimalNoise(button.dataset.sound || "meow");

  const burstCount = 6;
  const layerRect = paintLayer.getBoundingClientRect();
  const clickX = event.clientX || window.innerWidth / 2;
  const clickY = event.clientY || window.innerHeight / 2;

  for (let index = 0; index < burstCount; index += 1) {
    const splat = document.createElement("div");
    splat.className = "paint-splat";

    const size = 60 + Math.floor(Math.random() * 50);
    const driftX = (Math.random() - 0.5) * 720;
    const driftY = (Math.random() - 0.5) * 720;

    splat.style.left = `${clickX - layerRect.left - size / 2}px`;
    splat.style.top = `${clickY - layerRect.top - size / 2}px`;
    splat.style.width = `${size}px`;
    splat.style.height = `${size}px`;
    splat.style.background = getButtonColor(button);
    splat.style.setProperty("--drift-x", `${driftX}px`);
    splat.style.setProperty("--drift-y", `${driftY}px`);
    splat.style.setProperty("--rotate", `${Math.random() * 360}deg`);
    paintLayer.appendChild(splat);

    setTimeout(() => {
      splat.remove();
    }, 1400);
  }
}

function handleStoryChoice(button) {
  const next = Number(button.dataset.next);
  const reward = button.dataset.reward;
  const note = button.dataset.note;

  if (reward) {
    addInventory(reward);
  }

  addScore(12);
  addBits(2);
  addStoryEntry(`Choice: ${button.textContent.trim()} — ${note}`);
  setStoryState(next);
}

function setStoryState(nextIndex) {
  state.stage = nextIndex;
  const story = storyStates[nextIndex];
  if (!story) return;

  storyTitleEl.textContent = story.title;
  storyTextEl.textContent = story.text;
  stageValueEl.textContent = String(nextIndex + 1);

  document.querySelectorAll(".story-choice").forEach((choiceButton, index) => {
    const choice = story.choices[index];
    if (choice) {
      choiceButton.style.display = "inline-flex";
      choiceButton.textContent = choice.label;
      choiceButton.dataset.next = String(choice.next);
      choiceButton.dataset.reward = choice.reward;
      choiceButton.dataset.note = choice.note;
    } else {
      choiceButton.style.display = "none";
    }
  });
}

function addScore(amount) {
  state.score += amount;
  updateStats();
}

function addBits(amount) {
  state.bits += amount;
  updateStats();
}

function addInventory(item) {
  if (!state.inventory.includes(item)) {
    state.inventory.push(item);
    renderInventory();
  }
}

function addStoryEntry(entry) {
  state.storyLog.unshift(entry);
  state.storyLog = state.storyLog.slice(0, 6);
  renderStoryLog();
}

function loadStoryBank() {
  const count = 10000;
  const adjectivePool = ["glittering", "merry", "whispering", "fuzzy", "cosmic", "sunlit", "stormy", "sparkly", "moonlit", "jazzy"];
  const placePool = ["the velvet forest", "a floating bakery", "the cloud castle", "the lantern market", "the singing sea", "the mirror meadow", "the comet canyon", "the rainbow library", "the candy comet", "the star harbor"];
  const nounPool = ["princess", "fox", "dragon", "wizard", "pirate", "meteor", "clockmaker", "painter", "gardener", "knight"];
  const actionPool = ["found a secret map", "traded with stars", "outwitted a giggle goblin", "solved a moon riddle", "followed a glowing ribbon", "danced across a bridge", "rescued a sleepy lantern", "opened a pocket of thunder", "borrowed a comet tail", "snuck into a treasure garden"];
  const outcomePool = ["and the night turned bright", "and everyone cheered", "and a tiny kingdom began to sing", "and the horizon blushed purple", "and the stars hummed along", "and the clouds burst into confetti", "and a golden path appeared", "and the air smelled like cinnamon", "and a new song was born", "and the adventure kept growing"];

  state.storyBank = [];
  for (let index = 0; index < count; index += 1) {
    const adjective = adjectivePool[index % adjectivePool.length];
    const place = placePool[(index * 3) % placePool.length];
    const noun = nounPool[(index * 5) % nounPool.length];
    const action = actionPool[(index * 7) % actionPool.length];
    const outcome = outcomePool[(index * 11) % outcomePool.length];
    state.storyBank.push(`#${index + 1}: ${adjective} ${noun} ${action} ${place} ${outcome}.`);
  }

  storyCountEl.textContent = `Story bank ready: ${state.storyBank.length.toLocaleString()} tales`;
  renderStorybookPreview();
}

function renderStorybookPreview() {
  storybookFeedEl.innerHTML = "";
  const previewStories = state.storyBank.slice(0, 120);

  if (!previewStories.length) {
    const placeholder = document.createElement("div");
    placeholder.className = "storybook-card";
    placeholder.innerHTML = "<strong>Loading...</strong> The storybook is waking up.";
    storybookFeedEl.appendChild(placeholder);
    return;
  }

  previewStories.forEach((story) => {
    const card = document.createElement("div");
    card.className = "storybook-card";
    card.innerHTML = `<strong>New tale:</strong> ${story}`;
    storybookFeedEl.appendChild(card);
  });
}

function renderInventory() {
  inventoryListEl.innerHTML = "";
  if (!state.inventory.length) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No treasures yet — keep playing!";
    inventoryListEl.appendChild(emptyItem);
    return;
  }

  state.inventory.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    inventoryListEl.appendChild(listItem);
  });
}

function renderStoryLog() {
  storyLogEl.innerHTML = "";
  if (!state.storyLog.length) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "Your adventure log is empty.";
    storyLogEl.appendChild(emptyItem);
    return;
  }

  state.storyLog.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = entry;
    storyLogEl.appendChild(listItem);
  });
}

function updateStats() {
  scoreValueEl.textContent = String(state.score);
  bitsValueEl.textContent = String(state.bits);
}

function startStarGame() {
  if (state.starGameActive) return;
  state.starGameActive = true;
  state.starHits = 0;
  clearInterval(state.starIntervalId);
  starStatusEl.textContent = "Catch 3 stars!";
  placeStarTarget();
  state.starIntervalId = window.setInterval(() => {
    state.starHits = 0;
    starStatusEl.textContent = "You missed one! Try again.";
    placeStarTarget();
  }, 1000);
}

function placeStarTarget() {
  const zoneRect = starZoneEl.getBoundingClientRect();
  const x = 20 + Math.random() * Math.max(zoneRect.width - 84, 20);
  const y = 20 + Math.random() * Math.max(zoneRect.height - 84, 20);
  starTargetEl.style.left = `${x}px`;
  starTargetEl.style.top = `${y}px`;
}

starTargetEl.addEventListener("click", () => {
  if (!state.starGameActive) return;
  state.starHits += 1;
  addScore(10);
  addBits(1);
  addStoryEntry("You caught a bright star and felt the arena pulse.");
  starStatusEl.textContent = `Caught ${state.starHits}/3 stars`;
  placeStarTarget();

  if (state.starHits >= 3) {
    clearInterval(state.starIntervalId);
    state.starGameActive = false;
    addInventory("Star Badge");
    starStatusEl.textContent = "Perfect catch!";
  }
});

function startTrailGame() {
  state.trailPattern = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
  state.trailPlayer = [];
  state.trailActive = false;
  trailStatusEl.textContent = "Watch the pattern...";
  flashTrailSequence(0);
}

function flashTrailSequence(index) {
  if (index >= state.trailPattern.length) {
    state.trailActive = true;
    trailStatusEl.textContent = "Your turn!";
    return;
  }

  const button = trailButtons[state.trailPattern[index]];
  button.classList.add("active");
  setTimeout(() => {
    button.classList.remove("active");
    setTimeout(() => {
      flashTrailSequence(index + 1);
    }, 220);
  }, 500);
}

function handleTrailButton(button) {
  if (!state.trailActive) return;

  const id = Number(button.dataset.id);
  state.trailPlayer.push(id);
  button.classList.add("active");
  setTimeout(() => button.classList.remove("active"), 220);

  const expected = state.trailPattern[state.trailPlayer.length - 1];
  if (id !== expected) {
    trailStatusEl.textContent = "Oops! Try the pattern again.";
    state.trailActive = false;
    addScore(-6);
    setTimeout(startTrailGame, 900);
    return;
  }

  if (state.trailPlayer.length === state.trailPattern.length) {
    trailStatusEl.textContent = "Perfect glow!";
    state.trailActive = false;
    addScore(20);
    addBits(3);
    addInventory("Glow Glyph");
    addStoryEntry("You replayed the trail and unlocked a glowing glyph.");
    setTimeout(startTrailGame, 1200);
  }
}

function startTreasureGame() {
  state.treasureTarget = Math.floor(Math.random() * treasureCells.length);
  state.treasureActive = true;
  treasureCells.forEach((cell) => {
    cell.classList.remove("found");
    cell.textContent = "?";
  });
  treasureStatusEl.textContent = "A treasure tile is hidden. Pick wisely!";
}

function handleTreasureCell(cell) {
  if (!state.treasureActive) return;
  const index = Number(cell.dataset.index);

  if (index === state.treasureTarget) {
    state.treasureActive = false;
    cell.classList.add("found");
    cell.textContent = "💎";
    addScore(18);
    addBits(2);
    addInventory("Treasure Coin");
    addStoryEntry("You found the hidden treasure and the whole board cheered.");
    treasureStatusEl.textContent = "You found the treasure!";
    return;
  }

  cell.textContent = "✖";
  cell.classList.add("found");
  addScore(2);
  treasureStatusEl.textContent = "Too bad — that was a decoy.";
}

function startBossBattle() {
  state.bossHealth = 5;
  state.bossActive = true;
  bossStatusEl.textContent = "The storm boss is awake!";
  bossHealthEl.style.width = "100%";
}

function hitBoss() {
  if (!state.bossActive) return;
  state.bossHealth -= 1;
  const percent = (state.bossHealth / 5) * 100;
  bossHealthEl.style.width = `${Math.max(percent, 0)}%`;
  addScore(6);
  addBits(1);
  bossStatusEl.textContent = `Boss hit! ${state.bossHealth} hits left.`;

  if (state.bossHealth <= 0) {
    state.bossActive = false;
    addInventory("Storm Crown");
    addStoryEntry("You smashed the storm boss into a shower of confetti.");
    bossStatusEl.textContent = "Boss defeated!";
  }
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

