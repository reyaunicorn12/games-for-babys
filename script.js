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
const storyModalEl = document.getElementById("story-modal");
const storyModalTitleEl = document.getElementById("story-modal-title");
const storyModalBodyEl = document.getElementById("story-modal-body");
const closeStoryModalButton = document.getElementById("close-story-modal");
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
closeStoryModalButton.addEventListener("click", closeStoryModal);
storyModalEl.addEventListener("click", (event) => {
  if (event.target === storyModalEl) {
    closeStoryModal();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeStoryModal();
  }
});

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
  const adjectivePool = ["glittering", "elegant", "shadowed", "velvet", "silver", "crimson", "faded", "gilded", "midnight", "polished"];
  const placePool = ["the moonlit manor", "the royal gallery", "the velvet opera house", "the marble conservatory", "the winter ballroom", "the old clock tower", "the diamond vault", "the seaside estate", "the private auction house", "the grand museum"];
  const nounPool = ["detective", "investigator", "curator", "butler", "housekeeper", "journalist", "guard", "secretary", "footman", "cousin"];
  const actionPool = ["discovered the theft", "tracked the missing jewel", "followed the false alibi", "questioned the guests", "followed the hidden trail", "studied the evidence", "interviewed the staff", "examined the crime scene", "crossed the locked hall", "uncovered the motive"];
  const setupPool = ["At the first light of morning", "In the hush before the guests arrived", "During the charity gala", "Just after the lights were dimmed", "At the height of the evening reception", "Before the orchestra began to play", "After the last carriage had rolled away", "When the house was at its quietest", "Right after the jewel case was opened", "As the clock struck midnight"];
  const mysterySubjectPool = ["the stolen diamond", "the missing ruby necklace", "the vanished sapphire brooch", "the stolen pearl bracelet", "the missing emerald ring", "the snatched gold watch", "the stolen moonstone pendant", "the missing velvet jewel case", "the vanished diamond tiara", "the stolen royal sapphire"];
  const cluePool = ["a trail of muddy footprints led from the ballroom to the conservatory", "the only fingerprints were smudged with powder and perfume", "a broken glass shard glittered beneath the chandelier", "a torn velvet ribbon was caught on the garden gate", "a single candle had burned down to the wax in a strange pattern", "the key clue was a tiny diamond chip found in the carpet", "a silver letter opener was missing from the study", "the suspect had left a faint scent of lavender and smoke", "the culprit had used a silk glove to avoid leaving a clear print", "the answer seemed hidden in the timing of the clock strikes"];
  const suspectPool = ["a jealous cousin with a sharp tongue", "a disgraced jewel keeper with a nervous smile", "a famous actress who had been seen leaving the gallery", "a royal butler who knew every hallway by heart", "a charming magician with a pocket full of tricks", "a handsome thief with a polished accent", "a housemaid who knew the manor's secrets", "a rival collector with a grudge", "a tailor who mended the victim's gowns", "a footman who had access to the locked study"];
  const solutionPool = ["the jealous cousin had stolen the diamond to force a family scandal", "the jewel keeper had hidden the ruby necklace in the conservatory wall", "the actress had taken the sapphire brooch to sell it to a private buyer", "the butler had removed the pearl bracelet to protect the family from ruin", "the magician had borrowed the emerald ring for a trick and never returned it", "the thief had hidden the gold watch in the clock tower and planned to collect it that night", "the tailor had tucked the moonstone pendant inside a lining for later sale", "the rival collector had switched the jewel case to frame the staff", "the footman had taken the diamond tiara because he believed it belonged to his late mother", "the housemaid had stolen the royal sapphire to pay off a gambling debt"];
  const scenePool = ["the chandelier trembled", "the conservatory door stood open", "the clock on the mantel had stopped", "the garden gate was still swinging", "the rug had been rolled back", "the servant bell had been rung twice", "the portrait frame was crooked", "the candle wax had dripped onto the floor", "the ash tray held a single cigar stub", "the jewel case had been opened with a silver key"];
  const redHerringPool = ["a nervous singer claimed the thief was a phantom", "a valet swore the culprit wore no shoes", "a maid insisted the culprit had left through the chapel", "a violinist argued the evidence was planted", "a guest spoke of a masked stranger in green", "a coachman said the thief had ridden away on a black horse", "a chef pointed to a soup stain as proof", "a painter insisted the crime was an act of revenge", "a child claimed they saw a ghost in the corridor", "an accountant suspected sabotage by the bank"];
  const revealPool = ["the missing jewel had been hidden in a false panel", "the culprit had used a family heirloom to disguise the theft", "the real motive was ambition, not greed", "the lock had been picked with a hairpin and patience", "the suspect's glove had caught on the gate", "the truth was revealed by a clock chime and a stain of blue wax", "the jewel had been moved to a sealed music box", "the staff's alibis fell apart once one detail was checked", "the stolen piece had been taken to a waiting carriage", "the culprit had left the answer in a letter tucked inside a book"];

  state.storyBank = [];
  const seenStories = new Set();

  for (let index = 0; state.storyBank.length < count && index < count * 4; index += 1) {
    const seed = index * 37 + 11;
    const adjective = adjectivePool[seed % adjectivePool.length];
    const place = placePool[(seed * 3) % placePool.length];
    const noun = nounPool[(seed * 5) % nounPool.length];
    const action = actionPool[(seed * 7) % actionPool.length];
    const setup = setupPool[(seed * 13) % setupPool.length];
    const mysterySubject = mysterySubjectPool[(seed * 7) % mysterySubjectPool.length];
    const clue = cluePool[(seed * 3) % cluePool.length];
    const clueTwo = cluePool[(seed * 5) % cluePool.length];
    const suspect = suspectPool[(seed * 9) % suspectPool.length];
    const solution = solutionPool[(seed * 13) % solutionPool.length];
    const scene = scenePool[(seed * 17) % scenePool.length];
    const redHerring = redHerringPool[(seed * 19) % redHerringPool.length];
    const reveal = revealPool[(seed * 23) % revealPool.length];
    const title = `The Case of ${mysterySubject.replace(/^the (?:stolen|missing|vanished|snatched) /, "")}`;
    const storySignature = `${title}|${mysterySubject}|${clue}|${clueTwo}|${suspect}|${solution}|${scene}`;

    if (seenStories.has(storySignature)) {
      continue;
    }
    seenStories.add(storySignature);

    const paragraphs = [];
    paragraphs.push(`${setup}, a ${adjective} ${noun} ${action} ${place}.`);
    paragraphs.push(`The evening took a darker turn when ${mysterySubject} vanished from its locked case and the house fell silent.`);
    paragraphs.push(`The first clue was ${clue}.`);
    paragraphs.push(`The second clue was ${clueTwo}, and suddenly the ${noun} realized this was no ordinary theft but a carefully staged crime.`);

    const paragraphTemplates = [
      ({ noun, place, scene }) => `The ${noun} examined ${place} with a steady hand, noticing that ${scene}.`,
      ({ noun, clue }) => `Every glance returned to ${clue}, until even the smallest detail seemed suspicious.`,
      ({ noun, suspect }) => `A whisper reached the ${noun} that ${suspect} had been seen near the locked door.`,
      ({ noun, redHerring }) => `The trail was crowded with nonsense, including ${redHerring}.`,
      ({ noun, place }) => `The ${noun} crossed the corridors of ${place} and found a second set of footprints that did not match the first.`,
      ({ noun, reveal }) => `The turning point came when the ${noun} understood that ${reveal}.`,
      ({ noun, suspect }) => `The ${noun} began to see that ${suspect} had the best access and the weakest alibi.`,
      ({ noun, place }) => `At the edge of ${place}, the ${noun} noticed a final detail that had been overlooked by every other witness.`,
      ({ noun }) => `The ${noun} kept calm, because the best cases are rarely solved by panic.`,
      ({ noun }) => `The case grew more intricate with each step, but the ${noun} welcomed the challenge.`,
      ({ noun, clueTwo }) => `The evidence pointed toward ${clueTwo}, which felt too neat to be accidental.`,
      ({ noun }) => `The ${noun} learned that a jewel thief usually leaves behind a motive as well as a method.`,
      ({ noun }) => `A single unguarded key and a quiet room were enough to change the whole direction of the inquiry.`,
      ({ noun }) => `The ${noun} returned to the beginning of the mystery, where the obvious answer had been hiding in plain sight.`,
      ({ noun }) => `The matter was no longer a simple theft; it had become a question of pride, jealousy, and timing.`,
      ({ noun }) => `The ${noun} noticed that the culprit had been clever enough to leave a clue in a place meant to be overlooked.`,
      ({ noun }) => `The case sharpened when the ${noun} realized that a false confession could be more useful than a true one.`,
      ({ noun }) => `The ${noun} made one more pass through the scene and discovered the trace that had been missing all evening.`,
      ({ noun }) => `The house seemed to breathe again once the ${noun} had a clear theory in mind.`,
      ({ noun }) => `The final question was not who had the chance, but who had the nerve.`,
      ({ noun }) => `The ${noun} found the answer by comparing the smallest details rather than the loudest stories.`,
      ({ noun }) => `Every whisper in the house seemed to point toward the same hidden truth.`,
      ({ noun }) => `The ${noun} understood that the theft had been arranged to look accidental, and that was the trick.`,
      ({ noun }) => `The room was quiet, but the ${noun} could feel the tension rising with every passing minute.`,
      ({ noun }) => `The evidence was scattered, yet the pattern in it felt deliberate from the start.`,
      ({ noun }) => `The ${noun} knew the culprit would have made at least one mistake, and that mistake was waiting.`,
      ({ noun }) => `The case seemed ordinary at first, until the ${noun} noticed how carefully every detail had been staged.`,
      ({ noun }) => `The puzzle was less about the jewel itself and more about the person who wanted it hidden.`,
      ({ noun }) => `The ${noun} looked at the victim's account and found a contradiction small enough to be ignored.`,
      ({ noun }) => `A single thread of silk was enough to turn the evening from a rumor into a theory.`,
      ({ noun }) => `The ${noun} followed the trail to a locked drawer and a final letter that changed everything.`,
      ({ noun }) => `The case had become personal by the time the ${noun} recognized the motive behind the theft.`,
      ({ noun }) => `Even the servants seemed to hold their breath when the ${noun} reached the truth.`,
      ({ noun }) => `The final clue did not shout; it simply waited to be noticed.`,
      ({ noun }) => `The ${noun} traced the movement of the jewel through the house and ended at the one place no one had checked.`
    ];

    for (let paragraphIndex = 4; paragraphIndex < 60; paragraphIndex += 1) {
      const template = paragraphTemplates[(seed + paragraphIndex * 7) % paragraphTemplates.length];
      paragraphs.push(template({ noun, place, suspect, clue, clueTwo, redHerring, reveal, scene }));
    }

    paragraphs.push(`The final answer was ${solution}, and the ${noun} realized the truth had been hiding in plain sight all along.`);
    state.storyBank.push({ title, paragraphs });
  }

  storyCountEl.textContent = `Story bank ready: ${state.storyBank.length.toLocaleString()} tales`;
  renderStorybookPreview();
}

function renderStorybookPreview() {
  storybookFeedEl.innerHTML = "";
  const previewStories = state.storyBank.slice(0, 80);

  if (!previewStories.length) {
    const placeholder = document.createElement("button");
    placeholder.type = "button";
    placeholder.className = "storybook-card";
    placeholder.innerHTML = "<strong>Loading...</strong><span>The storybook is waking up.</span>";
    storybookFeedEl.appendChild(placeholder);
    return;
  }

  previewStories.forEach((story) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "storybook-card";
    card.innerHTML = `<strong>${story.title}</strong><span>${story.paragraphs[0]}</span>`;
    card.addEventListener("click", () => openStoryModal(story));
    storybookFeedEl.appendChild(card);
  });
}

function openStoryModal(story) {
  storyModalTitleEl.textContent = story.title;
  storyModalBodyEl.innerHTML = "";
  story.paragraphs.forEach((paragraph) => {
    const paragraphEl = document.createElement("p");
    paragraphEl.textContent = paragraph;
    storyModalBodyEl.appendChild(paragraphEl);
  });
  storyModalEl.hidden = false;
  document.body.classList.add("modal-open");
}

function closeStoryModal() {
  storyModalEl.hidden = true;
  document.body.classList.remove("modal-open");
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

