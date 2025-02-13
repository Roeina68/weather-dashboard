# AWS Weather App

## Overview
Check out the live version of the Weather App: Weather App on [AWS Amplify](https://staging.d1it4d6gxtu9ln.amplifyapp.com)

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

## Setup Instructions

### **Prerequisites**
- An active AWS account.
- Permissions to create S3, Lambda, API Gateway, DynamoDB, and SNS resources.

### **1. Uploading Frontend Files to S3**
1. Sign in to the AWS Console.
2. Navigate to the AWS S3 Console.
3. Click **Create bucket** and configure the following:
   - **Bucket name:** `weather-dashboard`
   - **Select your preferred Region**.
   - Leave other settings as default and click **Create bucket**.
4. Upload all HTML, CSS, and JavaScript files to the bucket:
   - Copy the entire `weather-dashboard` folder into the bucket while maintaining the directory structure.
   - Ensure that `index.html` is outside the `HTML` folder, in its correct location.
5. **Go to the Permissions tab:**
   - Under **Block public access settings**, disable all restrictions and click **Save**.
   - Under **Bucket Policy**, add the necessary policy to allow public access.
6. Copy the **Bucket URL** from **Static website hosting** for later use.

### **2. Creating an Amplify Application and Deploying the Website (S3 Hosting)**
1. Sign in to the AWS Console.
2. Navigate to the AWS Amplify Console.
3. Click **New App** → **Deploy without Git**.
4. **Connect to S3**:
   - Name the application **weatherApp**.
   - Select **Amazon S3** and choose the previously created bucket.
5. Click **Save and Deploy**.
   - Once deployed, Amplify will provide a unique URL where the website is hosted.

### **3. Creating Lambda Functions**
1. Navigate to the **AWS Lambda Console**.
2. Click **Create function**.
3. Select **Author from scratch**.
4. Name the function according to the provided Lambda functions in the `lambdas` folder (e.g., `fetchWeather`).
5. Choose the appropriate **Runtime**:
   - **Python:** `python3.9`
   - **JavaScript:** Use the latest Node.js version.
6. Click **Create function**.
7. **Upload the function code**:
   - If the folder contains `node_modules` or dependencies, upload it as a `.zip` file.
   - If there are no external dependencies, copy the function's code directly into the AWS editor (under the **Code** tab).
8. Under **Permissions**, ensure the function is assigned a role with sufficient permissions (use `labRole`).
9. Click **Deploy**.
10. Repeat these steps for all Lambda functions.

### **4. Linking Lambda Functions to API Gateway**
#### **For REST APIs (Logout, Weather Forecast API, weather-api):**
1. Navigate to the **AWS API Gateway Console**.
2. Click **Create API** → **REST API** → **Import**.
3. Click **Choose file** and select the appropriate Swagger file from the `APIGateways` folder.
4. Under **API endpoint type**, select **Edge-optimized**.
5. Click **Create API**.
6. Go to the **Stages** tab, click **Create**, enter `prod`, and click **Deploy**.

#### **For HTTP API (DynamoDB API):**
1. Navigate to the **AWS API Gateway Console**.
2. Click **Create API** → **HTTP API** → **Import**.
3. Click **Select an OpenAPI3 definition file**.
4. Choose the appropriate OpenAPI file (`OAS...` file from `APIGateways`).
5. Click **Create API**.
6. Click **Deploy**.

### **5. Configuring DynamoDB**
1. Navigate to the **AWS DynamoDB Console**.
2. Click **Create Table**.
3. Name the table **UserPreferences**.
4. Set the **Partition Key** to `userid` (Type: String).
5. Leave other settings as default and click **Create Table**.

### **6. Configuring SNS (User Notifications)**
1. Navigate to the **AWS SNS Console**.
2. Click **Create topic**
3. Select **Standard** and name the topic `DailyBrief`.

### **7. Final Checks and Testing**
- Ensure all services are properly linked.
- Test API requests via **API Gateway** to verify responses.
- Confirm the latest deployment is active in Amplify by redeploying:
  `(AWS Amplify -> weatherApp -> Deploy updates -> Amazon S3 -> Save and Deploy)`

## Credits
Developed by: Roei Nahary, Yael Abramovich, Noa Abramovich, and Yakir Mizrahi.
Data Source: [WeatherAPI.com](https://www.weatherapi.com/)

## License
This project is licensed under the MIT License.
