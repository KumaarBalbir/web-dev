import express from "express";
import bodyParser from "body-parser";
import fs from "fs/promises";
import path from "path";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // to parse the incoming requests with JSON payloads

const jokesFilePath = path.join(__dirname, "jokes.json");

// hold jokes in memory from local file
let jokes = [];

async function loadJokes() {
  try {
    const data = await fs.readFile(jokesFilePath, "utf8");
    jokes = JSON.parse(data);
    console.log("Jokes loaded from file.");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("jokes.json not found. Creating a new empty file.");
      jokes = [];
      await saveJokes();
    } else {
      console.log("Error loading jokes from file:", error);
      jokes = [];
    }
  }
}

async function saveJokes() {
  try {
    await fs.writeFile(jokesFilePath, JSON.stringify(jokes, null, 2), "utf8");
    console.log(`Successfully saved ${jokes.length} jokes to ${jokesFilePath}`);
  } catch (error) {
    console.log(`Error saving jokes to ${jokesFilePath}: `, error);
  }
}

//1. GET a random joke
app.get("/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  res.json(jokes[randomIndex]);
});

//3. GET a jokes by filtering on the joke type
// NOTE: order of endpoints matter. if /filter is after /:id then '/filter' never triggered.
// since filter is assumed as id field after '/' and hence '/:id' is triggered.
app.get("/filter", (req, res) => {
  const type = req.query.type;
  const filteredJokes = jokes.filter((joke) => joke.jokeType === type);
  // const randomIndex = Math.floor(Math.random() * filteredJokes.length);
  // const randomJoke = filteredJokes[randomIndex];
  res.json(filteredJokes);
});

//2. GET a specific joke
app.get("/:id", (req, res) => {
  const result = jokes.find((joke) => joke.id === parseInt(req.params.id));
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

//4. POST a new joke
app.post("/", (req, res) => {
  const newJoke = {
    id: jokes.length + 1,
    jokeText: req.body.jokeText,
    jokeType: req.body.jokeType,
  };
  jokes.push(newJoke);
  res.json(newJoke);
});

//5. PUT a joke
app.put("/:id", (req, res) => {
  const result = jokes.find((joke) => joke.id === parseInt(req.params.id));
  if (result) {
    result.jokeText = req.body.jokeText;
    result.jokeType = req.body.jokeType;
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

//6. PATCH a joke
app.patch("/:id", (req, res) => {
  const result = jokes.find((joke) => joke.id === parseInt(req.params.id));
  if (result) {
    if (req.body.jokeText) {
      result.jokeText = req.body.jokeText;
    }
    if (req.body.jokeType) {
      result.jokeType = req.body.jokeType;
    }
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

//7. DELETE Specific joke

//8. DELETE All jokes

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
