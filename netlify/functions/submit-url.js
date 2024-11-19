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

  // Dynamically import node-fetch
  const fetch = await import("node-fetch"); // Dynamic import

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

    // Validate the URL format
    function isValidUrl(url) {
      const regex = /^https:\/\/ts\.la\/[a-zA-Z0-9]+[0-9]+$/;
      return regex.test(url);
    }

    // Function to check if the URL is reachable
    async function checkUrl(url) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

      try {
        const response = await fetch(url, { signal: controller.signal }); // Pass signal for timeout
        clearTimeout(timeoutId); // Clear timeout if fetch is successful
        return response.ok; // Return true if status is 2xx
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("URL check timed out");
        } else {
          console.log("Error checking URL:", error);
        }
        return false;
      }
    }

    // Function to validate and check if the URL is valid and reachable
    async function validateAndCheckUrl(url) {
      // Step 1: Validate URL format
      if (!isValidUrl(url)) {
        console.log("Invalid URL format.");
        return false; // Stop here if the URL format is invalid
      }

      // Step 2: Check if the URL is reachable
      const isReachable = await checkUrl(url);
      if (isReachable) {
        console.log("URL is valid and reachable.");
        return true; // Valid and reachable
      } else {
        console.log("URL is either unreachable or returns a 404.");
        return false; // Not reachable or 404
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
      console.log("connected");
      const db = client.db(dbName);
      const collection = db.collection("URLs");

      // Insert the new URL into the MongoDB collection
      console.log("insert One");
      const result = await collection.insertOne({ url });
      console.log("one Inserted");
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
