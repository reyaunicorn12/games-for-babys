const titleEl = document.getElementById("message-title");
const textEl = document.getElementById("message-text");
const burstEl = document.getElementById("surprise-burst");

function showSurprise(button) {
  titleEl.textContent = button.dataset.title;
  textEl.textContent = button.dataset.message;

  burstEl.style.opacity = "1";
  burstEl.style.animation = "none";
  burstEl.offsetHeight;
  burstEl.style.animation = "burst 0.8s ease-out forwards";

  setTimeout(() => {
    burstEl.style.opacity = "0";
  }, 750);
}

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", () => showSurprise(button));
});
