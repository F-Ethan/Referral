const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Replace with your MongoDB connection string
const mongoUri =
  "mongodb+srv://MainUser:Password1@cluster0.664pc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "RandomURLs"; // Your database name

app.use(cors());
app.use(bodyParser.json());

function isValidUrl(url) {
  const regex = /^https:\/\/ts\.la\/[a-zA-Z0-9]+[0-9]+$/;
  return regex.test(url);
}

async function checkUrl(url) {
  try {
    const response = await axios.get(url);
    return response.status === 200; // URL is valid if status is 200
  } catch (error) {
    // If an error occurs, check the status code
    if (error.response) {
      // The request was made and the server responded with a status code
      return error.response.status !== 404; // Valid if not 404
    }
    return false; // Any other error (like network issues)
  }
}

async function validateAndCheckUrl(url) {
  if (!isValidUrl(url)) {
    console.log("Invalid URL format.");
    return false;
  }

  const isValid = await checkUrl(url);
  if (isValid) {
    console.log("URL is valid and reachable.");
    return true;
  } else {
    console.log("URL is either unreachable or returns a 404.");
    return false;
  }
}

let db;
MongoClient.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    db = client.db(dbName); // Replace with your database name
    console.log("Connected to MongoDB");
    console.log("db Printed here  -----> ");
    // console.log(db);
  })
  .catch((error) => console.error(error));

// Endpoint to get a random URL
// const response = await fetch("http://localhost:5000/random-url");
app.get("/random-url", async (req, res) => {
  const urls = await db.collection("URLs").find().toArray();
  // console.log("urls");
  // console.log(urls);
  if (urls.length === 0) {
    return res.status(404).send("No URLs found");
  }

  const randomIndex = Math.floor(Math.random() * urls.length);
  res.json(urls[randomIndex]);
  // console.log(res.json(urls[randomIndex]));
});

// POST route to save data
app.post("/submit", async (req, res) => {
  const { inputText } = req.body;

  // check if the input url is a valid format and dosen't return 404
  if (validateAndCheckUrl(inputText)) {
    try {
      const result = await db.collection("URLs").insertOne({ inputText });
      res.status(201).send("Data saved successfully!");
    } catch (error) {
      res.status(500).send("Error saving data: " + error.message);
    }
  } else {
    res.status(500).send("Opps that doesnt seem to be a valid reffural link");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
