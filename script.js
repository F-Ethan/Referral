async function generateRandomURL() {
  try {
    const response = await fetch("http://localhost:5000/random-url");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const randomURL = data.URL; // Assuming the URL field in your MongoDB document is named "url"
    const urlDisplay = document.getElementById("url");
    urlDisplay.textContent = randomURL;

    // Copy the URL to clipboard
    await navigator.clipboard.writeText(randomURL);
    document.getElementById("url").innerText = randomURL;
    alert("URL copied to clipboard: " + randomURL);
  } catch (error) {
    console.error("Error fetching random URL:", error);
  }
}

document.getElementById("submitButton").addEventListener("click", async () => {
  const inputText = document.getElementById("inputField").value;

  try {
    const response = await fetch("http://localhost:5000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputText }),
    });

    const message = await response.text();
    // document.getElementById("responseMessage").innerText = message;
    document.getElementById("inputField").value = ""; // Clear the input field
    alert(inputText + " has been added to our list of referral codes.");
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("responseMessage").innerText =
      "Error submitting data.";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default anchor behavior
      const targetId = this.getAttribute("href"); // Get the target section id

      // Hide all pages
      pages.forEach((page) => {
        page.style.display = "none";
      });

      // Show the target page
      const targetPage = document.querySelector(targetId);
      if (targetPage) {
        targetPage.style.display = "flex";
        console.log(targetPage);
      }
    });
  });
});
