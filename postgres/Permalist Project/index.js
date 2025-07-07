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

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", (req, res) => {
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
