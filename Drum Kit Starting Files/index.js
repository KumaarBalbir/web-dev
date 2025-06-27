let drumsCount = document.querySelectorAll(".drum").length;
for (let i = 0; i < drumsCount; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
    let drumSound = new Audio(`sounds/${this.innerHTML}.mp3`);
    drumSound.play();
  });
}

for (let i = 0; i < drumsCount; i++) {
  document
    .querySelectorAll(".drum")
    [i].addEventListener("keydown", function (event) {
      playSound(event.key);
    });
}
function playSound(key) {
  if (
    key === "w" ||
    key === "a" ||
    key === "s" ||
    key === "d" ||
    key === "j" ||
    key === "k" ||
    key === "l"
  ) {
    let drumSound = new Audio(`sounds/${key}.mp3`);
    drumSound.play();
  } else {
    alert("Please press a valid key: w, a, s, d, j, k, or l");
  }
}
