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
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let users = [];
  try {
    const result = await db.query("SELECT email FROM users");
    users = result.rows.map((row) => row.email);
  } catch (err) {
    console.log("Error in fetching users data");
  }
  if (users.includes(username)) {
    console.log("User already exists");
    res.send("User already exists, try logging in.");
    return;
  }
  try {
    await db.query("INSERT INTO users(email, password) VALUES ($1, $2)", [
      username,
      password,
    ]);
    res.render("secrets.ejs");
  } catch (err) {
    console.log("Error registering user:", err);
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query(
      "SELECT email, password FROM users WHERE email = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      res.render("secrets.ejs");
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (err) {
    console.log("Error logging in:", err);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
