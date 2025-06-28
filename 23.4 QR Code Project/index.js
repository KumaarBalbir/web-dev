/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import { input } from "@inquirer/prompts";
import qr from "qr-image";
import fs from "fs";
const userURL = await input({ message: "Enter your URL:" });
console.log(`User URL: ${userURL}`);

const qrImage = qr.image(userURL, { type: "png" });
qrImage.pipe(fs.createWriteStream("qr.png"));
console.log("QR code image created: qr.png");

fs.writeFileSync("userInput.txt", userURL, (err) => {
  if (err) {
    console.error("Error writing to file:", err);
  } else {
    console.log("User input saved to userInput.txt");
  }
});
