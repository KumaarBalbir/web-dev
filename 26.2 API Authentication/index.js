import express from "express";
import axios from "axios";

const uname = "kumaar";
const password = "iambalbir";
const myapikey = "474b2e86-5bcd-4bd1-97ba-5d255bad4ca9";
const myauthTOken = "474b2e86-5bcd-4bd1-97ba-5d255bad4ca9";
const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = uname;
const yourPassword = password;
const yourAPIKey = myapikey;
const yourBearerToken = myauthTOken;

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  let content = await fetchNoAuth(`${API_URL}random`);
  res.render("index.ejs", { content: content });
});

app.get("/basicAuth", async (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
  let finalURL = `${API_URL}all?page=2`;
  let content = await fetchBasicAuth(finalURL);
  res.render("index.ejs", { content: content });
});

app.get("/apiKey", async (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  let finalURL = `${API_URL}filter?embarrassment[gte]=5&apiKey=${myapikey}`;
  let content = await fetchWithFilter(finalURL);
  res.render("index.ejs", { content: content });
});

app.get("/bearerToken", (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
});

async function fetchNoAuth(url) {
  try {
    const response = await axios.get(url);
    // console.log("response data: ", response.data);
    const data = JSON.stringify(response.data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return { content: "Error fetching data." };
  }
}

async function fetchBasicAuth(url) {
  try {
    const response = await axios.get(url, {
      auth: {
        username: uname,
        password: password,
      },
    });
    // console.log("response data: ", response.data);
    const data = JSON.stringify(response.data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return { content: "Error fetching data." };
  }
}

async function fetchWithFilter(url) {
  try {
    const response = await axios.get(url);
    console.log("response data: ", response.data);
    const data = JSON.stringify(response.data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return { content: "Error fetching data." };
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
