const titleEl = document.getElementById("message-title");
const textEl = document.getElementById("message-text");

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", () => {
    titleEl.textContent = button.dataset.title;
    textEl.textContent = button.dataset.message;
  });
});
