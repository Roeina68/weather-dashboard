import boto3
import json

# AWS Clients
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
sns = boto3.client("sns", region_name="us-east-1")
lambda_client = boto3.client("lambda", region_name="us-east-1")

# Constants
TABLE_NAME = "UserPreferences"
SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:412597762399:DailyBrief"
WEATHER_API_FUNCTION_NAME = "getForecast"  # Replace with actual function name
def lambda_handler(event, context):
    """Fetches users' favorite cities, gets weather, and sends a daily email via SNS."""
    
    # Get all users from DynamoDB
    table = dynamodb.Table(TABLE_NAME)
    response = table.scan()  # Fetch all users
    users = response.get("Items", [])

    if not users:
        print("No users found in DynamoDB")
        return {"statusCode": 404, "body": "No users found"}

    weather_reports = []

    for user in users:
        print(f"Processing user: {user}")  # Debugging: Print the entire user object
        preferences = user.get("preferences", {})  # Extract preferences
        print(f"Extracted preferences: {preferences}")  # Debugging: Print preferences

       # ✅ Extract first favorite city safely
        favorite_cities = preferences.get("favoriteCities", [])
        print(f"Extracted favorite cities: {favorite_cities}")  # Debugging: Print favorite cities

        if not isinstance(favorite_cities, list) or not favorite_cities:
            print(f"Skipping user {user.get('userId', 'Unknown')} due to missing or invalid favorite cities.")
            continue

        first_city = favorite_cities[0]  # Directly take the first string from the list
        print(f"Extracted first city: {first_city}")  # Debugging: Print the first city

        if not isinstance(first_city, str) or not first_city.strip():
            print(f"Skipping user {user.get('userId', 'Unknown')} due to invalid city format.")
            continue

        # Fetch weather data
        weather_data = get_weather_for_city(first_city)
        print(f"Fetched weather data for {first_city}: {weather_data}")  # Debugging: Print weather data

        if not weather_data:
            print(f"Could not fetch weather for {first_city}, skipping.")
            continue

        # Generate Daily Brief
        email_body = generate_daily_brief(first_city, weather_data)
        print(f"Generated email body for {first_city}: {email_body}")  # Debugging: Print email body

        weather_reports.append(email_body)

    if not weather_reports:
        print("No weather reports generated, skipping email.")
        return {"statusCode": 204, "body": "No emails sent"}

    # Send Email via SNS
    send_email_via_sns("\n\n---\n\n".join(weather_reports))

    return {"statusCode": 200, "body": "Daily emails sent"}


def get_weather_for_city(city):
    """Calls Weather API Lambda to get weather data."""
    try:
        response = lambda_client.invoke(
            FunctionName=WEATHER_API_FUNCTION_NAME,
            Payload=json.dumps({"city": city, "days": 1}),
        )
        response_payload = json.loads(response["Payload"].read())
        return json.loads(response_payload["body"])  # Extract actual weather data
    except Exception as e:
        print(f"Failed to fetch weather data for {city}: {str(e)}")
        return None


def generate_daily_brief(city, data):
    """Formats the weather data into an email message."""
    forecast = data["forecast"]["forecastday"][0]
    condition = forecast["day"]["condition"]["text"]
    temp = forecast["day"]["avgtemp_c"]

    message = f"""
    🌞 **Your Daily Weather Brief for {city}** 🌞

    - **Condition:** {condition}
    - **Average Temperature:** {temp}°C

    📌 **Recommended Activities:**
    {get_recommendations(condition, temp)}
    
    Stay safe and enjoy your day!
    """
    return message


def get_recommendations(condition, temp):
    """Generates activity recommendations based on weather."""
    recommendations = []
    if "rain" in condition.lower():
        recommendations.append("- ☔ Stay indoors and read a book.")
        recommendations.append("- 🎮 Watch a movie.")
    elif "clear" in condition.lower():
        recommendations.append("- 🌳 Go hiking or for a walk.")
        recommendations.append("- 🧾 Have a picnic.")
    elif "snow" in condition.lower():
        recommendations.append("- ⛄ Build a snowman.")
        recommendations.append("- ⛷️ Try skiing.")
    if temp < 5:
        recommendations.append("- ❄️ Dress warmly!")
    if temp > 30:
        recommendations.append("- 🔥 Stay hydrated and avoid peak sun hours.")
    
    return "\n".join(recommendations)


def send_email_via_sns(message):
    """Publishes the daily brief to SNS, sending it to all subscribers."""
    try:
        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Message=message,
            Subject="Your Daily Weather Brief",
        )
        print(f"Daily brief sent to SNS topic {SNS_TOPIC_ARN}")
    except Exception as e:
        print(f"Failed to send email via SNS: {str(e)}")