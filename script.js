// 🚆 Train Booking System
const trainData = [
  { number: "12345", name: "Rajdhani Express", from: "Delhi", to: "Mumbai", time: "16:30", fare: "₹1500", class: "1A", quota: "GN" },
  { number: "69696", name: "Duronto Express", from: "Delhi", to: "Kolkata", time: "18:00", fare: "₹1350", class: "2A", quota: "GN" },
  { number: "11011", name: "Pune Nagpur Humsafar", from: "Pune", to: "Nagpur", time: "09:45", fare: "₹1120", class: "3A", quota: "TQ" },
  { number: "12953", name: "Pune Garibrath", from: "Nagpur", to: "Pune", time: "17:45", fare: "₹980", class: "2A", quota: "GN" },
  { number: "12626", name: "Kerala Express", from: "Delhi", to: "Chennai", time: "06:30", fare: "₹1200", class: "3A", quota: "GN" }
];

const form = document.getElementById("train-search-form");
const resultSection = document.getElementById("train-results");
let lastSearchResults = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const from = document.getElementById("from").value.trim().toLowerCase();
  const to = document.getElementById("to").value.trim().toLowerCase();
  const trainClass = document.getElementById("class").value;
  const quota = document.getElementById("quota").value;

  const filteredTrains = trainData.filter((train) => {
    return (
      train.from.toLowerCase() === from &&
      train.to.toLowerCase() === to &&
      train.class === trainClass &&
      train.quota === quota
    );
  });

  lastSearchResults = filteredTrains;
  displayResults(filteredTrains);

  if (filteredTrains.length > 0) {
    showSmartSuggestions(to.charAt(0).toUpperCase() + to.slice(1));
  } else {
    document.getElementById("smart-suggestions").classList.add("hidden");
  }
});

function displayResults(trains) {
  resultSection.innerHTML = "";

  if (trains.length === 0) {
    resultSection.innerHTML = "<p>No trains found matching your search.</p>";
    return;
  }

  trains.forEach((train) => {
    const card = document.createElement("div");
    card.classList.add("train-card");
    card.innerHTML = `
      <h3>${train.name} (${train.number})</h3>
      <p><strong>From:</strong> ${train.from} ➝ <strong>To:</strong> ${train.to}</p>
      <p><strong>Departure:</strong> ${train.time}</p>
      <p><strong>Fare:</strong> ${train.fare}</p>
      <p><strong>Class:</strong> ${train.class} | <strong>Quota:</strong> ${train.quota}</p>
      <div class="actions">
        <button class="book">Book Now</button>
        <button class="reminder">Set Reminder</button>
      </div>
    `;

    const bookBtn = card.querySelector(".book");
    const reminderBtn = card.querySelector(".reminder");

    bookBtn.addEventListener("click", () => {
      alert(`🎉 Train \"${train.name}\" booked successfully!`);
      updateDashboard(train);
    });

    reminderBtn.addEventListener("click", () => {
      alert(`⏰ Reminder set for \"${train.name}\" at ${train.time}`);
    });

    resultSection.appendChild(card);
  });
}

// 🌍 Smart Suggestions
function showSmartSuggestions(city) {
  const touristSpots = {
    Mumbai: ["Gateway of India", "Marine Drive", "Elephanta Caves"],
    Delhi: ["Red Fort", "Qutub Minar", "India Gate"],
    Kolkata: ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Temple"],
    Chennai: ["Marina Beach", "Fort St. George", "Kapaleeshwarar Temple"],
    Nagpur: ["Deekshabhoomi", "Sitabuldi Fort", "Ambazari Lake"],
    Pune: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort"]
  };

  const hotels = {
    Mumbai: ["Taj Palace", "Trident Nariman", "Hotel Marine Plaza"],
    Delhi: ["The Oberoi", "Taj Mahal Hotel", "Lemon Tree Premier"],
    Kolkata: ["ITC Sonar", "The Park Kolkata", "Floatel Hotel"],
    Chennai: ["Raintree Hotel", "Leela Palace", "The Park Chennai"],
    Nagpur: ["Radisson Blu", "Le Meridien", "Hotel Centre Point"],
    Pune: ["JW Marriott", "The Westin Pune", "Conrad Pune"]
  };

  const weatherMock = {
    Mumbai: "30°C, Humid and Cloudy",
    Delhi: "35°C, Sunny",
    Kolkata: "32°C, Thunderstorms",
    Chennai: "33°C, Hot and Humid",
    Nagpur: "36°C, Dry and Sunny",
    Pune: "28°C, Pleasant"
  };

  document.getElementById("tourist-places").innerHTML =
    (touristSpots[city] || ["Data not available"]).map(place => `<li>${place}</li>`).join("");

  document.getElementById("hotels").innerHTML =
    (hotels[city] || ["Data not available"]).map(hotel => `<li>${hotel}</li>`).join("");

  document.getElementById("weather").innerText =
    weatherMock[city] || "Data not available";

  document.getElementById("smart-suggestions").classList.remove("hidden");
}

