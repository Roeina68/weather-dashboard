export const handler = async (event) => {
  try {
    const city = event.queryStringParameters.city;
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=07ef2814216a40a5a1d133813243107&q=${city}`;

    const response = await fetch(apiUrl);
    const weatherData = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
      body: JSON.stringify(weatherData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
      body: JSON.stringify({ message: error.message }),
    };
  }
};
