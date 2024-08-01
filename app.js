const apiUrl = "http://api.weatherapi.com/v1/current.json";
const apiKey = "?key=07ef2814216a40a5a1d133813243107";
const outputElement = document.getElementById("weather-output");

// Correctly assign the function to the button's onclick event
document.getElementById("submit").onclick = apiCall;

// Define the apiCall function
function apiCall() {
  // Reset city variable each time to avoid concatenation issues
  let city = "&q=" + document.getElementById("user-input").value;

  fetch(apiUrl + apiKey + city)
    .then(response => {
      // Handling possible errors
      if (!response.ok) {
        if (response.status == 400) {
          throw new Error("Bad request");
        } else if (response.status == 404) {
          throw new Error("Data not found");
        } else if (response.status == 500) {
          throw new Error("Server Error!");
        } else {
          throw new Error("Network response was not ok");
        }
      }
      return response.json();
    })
    // In case of success -> manipulating the data
    .then(data => {
      const temperature = data.current.temp_c;
      const description = data.current.condition.text;
      const location = data.location.name;
      outputElement.innerHTML = `<p>Temperature in ${location}: ${temperature}°C</p>
                                 <p>Weather: ${description}</p>`;
    })
    .catch(error => {
      console.error('Error:', error);
      outputElement.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}
