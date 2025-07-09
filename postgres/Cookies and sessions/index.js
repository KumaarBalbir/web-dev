import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
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
app.use(express.json()); // parse application/json
app.set("view engine", "ejs"); // set EJS as the templating engine
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded (parse form submissions)
app.use(express.static("public")); // serve static files from the public directory

app.use(
  session({
    secret: process.env.SESSION_SECRET, // sign the session cookie (encryption key for session)
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // save a new session even if it is uninitialized
    cookie: {
      secure: false, // set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // session expires after 1 day
    },
  })
);

//initialize passport middleware
// Note: the session middleware (declared above) must come before passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUserByUsername(username);
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user); // user authenticated successfully
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      } else {
        return done(null, false, { message: "User not found." });
      }
    } catch (err) {
      console.log("Error in LocalStrategy: ", err.stack);
      return done(err);
    }
  })
);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, password]
      );
      console.log(result);
      res.render("secrets.ejs");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

async function findUserByUsername(username) {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    return result.rows[0];
  } catch (err) {
    console.log("Error finding user: ", err.stack);
    return null;
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
