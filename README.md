# AWS Weather App 

## Overview
The Weather App provides real-time weather updates for cities worldwide. Users can search for specific locations or view weather conditions for top cities in their country. The app offers temperature, humidity, wind speed, and condition details, along with recommendations based on weather conditions.

## Features
- **Live Weather Data**: Fetches current weather data from an external API.
- **Top Cities Display**: Automatically detects the user's country and displays weather data for major cities.
- **Search Functionality**: Allows users to search for weather conditions in any city worldwide.
- **User Authentication**: Supports login and logout functionality.
- **Custom Weather Recommendations**: Provides activity and clothing suggestions based on weather conditions.
- **Real-Time Clock**: Displays the current time.
- **Interactive UI**: Includes a sidebar navigation menu.

## Technologies Used
- **JavaScript**: Core functionality and API interactions.
- **HTML & CSS**: User interface and styling.
- **WeatherAPI.com**: Provides real-time weather data.
- **IPInfo.io**: Determines user location based on IP.
- **AWS Lambda & API Gateway**: Backend services for data processing.
- **Session Storage**: Manages user authentication states.

## Installation & Usage
### Prerequisites
- A web browser (Chrome, Firefox, Edge, etc.)
- Internet connection

### Steps
1. Clone or download the project files.
2. Open `index.html` in a browser.
3. Allow location access for country-based city suggestions.
4. Enter a city name and click "Submit" to fetch weather details.
5. Use the sidebar navigation to access additional features.
6. Login to personalize preferences (if required).

## API Usage
### Fetch Weather Data
```
GET https://vydb4aacbj.execute-api.us-east-1.amazonaws.com/prod/weather?city={CITY_NAME}
```
### Get User Location
```
GET https://ipinfo.io/json?token={IPINFO_TOKEN}
```
### User Authentication
```
POST https://19r0w8n9jc.execute-api.us-east-1.amazonaws.com/prod/logout
```

## File Structure
```
weather-dashboard/
│── CSS/
│   ├── callback.css       # Styling for authentication callback page
│   ├── style.css          # Main styles for the application
│
│── HTML/
│   ├── callback.html      # Handles authentication redirects
│   ├── DailyBrief.html    # Displays daily weather recommendations
│   ├── favorite.html      # Manages user-favorite cities
│
│── JS/
│   ├── callback.js        # Handles OAuth login callbacks
│   ├── config.js          # Configuration settings (API keys, etc.)
│   ├── dailybrief.js      # Logic for daily weather brief
│   ├── favorite.js        # Handles user-favorite city management
│   ├── index.js           # Main script for fetching weather data
│
│── Lambdas/               # AWS Lambda functions (not included in repo)
│── node_modules/          # Dependencies (ignored in version control)
│── pics/                  # Image assets for the app
│── .gitignore             # Ignore unnecessary files in Git
│── index.html             # Main entry point of the application
│── package.json           # Dependencies and project metadata
│── package-lock.json      # Lockfile for npm dependencies
│── README.md              # Project documentation

```

## Credits
Developed by: Roei Nahary, Yael Abramovich, Noa Abramovich and Yakir Mizrahi.  
Data Source: [WeatherAPI.com](https://www.weatherapi.com/)

## License
This project is licensed under the MIT License.

