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

  // Parse the request body to get the new URL data
  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400, // Bad Request
      headers,
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
    };
  }

  const { url } = requestBody;

  // Validate the URL
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return {
      statusCode: 400, // Bad Request
      headers,
      body: JSON.stringify({ error: "Invalid URL provided" }),
    };
  }

  const client = new MongoClient(mongoURI);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("URLs");

    // Insert the new URL into the MongoDB collection
    const result = await collection.insertOne({ url });

    // Return success response with the inserted URL
    return {
      statusCode: 201, // Created
      headers,
      body: JSON.stringify({
        message: "URL successfully added",
        url: result.ops[0].url,
      }),
    };
  } catch (err) {
    console.error("Error inserting data into MongoDB:", err);

    return {
      statusCode: 500, // Internal Server Error
      headers,
      body: JSON.stringify({ error: "Failed to insert data" }),
    };
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
};
