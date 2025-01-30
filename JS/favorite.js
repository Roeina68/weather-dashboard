const API_BASE_URL = "https://93hal3ta95.execute-api.us-east-1.amazonaws.com/production";

// Reusable function to check session validity
function checkSession() {
  const userId = sessionStorage.getItem("sub");
  if (!userId) {
    alert("Your session has expired. Please log in again.");
    login(); // Call the login function from index.js
  }
  return userId;
}

// Save preferences to DynamoDB
async function savePreferences(favorites) {
  const userId = checkSession(); // Validate session
  if (!userId) return;

  const payload = {
    userId: userId,
    preferences: {
      favoriteCities: favorites,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}/SaveUserPreferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save preferences");
    }

    alert("Preferences saved successfully!");
  } catch (error) {
    console.error("Error saving preferences:", error);
    alert("Error saving preferences.");
  }
}

// Get preferences from DynamoDB
async function getPreferences() {
  const userId = checkSession(); // Validate session
  if (!userId) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/GetUserPreferences?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch preferences");
    }

    const data = await response.json();
    return data.preferences.favoriteCities || [];
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return [];
  }
}

const apiUrl = "https://api.weatherapi.com/v1/current.json";
const apiKey = "?key=07ef2814216a40a5a1d133813243107";

const addButton = document.getElementById("add-button");
const cityInput = document.getElementById("add-city");
const favoritesContainer = document.getElementById("favorites-container"); // Place to display cities

let favorites = [];

// Function to fetch weather for a city
function fetchWeatherForCity(city) {
  return fetch(apiUrl + apiKey + `&q=${city}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Unable to fetch weather for ${city}`);
      return response.json();
    });
}

// Render the favorites list
function renderFavorites() {
  favoritesContainer.innerHTML = ""; // Clear existing list
  favorites.forEach((city, index) => {
    fetchWeatherForCity(city)
      .then((data) => {
        const temperature = data.current.temp_c;
        const description = data.current.condition.text;
        const conditionIcon = data.current.condition.icon;

        // Create a new city box
        const cityBox = document.createElement("div");
        cityBox.classList.add("favorite-city-box");
        cityBox.innerHTML = `
          <div class="city-info">
            <h3>${city}</h3>
            <p>Temperature: ${temperature}°C</p>
            <p>Condition: ${description} <img src="https:${conditionIcon}" alt="${description}" width="30"></p>
            <button class="remove-button" data-index="${index}">Remove</button>
          </div>
        `;
        favoritesContainer.appendChild(cityBox);

        // Add event to remove button
        cityBox.querySelector(".remove-button").onclick = async () => {
          favorites.splice(index, 1);
          await savePreferences(favorites); // Save to DynamoDB
          renderFavorites();
        };
      })
      .catch((error) => {
        console.error(error);
        const errorItem = document.createElement("div");
        errorItem.textContent = `Error loading weather for ${city}`;
        favoritesContainer.appendChild(errorItem);
      });
  });
}

// Load favorites on page load
async function loadFavorites() {
  favorites = await getPreferences(); // Fetch from DynamoDB
  renderFavorites();
}

// Add a new city
addButton.onclick = async () => {
  const city = cityInput.value.trim();

  if (city && !favorites.includes(city)) {
    favorites.push(city);
    await savePreferences(favorites); // Save to DynamoDB
    cityInput.value = "";
    renderFavorites();
  } else if (favorites.includes(city)) {
    alert(`${city} is already in your favorites.`);
  }
};

// Clear all favorites
document.getElementById("clear-all-button").onclick = async () => {
  if (favorites.length === 0) {
    alert("No cities in the favorites list!");
  } else {
    favorites = [];
    await savePreferences(favorites); // Clear in DynamoDB
    favoritesContainer.innerHTML = "";
  }
};

// Initial render of the list
loadFavorites();

document.addEventListener("DOMContentLoaded", () => {
  const userInfo = document.getElementById("user-info");
  const userName = sessionStorage.getItem("username"); // Use 'username' instead of 'first_name'

  if (userName) {
    // If user is logged in, display the username
    userInfo.innerHTML = `<span>Welcome, ${userName}</span>`;
  } else {
    // If no user is logged in, display the login button
    userInfo.innerHTML = `<a href="javascript:void(0)" onclick="login()">Login</a>`;
  }
});

function login() {
  const authUrl = `${config.domain}/login?` +
    `response_type=token` +
    `&client_id=${config.clientId}` +
    `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
    `&scope=openid+aws.cognito.signin.user.admin`;

  console.log("Auth URL:", authUrl); // Debugging
  window.location.href = authUrl;
}

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
