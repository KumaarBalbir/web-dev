import express from "express";
import bodyParser from "body-parser";
import url from "url";
import path from "path";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
const data = { message: `Enter your name below 👇` };

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs", data);
});

app.post("/submit", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const response = getResponse(firstName, lastName);
  res.render(__dirname + "/views/index.ejs", response);
});

app.get("/about", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function getNameLength(firstName, lastName) {
  // trim whitespace from start and end of string
  firstName = firstName.trim();
  lastName = lastName.trim();
  return firstName.length + lastName.length;
}

function getResponse(firstName, lastName) {
  const nameLength = getNameLength(firstName, lastName);
  const response = `Hello ${firstName} ${lastName}, your name has ${nameLength} characters.`;
  data.message = response;
  return data;
}
