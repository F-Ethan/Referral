const { MongoClient } = require("mongodb");
const cors = require("cors");

// Use a MongoDB URI stored in environment variables for security
const mongoURI = process.env.mongoUri;
const dbName = "RandomURLs"; // The database name

exports.handler = async (event, context) => {
  // Enable CORS for your function
  const corsOptions = {
    origin: "*", // Allow all origins (or customize based on your needs)
  };
  const corsHandler = cors(corsOptions);

  // Wrap the function in CORS handler
  return new Promise((resolve, reject) => {
    corsHandler(event, context, async () => {
      const client = new MongoClient(mongoURI);

      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("URLs");
        const data = await collection.find({}).toArray();

        // Picks a number between 1 and Urls.length
        const randomIndex = Math.floor(Math.random() * urls.length);
        const randomUrl = data[randomIndex];

        resolve({
          statusCode: 200,
          body: JSON.stringify(randomUrl),
        });
      } catch (err) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: "Failed to fetch data" }),
        });
      } finally {
        await client.close();
      }
    });
  });
};
