const { MongoClient } = require("mongodb");
const cors = require("cors");
const { request } = require("express");

// Use a MongoDB URI stored in environment variables for security
const mongoURI = process.env.mongoUri;
const dbName = "RandomURLs"; // The database name

exports.handler = async (event, context) => {
  // Define CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*", // Allow all origins (adjust as needed)
    "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow POST and OPTIONS methods
    "Access-Control-Allow-Headers": "Content-Type", // Allow content-type headers
  };

  console.log("making progress");

  // Handle CORS pre-flight request (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    console.log("Handling OPTIONS request (CORS pre-flight)");
    console.log(event.body);

    return {
      statusCode: 200,
      headers, // CORS headers for OPTIONS pre-flight
      body: JSON.stringify({ message: "CORS pre-flight response" }),
    };
  }

  // Ensure we proceed with the POST method
  if (event.httpMethod === "POST") {
    console.log("we are making progress");

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

    function isValidUrl(url) {
      const regex = /^https:\/\/ts\.la\/[a-zA-Z0-9]+[0-9]+$/;
      return regex.test(url);
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

    // Validate the URL
    console.log("is it true");
    const isUrlValid = await validateAndCheckUrl(url);
    console.log(url);

    if (!isUrlValid) {
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
  }

  // If the HTTP method is neither OPTIONS nor POST, return an error
  return {
    statusCode: 405, // Method Not Allowed
    headers,
    body: JSON.stringify({ error: "Only POST method is allowed" }),
  };
};
