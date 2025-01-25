const apiUrl = "https://api.weatherapi.com/v1/current.json";
const apiKey = "?key=07ef2814216a40a5a1d133813243107";

const addButton = document.getElementById('add-button');
const cityInput = document.getElementById('add-city');
const favoritesContainer = document.getElementById('favorites-container');

const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch weather for a city
function fetchWeatherForCity(city) {
  return fetch(`${apiUrl}${apiKey}&q=${encodeURIComponent(city)}`)
    .then(response => {
      if (!response.ok) throw new Error(`Unable to fetch weather for ${city}`);
      return response.json();
    });
}

// Render favorites
function renderFavorites() {
  favoritesContainer.innerHTML = '<p>Loading your favorite cities...</p>';
  Promise.all(
    favorites.map((city, index) =>
      fetchWeatherForCity(city)
        .then(data => {
          const { temp_c: temperature, condition: { text: description, icon: conditionIcon } } = data.current;
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
          cityBox.querySelector('.remove-button').onclick = () => {
            favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
          };
          return cityBox;
        })
        .catch(error => {
          console.error(error);
          const errorItem = document.createElement('div');
          errorItem.textContent = `Error loading weather for ${city}`;
          return errorItem;
        })
    )
  ).then(elements => {
    favoritesContainer.innerHTML = '';
    elements.forEach(element => favoritesContainer.appendChild(element));
  });
}

// Add city
addButton.onclick = async () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  if (favorites.includes(city)) {
    alert("City is already in the favorites list.");
    return;
  }

  try {
    await fetchWeatherForCity(city); // Validate city
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    cityInput.value = '';
    renderFavorites();
  } catch (error) {
    alert(`Unable to add city: ${city}. Please check the city name.`);
    console.error(error);
  }
};

// Clear all cities
document.getElementById("clear-all-button").onclick = () => {
  if (favorites.length === 0) {
    alert("No cities in the favorites list!");
  } else {
    localStorage.removeItem("favorites");
    favorites.length = 0;
    renderFavorites();
  }
};

// Initial render
renderFavorites();
