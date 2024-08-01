const apiUrl = "http://api.weatherapi.com/v1/current.json"
const apiKey = "07ef2814216a40a5a1d133813243107"

const outputElement = document.getElementById('weather-output');

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const location = data.name;
    outputElement.innerHTML = `<p>Temperature in ${location}: ${temperature}°C</p>
                               <p>Weather: ${description}</p>`;
  })
  .catch(error => {
    console.error('Error:', error);
  });