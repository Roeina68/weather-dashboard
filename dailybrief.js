const apiUrl = "https://6qflo080id.execute-api.us-east-1.amazonaws.com/prod/weather"; // Replace with your Lambda API Gateway URL
const inputSection = document.getElementById("input-section");
const forecastSection = document.getElementById("forecast-section");

document.getElementById("get-advice").onclick = getForecast;
document.getElementById("back-button").onclick = () => {
  forecastSection.style.display = "none";
  inputSection.style.display = "block";
};

function getForecast() {
  const city = document.getElementById("city-input").value.trim().toLowerCase();
  const days = 1;

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  // Build the API URL
  const lambdaUrl = `${apiUrl}?city=${encodeURIComponent(city)}&days=${days}`;
  console.log(`Requesting weather for: ${lambdaUrl}`); // Debugging log

  fetch(lambdaUrl)
    .then(response => {
      if (!response.ok) {
        console.error("API request failed:", response.statusText);
        throw new Error("Failed to fetch data from Lambda");
      }
      return response.json();
    })
    .then(data => {
      console.log("API response:", data); // Debugging log
      const parsedData = JSON.parse(data.body); // Parse the `body` field of the response
      if (!parsedData.forecast || !parsedData.forecast.forecastday) {
        throw new Error("Invalid data format from Lambda");
      }
      const forecastData = parsedData.forecast.forecastday[0];
      updateForecast(forecastData);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      alert(`Error: ${error.message}`);
    });
}

function updateForecast(forecast) {
  // Extract general weather data
  const dailyCondition = forecast.day.condition.text.toLowerCase();
  const dailyTemp = forecast.day.avgtemp_c;

  // Update general recommendations
  updateGeneralRecommendations(dailyTemp, dailyCondition);

  // Update forecasts for morning, afternoon, and evening
  const morning = forecast.hour[8]; // 8 AM
  const afternoon = forecast.hour[14]; // 2 PM
  const evening = forecast.hour[20]; // 8 PM

  updateForecastTime("morning", morning);
  updateForecastTime("afternoon", afternoon);
  updateForecastTime("evening", evening);

  inputSection.style.display = "none";
  forecastSection.style.display = "block";
}

function updateGeneralRecommendations(temp, condition) {
  const recommendationsElement = document.getElementById("general-recommendations");

  let recommendations = `<p><b>General Weather:</b> ${condition}, Avg Temp: ${temp}°C</p>`;

  recommendations += "<h3>What to Wear:</h3>";
  if (condition.includes("rain")) {
    recommendations += "<p>Wear a waterproof coat, boots, and take an umbrella. Stay warm and dry!</p>";
  } else if (condition.includes("clear")) {
    recommendations += "<p>Light clothing is recommended. Don't forget sunscreen and a hat to protect yourself from the sun.</p>";
  } else if (condition.includes("snow")) {
    recommendations += "<p>Dress warmly with layers: gloves, a scarf, a heavy coat, and snow boots.</p>";
  } else if (condition.includes("fog")) {
    recommendations += "<p>Wear warm clothing and a reflective jacket if you're outside for safety in low visibility.</p>";
  } else {
    recommendations += "<p>Wear comfortable clothing appropriate for mild weather.</p>";
  }

  recommendations += "<h3>Recommended Activities:</h3>";
  if (condition.includes("rain")) {
    recommendations += "<p>It's a good day to stay indoors. Enjoy reading a book, watching a movie, or sipping a hot drink.</p>";
    recommendations += "<p>Avoid outdoor activities unless necessary, as roads may be slippery.</p>";
  } else if (condition.includes("clear")) {
    recommendations += "<p>Perfect weather for outdoor activities like a picnic, hiking, or a walk in the park.</p>";
    recommendations += "<p>Don't forget to stay hydrated and protect yourself from the sun.</p>";
  } else if (condition.includes("snow")) {
    recommendations += "<p>Enjoy activities like building a snowman, sledding, or skiing if conditions are safe.</p>";
    recommendations += "<p>Avoid unnecessary driving as roads may be icy.</p>";
  } else if (condition.includes("fog")) {
    recommendations += "<p>Limit outdoor activities and avoid driving if possible. Visibility may be low.</p>";
  } else {
    recommendations += "<p>It's a neutral day! You can plan both indoor and outdoor activities comfortably.</p>";
  }

  recommendations += "<h3>Warnings:</h3>";
  let warnings = "";

  if (temp < 5) {
    warnings += "<p>It's very cold! Avoid prolonged exposure to the cold and keep yourself warm.</p>";
  }
  if (temp > 30) {
    warnings += "<p>It's very hot! Stay indoors during peak sun hours and drink plenty of water.</p>";
  }
  if (condition.includes("rain") || condition.includes("snow")) {
    warnings += "<p>Roads might be slippery. Drive carefully and avoid unnecessary travel.</p>";
  }

  if (warnings === "") {
    warnings = "<p>No warnings for today. Enjoy your day!</p>";
  }

  recommendations += warnings;
  recommendationsElement.innerHTML = recommendations;
}

