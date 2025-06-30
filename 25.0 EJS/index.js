import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

const date = new Date();
let day = date.getDate();
let weekendMessage = "Hey! It's a weekend! Enjoy your time off!";
let weekdayMessage = "It's a weekday. Keep up the good work!";
let finalMessage;
if (day === 0) {
  finalMessage = weekendMessage;
} else {
  finalMessage = weekdayMessage;
}

let response = {
  message: finalMessage,
};

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs", response);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
