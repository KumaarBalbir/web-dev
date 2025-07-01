import express from "express";
import path from "path";
import url from "url";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

/* Write your code here:
Step 1: Render the home page "/" index.ejs
Step 2: Make sure that static files are linked to and the CSS shows up.
Step 3: Add the routes to handle the render of the about and contact pages.
  Hint: Check the nav bar in the header.ejs to see the button hrefs
Step 4: Add the partials to the about and contact pages to show the header and footer on those pages. */

//step1
app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

// Step 2: Set up EJS and static files
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// step 3: Add routes for about and contact pages
app.get("/about", (req, res) => {
  res.render(__dirname + "/views/about.ejs");
});

app.get("/contact", (req, res) => {
  res.render(__dirname + "/views/contact.ejs");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
