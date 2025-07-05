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
await db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.
  let visited_countries = [];
  try {
    const result = await db.query("SELECT * FROM visited_countries");
    visited_countries = result.rows.map((row) => row.country_code);
    // console.log("Fetched visited countries from database: ", visited_countries);
  } catch (error) {
    console.error("Error executing queries: ", error.stack);
  }

  res.render("index.ejs", {
    countries: visited_countries,
    total: visited_countries.length,
  });
});

app.post("/add", async (req, res) => {
  console.log("recieved request", req.body);
  let country_name = req.body.country;
  country_name = country_name.trim().toLowerCase();

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) = $1",
      [country_name]
    );
    const country_code = result.rows[0]?.country_code;
    if (!country_code) {
      console.error("Country not found in database: ", country_name);
      return res.status(404).send("Country not found");
    }
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      country_code,
    ]);

    console.log("Added country to database: ", country_code);
    res.redirect("/");
  } catch (error) {
    console.error("Error adding country to database: ", error.stack);
    res.status(500).send("Error adding country");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await db.end();
  console.log("Database connection closed.");
  process.exit(0);
});
