import express from "express";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1; // set it dynamically based on which user is selected
async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  const users = await getUsers();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal",
  });
});
app.post("/add", async (req, res) => {
  // when a country is added
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/user", async (req, res) => {
  // when a user is clicked
  console.log("request to add user");
  console.log("req body", req.body);
  if (req.body.user) {
    // one of the users was clicked
    const userId = req.body.user;
    const users = await getUsers();
    console.log("user id", userId);
    const visitedCountries = await getVisitedByUser(userId);
    console.log("visited countries", visitedCountries);
    const user = users.find((user) => user.id == userId);
    currentUserId = userId;
    res.render("index.ejs", {
      countries: visitedCountries,
      total: visitedCountries.length,
      users: users,
      color: user.color,
    });
  }
  if (req.body.new) {
    // the new user button was clicked
    res.render("new.ejs");
  }
});

app.post("/new", async (req, res) => {
  // when a new user is added
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const userName = req.body["name"];
  const color = req.body["color"];
  let users = await getUsers();

  // check if user already exists
  const existingUser = users.find((user) => user.name === userName);
  if (existingUser) {
    res.redirect("/");
    return;
  }
  try {
    await db.query(
      "INSERT INTO users (user_name, color_choice) VALUES ($1, $2)",
      [userName, color]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding new user");
  }
});

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  let users = [];
  result.rows.forEach((user) => {
    users.push({ id: user.id, name: user.user_name, color: user.color_choice });
  });
  return users;
}

async function getVisitedByUser(userId) {
  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id = $1",
    [userId]
  );
  let countryCodes = [];
  result.rows.forEach((country) => {
    countryCodes.push(country.country_code);
  });
  return countryCodes;
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
