// Helper function to fetch and display a random URL
async function generateRandomURL() {
  try {
    // Fetch the random URL from the serverless function on Netlify
    const response = await fetch(
      "https://teslareferral.netlify.app/.netlify/functions/random-url",
      {
        method: "POST", // Use POST method
        headers: {
          "Content-Type": "application/json", // JSON content type
        },
        body: JSON.stringify({}), // Empty body (no data required)
      }
    );

    // Handle non-OK responses
    if (!response.ok) throw new Error("Failed to fetch random URL");

    // Get the data and extract the URL
    const { URL: randomURL } = await response.json();
    const urlDisplay = document.getElementById("url");

    // Display the URL and copy it to the clipboard
    urlDisplay.textContent = randomURL;
    await navigator.clipboard.writeText(randomURL);

    // Notify the user
    alert(`URL copied to clipboard: ${randomURL}`);
  } catch (error) {
    console.error("Error fetching random URL:", error);
    alert("Failed to fetch random URL. Please try again later.");
  }
}

// Event listener for submitting a referral code
document.getElementById("submitButton").addEventListener("click", async () => {
  const url = document.getElementById("inputField").value;

  if (!url.trim()) {
    alert("Please enter a referral code.");
    return; // Prevent submission if input is empty
  }

  try {
    // Send the referral code to the serverless function for submission
    const response = await fetch(
      // "https://teslareferral.netlify.app/.netlify/functions/submit",

      "http://localhost:8888/.netlify/functions/submit-url", // local server url
      {
        method: "POST", // Use POST method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }), // Send the inputText as JSON
      }
    );

    // Handle non-OK responses
    if (!response.ok) throw new Error("Failed to submit referral code");

    // Log the response for debugging
    const data = await response.json();
    console.log(data);

    // Clear the input field and show success message
    document.getElementById("inputField").value = "";
    alert(`${url} has been added to our list of referral codes.`);
  } catch (error) {
    console.error("Error submitting referral code:", error);
    alert("Failed to submit referral code. Please try again later.");
  }
});

// Helper function to show a specific page and hide the others
function showSection(sectionId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => (page.style.display = "none")); // Hide all pages
  const targetPage = document.getElementById(sectionId);
  if (targetPage) targetPage.style.display = "flex"; // Show the target page
}

// Function to handle page navigation
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");

  // Add click event listeners to each navigation link
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      const targetId = link.getAttribute("href").slice(1); // Get the target section ID (remove the '#')

      // Hide all pages
      pages.forEach((page) => (page.style.display = "none"));

      // Show the target page
      const targetPage = document.getElementById(targetId);
      if (targetPage) {
        targetPage.style.display = "flex";
      }
    });
  });

  // Show the home page by default on initial load
  showSection("home");
});
