import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import url from "url";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    // console.log(result);
    res.render(__dirname + "/views/index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render(__dirname + "/views/index.ejs", {
      data: { error: error.message },
    });
  }
});

app.post("/", async (req, res) => {
  // console.log(req.body);

  // Step 2: Play around with the drop downs and see what gets logged.
  // Use axios to make an API request to the /filter endpoint. Making
  // sure you're passing both the type and participants queries.
  // Render the index.ejs file with a single *random* activity that comes back
  // from the API request.
  // Step 3: If you get a 404 error (resource not found) from the API request.
  // Pass an error to the index.ejs to tell the user:
  // "No activities that match your criteria."
  const type = req.body.type;
  const participants = req.body.participants;
  const activity = await getActivity(type, participants);
  // console.log(activity);
  res.render(__dirname + "/views/index.ejs", { data: activity });
});

async function getActivity(type, participants) {
  let response;
  try {
    response = await axios.get("https://bored-api.appbrewery.com/filter", {
      params: {
        type: type,
        participants: participants,
      },
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    return { error: "No activities that match your criteria." };
  }
  // console.log("Response status", response.status);
  if (response.status === 200 && response.data.length > 0) {
    const randomIndex = Math.floor(Math.random() * response.data.length);
    return response.data[randomIndex];
  } else {
    return { error: "No activities that match your criteria." };
  }
}

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
