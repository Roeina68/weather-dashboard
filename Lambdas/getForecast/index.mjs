import https from "https";

export const handler = async (event) => {
  try {
    console.log("Event received:", event); // Debug the event object
    const queryParams = event.queryStringParameters || {};
    console.log("Query String Parameters:", queryParams);

    // Extract city and days with defaults
    const city = queryParams.city ? decodeURIComponent(queryParams.city) : "Tel Aviv";
    const days = queryParams.days || 1;

    // Construct API URL
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=07ef2814216a40a5a1d133813243107&q=${encodeURIComponent(city)}&days=${days}`;
    console.log("Constructed API URL:", apiUrl);

    // Fetch weather data
    const weatherData = await new Promise((resolve, reject) => {
      https.get(apiUrl, (response) => {
        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => {
          try {
            const json = JSON.parse(data); // Ensure valid JSON response
            resolve(json);
          } catch (error) {
            reject(new Error(`Invalid JSON response: ${data}`)); // Handle invalid JSON
          }
        });
      }).on("error", (err) => {
        console.error("HTTP request error:", err.message);
        reject(err);
      });
    });

    // Return successful response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(weatherData),
    };
  } catch (error) {
    console.error("Error in Lambda function:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