function updateForecastTime(time, data) {
    const recommendationsContainer = document.getElementById(`${time}-icons`);
    let recommendations = `<h4>${time.charAt(0).toUpperCase() + time.slice(1)}:</h4>`;
  
    const condition = data.condition.text.toLowerCase();
    const temp = data.temp_c;
  
    // Maintain a set to track already applied recommendations
    const appliedRecommendations = new Set();
  
    // Helper function to add a recommendation if it's not a duplicate
    function addRecommendation(recommendation) {
      if (!appliedRecommendations.has(recommendation)) {
        recommendations += `<p>${recommendation}</p>`;
        appliedRecommendations.add(recommendation);
      }
    }
  
    // Weather condition-specific recommendations
    if (condition.includes("rain")) {
      addRecommendation("Rain expected. Carry an umbrella and wear waterproof shoes.");
    }
    if (condition.includes("clear")) {
      addRecommendation("Clear skies! Great for outdoor activities. Don’t forget sunscreen.");
    }
    if (condition.includes("snow")) {
      addRecommendation("Snowy weather! Wear snow boots and bundle up warmly.");
    }
    if (condition.includes("fog")) {
      addRecommendation("Foggy! Drive carefully and stay visible if you're outside.");
    }
    if (condition.includes("cloud")) {
      addRecommendation("Cloudy skies! Light layers should keep you comfortable.");
    }
  
    // Temperature-specific recommendations
    if (temp <= 0) {
      addRecommendation("Freezing temperatures! Wear heavy layers, gloves, and a scarf.");
    } else if (temp > 0 && temp <= 15) {
      addRecommendation("Chilly weather! A jacket and scarf are ideal.");
    } else if (temp > 15 && temp <= 25) {
      addRecommendation("Comfortable temperatures. Light layers are sufficient.");
    } else {
      addRecommendation("Hot temperatures! Stay cool with breathable fabrics and stay hydrated.");
    }
  
    recommendationsContainer.innerHTML = recommendations;
  }


  function login() {
  const authUrl = `${config.domain}/login?` +
    `response_type=token` +
    `&client_id=${config.clientId}` +
    `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
    `&scope=openid+aws.cognito.signin.user.admin`;

  console.log("Auth URL:", authUrl); // Debugging
  window.location.href = authUrl;
}

document.addEventListener("DOMContentLoaded", () => {
  const userInfo = document.getElementById("user-info");
  const userName = sessionStorage.getItem("username"); // Get the username from sessionStorage

  if (userName) {
    // Display the username if logged in
    userInfo.innerHTML = `<span>Welcome, ${userName}</span>`;
  } else {
    // Show the login button if not logged in
    userInfo.innerHTML = `<a href="javascript:void(0)" onclick="login()">Login</a>`;
  }
});