// 💬 Chatbot
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  addChat("You", userMsg);
  chatInput.value = "";

  setTimeout(() => {
    const botResponse = generateBotResponse(userMsg);
    addChat("Bot", botResponse);
  }, 400);
}

function addChat(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "You" ? "user-msg" : "bot-msg";
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userInput) {
  const input = userInput.toLowerCase();

  if (input.includes("hello") || input.includes("hi")) {
    return "👋 Hello! How can I help you with your travel today?";
  } else if (input.includes("train") && input.includes("timing")) {
    if (lastSearchResults.length > 0) {
      return "Here are the latest train timings:<br>" +
        lastSearchResults.map(train => `${train.name} at ${train.time}`).join("<br>");
    } else {
      return "🔍 Please search for trains first using the form above.";
    }
  } else if (input.includes("book")) {
    return "🛤️ Use the 'Book Now' button below each train to book your ticket.";
  } else if (input.includes("reminder")) {
    return "🔔 Use the 'Set Reminder' button to get notified before the train departs.";
  } else if (input.includes("place") || input.includes("visit")) {
    return "🌍 Check out the 'Smart Suggestions' section for tourist places, hotels, and weather!";
  } else if (input.includes("dashboard")) {
    return "📊 Head to the dashboard section to see your travel stats and achievements!";
  } else {
    return "❓ Sorry, I didn’t understand that. Try asking about trains, booking, reminders, or places to visit.";
  }
}

// 📊 Dashboard Logic
function updateDashboard(train) {
  let data = JSON.parse(localStorage.getItem("dashboardData")) || {
    totalBookings: 0,
    recentTrain: "",
    points: 0,
    badges: [],
    motivation: ""
  };

  data.totalBookings += 1;
  data.recentTrain = `${train.name} (${train.number})`;
  data.points += 10;

  if (data.totalBookings >= 10 && !data.badges.includes("Pro Booker")) {
    data.badges.push("Pro Booker");
  } else if (data.totalBookings >= 5 && !data.badges.includes("Frequent Traveler")) {
    data.badges.push("Frequent Traveler");
  } else if (data.totalBookings >= 2 && !data.badges.includes("Getting Started")) {
    data.badges.push("Getting Started");
  }

  if (data.totalBookings >= 10) {
    data.motivation = "You're unstoppable! 🚀";
  } else if (data.totalBookings >= 5) {
    data.motivation = "Keep going, explorer! 🌍";
  } else if (data.totalBookings >= 1) {
    data.motivation = "Nice! You've started your journey. ✨";
  }

  localStorage.setItem("dashboardData", JSON.stringify(data));
  populateDashboard();
}

function populateDashboard() {
  const data = JSON.parse(localStorage.getItem("dashboardData")) || {
    totalBookings: 0,
    recentTrain: "None",
    points: 0,
    badges: [],
    motivation: ""
  };

  document.getElementById("dash-bookings").textContent = data.totalBookings;
  document.getElementById("dash-recent").textContent = data.recentTrain;
  document.getElementById("points").textContent = data.points;
  document.getElementById("badges").textContent = data.badges.join(", ") || "None";
  document.getElementById("motivation").textContent = data.motivation;
}

window.addEventListener("DOMContentLoaded", populateDashboard);
