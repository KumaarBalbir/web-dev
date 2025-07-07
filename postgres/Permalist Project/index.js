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

app.get("/", async (req, res) => {
  // Read
  let items = [];
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    if (result) {
      items = result.rows.map((row) => {
        return { id: row.id, title: row.title };
      });
    } else {
      console.log("empty todo list");
    }
  } catch (err) {
    console.log("error fetching todo lists from db:", err);
  }
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  // CREATE
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  } catch (err) {
    console.log("error in adding item to database: ", err);
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  // UPDATE
  const updatedItemTitle = req.body.updatedItemTitle;
  const itemId = req.body.updatedItemId;
  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [
      updatedItemTitle,
      itemId,
    ]);
  } catch (err) {
    console.log("error updating item in db:", err);
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  // DELETE
  const itemId = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [itemId]);
    res.redirect("/");
  } catch (err) {
    console.log("error deleting item from db:", err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGINT", async () => {
  console.log("Closing database connection...");
  await db.end();
  console.log("Database connection closed.");
  process.exit(0);
});
