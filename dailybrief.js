const apiUrl = "http://api.weatherapi.com/v1/forecast.json";
const apiKey = "?key=07ef2814216a40a5a1d133813243107";
const inputSection = document.getElementById("input-section");
const forecastSection = document.getElementById("forecast-section");

document.getElementById("get-advice").onclick = getForecast;
document.getElementById("back-button").onclick = () => {
  forecastSection.style.display = "none";
  inputSection.style.display = "block";
};

function getForecast() {
  const city = "&q=" + document.getElementById("city-input").value.toLowerCase() + "&days=1";

  fetch(apiUrl + apiKey + city)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      updateForecast(data.forecast.forecastday[0]);
    })
    .catch(error => alert(`Error: ${error.message}`));
}

function updateForecast(forecast) {
  // הפקת נתוני מזג האוויר הכלליים
  const dailyCondition = forecast.day.condition.text.toLowerCase();
  const dailyTemp = forecast.day.avgtemp_c;

  // עדכון המלצות כלליות
  updateGeneralRecommendations(dailyTemp, dailyCondition);

  // עדכון תחזיות לבוקר, צהריים וערב
  const morning = forecast.hour[8];
  const afternoon = forecast.hour[14];
  const evening = forecast.hour[20];

  updateForecastTime("morning", morning);
  updateForecastTime("afternoon", afternoon);
  updateForecastTime("evening", evening);

  inputSection.style.display = "none";
  forecastSection.style.display = "block";
}

function updateGeneralRecommendations(temp, condition) {
  const recommendationsElement = document.getElementById("general-recommendations");
  
  // התחלה של ההמלצות
  let recommendations = `<p><b>General Weather:</b> ${condition}, Avg Temp: ${temp}°C</p>`;
  
  // ביגוד
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
  
  // פעילויות מומלצות
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
  
  // אזהרות
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

  // אם אין אזהרות, נוסיף הודעה מתאימה
  if (warnings === "") {
    warnings = "<p>No warnings for today. Enjoy your day!</p>";
  }
  
  recommendations += warnings;
  
  // עדכון ה-HTML
  recommendationsElement.innerHTML = recommendations;
}

function updateForecastTime(time, data) {
  // עדכון טמפרטורה
  document.getElementById(`${time}-temp`).textContent = `Temperature: ${data.temp_c}°C`;

  // יצירת אייקונים
  const iconsContainer = document.getElementById(`${time}-icons`);
  iconsContainer.innerHTML = generateIcons(data);
}

function generateIcons(data) {
  let iconsHTML = "";
  if (data.condition.text.toLowerCase().includes("rain")) {
    iconsHTML += '<img src="umbrella_icon.png" alt="Umbrella" title="Rainy day! Bring an umbrella.">';
    iconsHTML += '<img src="raincoat_icon.png" alt="Raincoat" title="Wear a waterproof coat.">';
  } else if (data.condition.text.toLowerCase().includes("clear")) {
    iconsHTML += '<img src="sunscreen_icon.png" alt="Sunscreen" title="Sunny day! Use sunscreen.">';
    iconsHTML += '<img src="hat_icon.png" alt="Hat" title="Wear a hat to stay cool.">';
  } else if (data.condition.text.toLowerCase().includes("snow")) {
    iconsHTML += '<img src="snowboots_icon.png" alt="Snow Boots" title="Wear snow boots to stay warm.">';
  }
  return iconsHTML;
}
