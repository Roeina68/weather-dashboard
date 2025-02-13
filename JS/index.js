const weatherAPI = "https://vydb4aacbj.execute-api.us-east-1.amazonaws.com/prod/weather"
const outputElement = document.getElementById("weather-output");
const IPINFO_TOKEN = "6e4f6292cad2b7"

// Mapping of top cities by country
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

// Displays weather for top cities in the user's country
(async function displayDefaultCities() {
  const country = await getUserCountry();
  const cities = topCities[country] || topCities["IL"]; // Default to Israel if country not found
  outputElement.classList.remove("single-result"); // Ensure the grid is used for multiple cities
  displayTopCitiesWeather(cities);
})();

// Handles user search input and fetches weather data
document.getElementById("submit").onclick = async function apiCall() {
  const userInput = document.getElementById("user-input").value.trim();

  if (!userInput) {
    alert("Please enter a city name.");
    return;
  }

  outputElement.innerHTML = ""; // Clear the output
  outputElement.classList.add("single-result"); // Add the single-result class
  await fetchWeather(userInput); // Display the searched city's weather
};

// Fetches weather data from the API
async function fetchWeather(city) {
  const fullURL = `${weatherAPI}?city=${encodeURIComponent(city)}`;
  try {
    const response = await fetch(
      fullURL
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


// Displays weather data for multiple cities
async function displayTopCitiesWeather(cities) {
  outputElement.innerHTML = ""; // Clear any existing content
  outputElement.classList.remove("single-result"); // Remove the single-result class for multiple cities
  for (const city of cities) {
    await fetchWeather(city); // Fetch and display weather for each city
  }
}


// Updates the UI with weather data
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


// Determines the user's country based on IP
async function getUserCountry() {
  try {
    const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    return data.country || "IL"; // Default to Israel if no country is found
  } catch (error) {
    console.error("Error fetching location. Defaulting to Israel:", error);
    return "IL"; // Default to Israel
  }
}


// Handles API response errors
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


// Handles user authentication
function login() {
  const authUrl = `${config.domain}/login?` +
    `response_type=token` +
    `&client_id=${config.clientId}` +
    `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
    `&scope=openid+aws.cognito.signin.user.admin`;

  console.log("Auth URL:", authUrl);
  window.location.href = authUrl;
}


// Updates the clock display in real-time
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


// Determines the CSS class based on weather condition
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
    userInfo.innerHTML = `<span id="user-info">Welcome, ${userName} <button onclick="signOut()">Logout</button></span>`;
  } else {
    // Show the login button if not logged in
    userInfo.innerHTML = `<a href="javascript:void(0)" onclick="login()" >Login</a>`;
  }
});


// Manages user authentication display
async function signOut() {
  const accessToken = sessionStorage.getItem('access_token');

  if (!accessToken) {
    console.error("No access token found. User may already be logged out.");
    return;
  }

  try {
    const response = await fetch('https://19r0w8n9jc.execute-api.us-east-1.amazonaws.com/prod/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });

    if (response.ok) {
      console.log('User logged out successfully');
      sessionStorage.clear();  //
      window.location.href = '/';
    } else {
      console.error('Failed to log out');
      const errorData = await response.json();
      console.error("API Response:", errorData);
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
}


// Sidebar navigation control
function openNav() {
  document.getElementById("sidebar").style.width = "250px";
}

function closeNav() {
  document.getElementById("sidebar").style.width = "0";
}

let sidebarOpen = false;

function toggleNav() {
  const sidebar = document.getElementById("sidebar");
  
  if (sidebarOpen) {
    sidebar.style.width = "0";
    sidebarOpen = false;
  } else {
    sidebar.style.width = "250px";
    sidebarOpen = true;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const menuButton = document.querySelector('.menu-button');
  if (menuButton) {
    menuButton.addEventListener('click', toggleNav);
  }
});
