import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  let responseMessage = `<h1> Your band name is: </h1>\n<h3>${req.body.street}${req.body.pet}🤘</h3>`;
  res.send(responseMessage);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
