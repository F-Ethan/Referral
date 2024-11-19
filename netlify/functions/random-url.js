const { MongoClient } = require("mongodb");
const cors = require("cors");

// Use a MongoDB URI stored in environment variables for security
const mongoURI = process.env.mongoUri;
const dbName = "RandomURLs"; // The database name

exports.handler = async (event, context) => {
  // Enable CORS for your function by directly setting headers
  const headers = {
    "Access-Control-Allow-Origin": "*", // Allow all origins (adjust as needed)
    "Access-Control-Allow-Methods": "POST", // Only allow POST requests
    "Access-Control-Allow-Headers": "Content-Type", // Allow content-type headers
  };

  // Handle CORS pre-flight request (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS pre-flight response" }),
    };
  }

  // Proceed with actual request processing (for POST or other methods)
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Method Not Allowed
      headers,
      body: JSON.stringify({ error: "Only POST method is allowed" }),
    };
  }

  const client = new MongoClient(mongoURI);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("URLs");

    // Fetch all URLs from MongoDB
    const data = await collection.find({}).toArray();

    if (data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No URLs found" }),
      };
    }

    // Picks a random index between 0 and data.length - 1
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomUrl = data[randomIndex];

    // Return the randomly selected URL
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(randomUrl),
    };
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err);

    return {
      statusCode: 500, // Internal Server Error
      headers,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
};
