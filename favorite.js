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
document.getElementById("clear-all-button").onclick = function () {
    // בודק אם יש ערים ברשימה
    if (favorites.length === 0) {
        alert("No cities in the favorites list!"); // הודעה אם אין ערים
    } else {
        // מנקה את רשימת הערים המועדפות ב-localStorage
        localStorage.removeItem("favorites");

        // מנקה את התצוגה של הערים המועדפות
        favoritesContainer.innerHTML = "";
    }
};

document.getElementById("clear-all-button").onclick = function () {
    // בודק אם יש ערים ברשימה
    if (favorites.length === 0) {
        alert("No cities in the favorites list!"); // הודעה אם אין ערים
    } else {
        // מנקה את רשימת הערים המועדפות ב-localStorage
        localStorage.removeItem("favorites");

        // מנקה את התצוגה של הערים המועדפות
        favoritesContainer.innerHTML = "";
    }
};
function renderFavorites() {
    favoritesContainer.innerHTML = ''; // Clear existing list
    favorites.forEach((city, index) => {
        fetchWeatherForCity(city)
            .then(data => {
                const temperature = data.current.temp_c;
                const description = data.current.condition.text.toLowerCase();
                const conditionIcon = data.current.condition.icon;

                // קביעת המחלקה לפי תנאי מזג האוויר
                let weatherClass = '';
                if (description.includes('sunny')) {
                    weatherClass = 'sunny';
                } else if (description.includes('partly cloudy')) {
                    weatherClass = 'partly-cloudy';
                } else if (description.includes('cloudy')) {
                    weatherClass = 'cloudy';
                } else if (description.includes('thunderstorm')) {
                    weatherClass = 'thunderstorm';
                } else if (description.includes('fog')) {
                    weatherClass = 'foggy';
                } else if (description.includes('wind')) {
                    weatherClass = 'windy';
                } else if (description.includes('rain')) {
                    weatherClass = 'rainy';
                } else if (description.includes('snow')) {
                    weatherClass = 'snowy';
                } else {
                    weatherClass = 'default'; // ברירת מחדל
                }

                // Create a new city box
                const cityBox = document.createElement('div');
                cityBox.classList.add('favorite-city-box', weatherClass); // הוספת המחלקה
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
// מקסימום ערים מותרות
const MAX_CITIES = 6;

addButton.onclick = () => {
  const city = cityInput.value.trim();

  // בדיקה אם רשימת הערים הגיעה למקסימום
  if (favorites.length >= MAX_CITIES) {
    alert(`You can only add up to ${MAX_CITIES} cities. Please remove a city before adding a new one.`);
    return; // יציאה מהפונקציה אם המספר המרבי הושג
  }

  // בדיקה אם העיר כבר ברשימה
  if (city && !favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    cityInput.value = ''; // איפוס השדה
    renderFavorites(); // עדכון התצוגה
  } else if (favorites.includes(city)) {
    alert(`${city} is already in your favorites.`);
  }
};


// Initial render of the list
renderFavorites();
