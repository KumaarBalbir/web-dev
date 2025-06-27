let drumsCount = document.querySelectorAll(".drum").length;
for (let i = 0; i < drumsCount; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
    playSoundAndAnimation(this.innerHTML);
  });
}

for (let i = 0; i < drumsCount; i++) {
  document
    .querySelectorAll(".drum")
    [i].addEventListener("keydown", function (event) {
      playSoundAndAnimation(event.key);
    });
}
function playSoundAndAnimation(key) {
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
    let activeButton = document.querySelector(`.${key}`);
    activeButton.classList.add("pressed");
    setTimeout(function () {
      activeButton.classList.remove("pressed");
    }, 100);
  } else {
    alert("Please press a valid key: w, a, s, d, j, k, or l");
  }
}
