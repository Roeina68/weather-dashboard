const apiUrl = "https://api.weatherapi.com/v1/current.json";
const apiKey = "?key=07ef2814216a40a5a1d133813243107";
const outputElement = document.getElementById("weather-output");

// Top cities mapping by country (ISO country code)
const topCities = {
  IL: ["Tel Aviv", "Jerusalem", "Haifa", "Beersheba"],
  US: ["New York", "Los Angeles", "Chicago", "Houston"],
  FR: ["Paris", "Marseille", "Lyon", "Toulouse"],
  DE: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
  UK: ["London", "Birmingham", "Manchester", "Glasgow"],
  CA: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  IN: ["Mumbai", "Delhi", "Bangalore", "Kolkata"],
  JP: ["Tokyo", "Osaka", "Yokohama", "Nagoya"],
  CN: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"],
  IT: ["Rome", "Milan", "Naples", "Turin"],
  ES: ["Madrid", "Barcelona", "Valencia", "Seville"],
  BR: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
  RU: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg"],
  ZA: ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
  MX: ["Mexico City", "Guadalajara", "Monterrey", "Puebla"],
  SA: ["Riyadh", "Jeddah", "Mecca", "Dammam"],
  KR: ["Seoul", "Busan", "Incheon", "Daegu"],
  EG: ["Cairo", "Alexandria", "Giza", "Shubra El-Kheima"],
  AR: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"]
};

// On page load, display top cities of the user's country
(async function displayDefaultCities() {
  const country = await getUserCountry();
  const cities = topCities[country] || topCities["IL"]; // Default to Israel if country not found
  outputElement.classList.remove("single-result"); // Ensure the grid is used for multiple cities
  displayTopCitiesWeather(cities);
})();

// Handle user search
document.getElementById("submit").onclick = async function apiCall() {
  const userInput = document.getElementById("user-input").value.trim();

  if (!userInput) {
    alert("Please enter a city name.");
    return;
  }

  // Replace the default cities with the searched city
  outputElement.innerHTML = ""; // Clear the output
  outputElement.classList.add("single-result"); // Add the single-result class
  await fetchWeather(userInput); // Display the searched city's weather
};

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://vydb4aacbj.execute-api.us-east-1.amazonaws.com/prod/weather?city=${encodeURIComponent(city)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json(); // Data returned by Lambda
    displayWeather(data); // Pass the data to the displayWeather function
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("weather-output").innerHTML = `<p>Error: ${error.message}</p>`;
  }
}


async function displayTopCitiesWeather(cities) {
  outputElement.innerHTML = ""; // Clear any existing content
  outputElement.classList.remove("single-result"); // Remove the single-result class for multiple cities
  for (const city of cities) {
    await fetchWeather(city); // Fetch and display weather for each city
  }
}

function displayWeather(data) {
  const { temp_c: temperature, condition, humidity, wind_kph: windSpeed } = data.current;
  const { name: location } = data.location;

  // Add weather details for each city
  outputElement.innerHTML += `
    <div class="weather-card">
      <p><b>${location}</b></p>
      <p>Temperature: <b>${temperature}°C</b></p>
      <p>Humidity: <b>${humidity}%</b></p>
      <p>Wind Speed: <b>${windSpeed} k/h</b></p>
      <p>Condition: <b>${condition.text}</b></p>
      <img src="https:${condition.icon}" alt="Weather Icon">
    </div>
  `;
}

async function getUserCountry() {
  try {
    const response = await fetch("https://ip-api.com/json/"); // Use HTTPS
    const data = await response.json();
    return data.countryCode || "IL"; // Default to Israel if no country is found
  } catch (error) {
    console.error("Error fetching location. Defaulting to Israel:", error);
    return "IL"; // Default to Israel
  }
}


function handleResponseError(response) {
  if (response.status === 400) {
    throw new Error("Bad request");
  } else if (response.status === 404) {
    alert("City not found. Please try again!");
    throw new Error("City not found");
  } else if (response.status === 500) {
    throw new Error("Server error");
  } else {
    throw new Error("Unknown error occurred");
  }
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

function updateClock() {
  const clockElement = document.getElementById('clock');
  const now = new Date();
  clockElement.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

setInterval(updateClock, 1000);
updateClock();

function getWeatherClass(condition) {
  condition = condition.toLowerCase();
  if (condition.includes("sun")) {
      return "sunny";
  } else if (condition.includes("partly cloudy")) {
      return "partly-cloudy";
  } else if (condition.includes("cloud")) {
      return "cloudy";
  } else if (condition.includes("rain")) {
      return "rainy";
  } else if (condition.includes("snow")) {
      return "snowy";
  } else {
      return "default";
  }
}

function displayWeather(data) {
  const condition = data.current.condition.text;
  const weatherClass = getWeatherClass(condition);

  // יצירת הכרטיס
  outputElement.innerHTML += `
      <div class="weather-card ${weatherClass}">
          <h3>${data.location.name}</h3>
          <p>Temperature: ${data.current.temp_c}°C</p>
          <p>Condition: ${condition}</p>
          <img src="https:${data.current.condition.icon}" alt="${condition}">
      </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const userInfo = document.getElementById("user-info");
  const userName = sessionStorage.getItem("username"); // Get the username from sessionStorage

  if (userName) {
    // Display the username if logged in
    userInfo.innerHTML = `<span id="user-info">Welcome, ${userName}</span>`;
  } else {
    // Show the login button if not logged in
    userInfo.innerHTML = `<a href="javascript:void(0)" onclick="login()" >Login</a>`;
  }
});
