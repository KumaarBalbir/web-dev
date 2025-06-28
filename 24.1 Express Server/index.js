import express from "express";
const PORT = 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1>About Page</h1>");
});

app.get("/contact", (req, res) => {
  res.send("<h1>Contact Page</h1>");
});

app.put("/update", (req, res) => {
  res.send("<h1>Update Page</h1>");
});

app.delete("/delete", (req, res) => {
  res.send("<h1>Delete Page</h1>");
});

app.post("/create", (req, res) => {
  res.send("<h1>Create Page</h1>");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
