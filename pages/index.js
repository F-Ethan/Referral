import React from "react";

// pages/index.js
function HomePage() {
  return (
    <div>
      <section class="intro">
        <div class="container">
          <h2>Looking to buy a new Tesla? Get More than Just a Discount!</h2>
          <p>
            Looking to buy your new Tesla? Get $1,000 off and 1,000 miles of
            FREE Supercharging by using a referral link from a real Tesla owner!
          </p>
          <ul>
            <li>1,000 miles of FREE Supercharging for you.</li>
            <li>
              Support a real Tesla owner, not a YouTuber who can't benefit from
              their own code.
            </li>
            <li>
              Stay updated on exclusive Tesla benefits like winning a Founder's
              Series Roadster.
            </li>
          </ul>
          <a href="#referral-form" class="cta-button">
            Get My Referral Link and Save $1,000!
          </a>
        </div>
      </section>

      <section class="referral-owners">
        <div class="container">
          <h2>Already own a Tesla? Help Others and Earn Rewards!</h2>
          <p>
            Add your referral code to our list and get rewarded every time
            someone uses it. You'll earn **1,000 miles of free Supercharging**
            and more!
          </p>
          <ul>
            <li>Earn 1,000 miles of free Supercharging for every new buyer.</li>
            <li>
              Exclusive rewards like Tesla event access and chances to win a
              Founder's Series Roadster.
            </li>
            <li>
              Support new buyers and make sure your code reaches real customers.
            </li>
          </ul>
          <a href="#referral-form" class="cta-button">
            Add My Referral Code
          </a>
        </div>
      </section>

      <section class="why-participate">
        <div class="container">
          <h2>Why Participate?</h2>
          <div class="two-columns">
            <div class="column">
              <h3>For New Buyers:</h3>
              <ul>
                <li>Save $1,000 off your Tesla purchase.</li>
                <li>1,000 miles of free Supercharging.</li>
                <li>Support real Tesla owners, not influencers.</li>
                <li>
                  Enjoy changing Tesla rewards, from exclusive events to
                  Roadster chances!
                </li>
              </ul>
            </div>
            <div class="column">
              <h3>For Existing Owners:</h3>
              <ul>
                <li>Earn 1,000 miles of free Supercharging.</li>
                <li>
                  Exclusive Tesla rewards, from merchandise points to events.
                </li>
                <li>More chances to win a Founder’s Series Roadster.</li>
                <li>
                  Help new buyers join the Tesla family and enjoy rewards.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="referral-form" class="cta">
        <div class="container">
          <h2>Get Started</h2>
          <div class="cta-buttons">
            <a href="#" class="cta-button">
              Get My Referral Link Now
            </a>
            <a href="#" class="cta-button">
              Add My Referral Code
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
