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

Setup Instructions

Prerequisites

An active AWS account.

Permissions to create S3, Lambda, API Gateway, DynamoDB, and SNS resources.

1. Uploading Frontend Files to S3

Sign in to the AWS Console.

Navigate to the AWS S3 Console.

Click Create bucket and configure the following:

Bucket name: weather-dashboard

Select your preferred Region.

Leave other settings as default and click Create bucket.

Upload all HTML, CSS, and JavaScript files to the bucket. Copy the entire weather-dashboard folder into the bucket while maintaining the directory structure. Ensure that index.html is outside the HTML folder, in its correct location.

Go to the Permissions tab:

Under Block public access settings, disable all restrictions and click Save.

Under Bucket Policy, add the necessary policy to allow public access.

Copy the Bucket URL from Static website hosting for later use.

2. Creating an Amplify Application and Deploying the Website (S3 Hosting)

Sign in to the AWS Console.

Navigate to the AWS Amplify Console.

Click New App → Deploy without Git.

Connect to S3:

Name the application weatherApp.

Select Amazon S3 and choose the previously created bucket.

Click Save and Deploy.

Once deployed, Amplify will provide a unique URL where the website is hosted.

3. Creating Lambda Functions

Navigate to the AWS Lambda Console.

Click Create function.

Select Author from scratch.

Name the function according to the provided Lambda functions in the lambdas folder (e.g., fetchWeather).

Choose the appropriate Runtime:

Python: python3.9

JavaScript: Use the latest Node.js version.

Click Create function.

Upload the function code:

If the folder contains node_modules or dependencies, upload it as a .zip file.

If there are no external dependencies, copy the function's code directly into the AWS editor (under the Code tab).

Under Permissions, ensure the function is assigned a role with sufficient permissions (use labRole).

Click Deploy.

Repeat these steps for all Lambda functions.

4. Linking Lambda Functions to API Gateway

For REST APIs (Logout, Weather Forecast API, weather-api):

Navigate to the AWS API Gateway Console.

Click Create API → REST API → Import.

Click Choose file and select the appropriate Swagger file from the APIGateways folder.

Under API endpoint type, select Edge-optimized.

Click Create API.

Go to the Stages tab, click Create, enter prod, and click Deploy.

For HTTP API (DynamoDB API):

Navigate to the AWS API Gateway Console.

Click Create API → HTTP API → Import.

Click Select an OpenAPI3 definition file.

Choose the appropriate OpenAPI file (OAS... file from APIGateways).

Click Create API.

Click Deploy.

5. Configuring DynamoDB

Navigate to the AWS DynamoDB Console.

Click Create Table.

Name the table UserPreferences.

Set the Partition Key to userid (Type: String).

Leave other settings as default and click Create Table.

6. Configuring SNS (User Notifications)

Navigate to the AWS SNS Console.

Click Create topic.

Select Standard and name the topic DailyBrief.

7. Final Checks and Testing

Ensure all services are properly linked.

Test API requests via API Gateway to verify responses.

Confirm the latest deployment is active in Amplify by redeploying:
(AWS Amplify -> weatherApp -> Deploy updates -> Amazon S3 -> Save and Deploy)

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

