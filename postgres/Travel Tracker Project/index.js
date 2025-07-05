import express from "express";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

let visited_countries = [];

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
await db.connect();
try {
  const res = await db.query("SELECT * FROM visited_countries");
  visited_countries = res.rows.map((row) => row.country_code);
  console.log("Fetched visited countries from database: ", visited_countries);
} catch (error) {
  console.error("Error executing queries: ", error.stack);
} finally {
  await db.end();
  console.log("Database connection closed.");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.
  res.render("index.ejs", {
    countries: visited_countries,
    total: visited_countries.length,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
