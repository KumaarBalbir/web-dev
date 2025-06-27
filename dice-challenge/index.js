// random number between 1 and 6 (both inclusive)
let randomNumber1 = Math.floor(Math.random() * 6) + 1;
let randomNumber2 = Math.floor(Math.random() * 6) + 1;

// change src of img1 based on randomNumber1
let src1;
switch (randomNumber1) {
  case 1:
    src1 = "images/dice1.png";
    break;
  case 2:
    src1 = "images/dice2.png";
    break;
  case 3:
    src1 = "images/dice3.png";
    break;
  case 4:
    src1 = "images/dice4.png";
    break;
  case 5:
    src1 = "images/dice5.png";
    break;
  case 6:
    src1 = "images/dice6.png";
    break;
  default:
    console.log("Invalid number: " + randomNumber1);
}

let src2;
switch (randomNumber2) {
  case 1:
    src2 = "images/dice1.png";
    break;
  case 2:
    src2 = "images/dice2.png";
    break;
  case 3:
    src2 = "images/dice3.png";
    break;
  case 4:
    src2 = "images/dice4.png";
    break;
  case 5:
    src2 = "images/dice5.png";
    break;
  case 6:
    src2 = "images/dice6.png";
    break;
  default:
    console.log("Invalid number: " + randomNumber2);
}

// change src of img1 and img2
document.querySelector(".img1").setAttribute("src", src1);
document.querySelector(".img2").setAttribute("src", src2);
