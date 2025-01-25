const apiUrl = "http://api.weatherapi.com/v1/current.json";
const apiKey = "?key=07ef2814216a40a5a1d133813243107";

const addButton = document.getElementById('add-button');
const cityInput = document.getElementById('add-city');
const favoritesList = document.getElementById('favorites-list');
const favoritesContainer = document.getElementById('favorites-container'); // מקום להצגת הערים

// Load favorites from LocalStorage
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to fetch weather for a city
function fetchWeatherForCity(city) {
  return fetch(apiUrl + apiKey + `&q=${city}`)
    .then(response => {
      if (!response.ok) throw new Error(`Unable to fetch weather for ${city}`);
      return response.json();
    });
}

// Render the favorites list
function renderFavorites() {
  favoritesContainer.innerHTML = ''; // Clear existing list
  favorites.forEach((city, index) => {
    fetchWeatherForCity(city)
      .then(data => {
        const temperature = data.current.temp_c;
        const description = data.current.condition.text;
        const conditionIcon = data.current.condition.icon;

        // Create a new city box
        const cityBox = document.createElement('div');
        cityBox.classList.add('favorite-city-box');
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
        cityBox.querySelector('.remove-button').onclick = () => {
          favorites.splice(index, 1);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          renderFavorites();
        };
      })
      .catch(error => {
        console.error(error);
        const errorItem = document.createElement('div');
        errorItem.textContent = `Error loading weather for ${city}`;
        favoritesContainer.appendChild(errorItem);
      });
  });
}

// Add a new city
addButton.onclick = () => {
  const city = cityInput.value.trim();
  if (city && !favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    cityInput.value = '';
    renderFavorites();
  }
};

// Initial render of the list
renderFavorites();
