import express from "express";
import fs from "fs/promises";
import path from "path";
import url from "url";

const app = express();
const port = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // to parse the incoming requests with JSON payloads

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
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
app.post("/jokes", async (req, res) => {
  const newJoke = {
    id: jokes.length > 0 ? Math.max(...jokes.map((joke) => joke.id)) + 1 : 1,
    jokeText: req.body.jokeText,
    jokeType: req.body.jokeType,
  };
  jokes.push(newJoke);
  await saveJokes();
  res.status(201).json(newJoke);
});

//5. PUT a joke
app.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { jokeText, jokeType } = req.body;
  if (!jokeText && !jokeType) {
    return res
      .status(400)
      .json({ error: "Atleast jokeText or jokeType is required" });
  }
  const index = jokes.findIndex((joke) => joke.id === id);
  if (index !== -1) {
    if (jokeText) {
      jokes[index].jokeText = jokeText;
    }
    if (jokeType) {
      jokes[index].jokeType = jokeType;
    }
    await saveJokes();
    res.json(jokes[index]);
  } else {
    res.sendStatus(404).json({ error: `Joke with id: ${id} not found.` });
  }
});

//6. PATCH a joke
app.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { jokeText, jokeType } = req.body;
  if (!jokeText && !jokeType) {
    return res
      .status(400)
      .json({ error: "Atleast jokeText or jokeType is required" });
  }
  const index = jokes.findIndex((joke) => joke.id === id);
  if (index !== -1) {
    if (jokeText) {
      jokes[index].jokeText = jokeText;
    }
    if (jokeType) {
      jokes[index].jokeType = jokeType;
    }
    await saveJokes();
    res.json(jokes[index]);
  } else {
    res.sendStatus(404).json({ error: `Joke with id: ${id} not found.` });
  }
});

//7. DELETE Specific joke
app.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const index = jokes.findIndex((joke) => joke.id === id);
  if (index !== -1) {
    jokes.splice(index, 1);
    await saveJokes();
    res.sendStatus(200);
  } else {
    res
      .status(404)
      .json({ error: `Joke with id: ${id} not found. No jokes were deleted.` });
  }
});

//8. DELETE All jokes
app.delete("/", async (req, res) => {
  jokes = [];
  await saveJokes();
  res.sendStatus(200);
});

loadJokes()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(
      "Failed to start server due to initial data load error: ",
      error
    );
    process.exit(1);
  });
