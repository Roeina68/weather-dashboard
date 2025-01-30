import AWS from "aws-sdk"; // Use `import` instead of `require`

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "UserPreferences";

export const handler = async (event) => {
  try {
    const requestData = JSON.parse(event.body); // Parse request payload
    const { userId, preferences } = requestData;

    if (!userId || !preferences || !preferences.favoriteCities) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing userId or favorites list" }),
      };
    }

    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId: userId, // Unique user identifier
        preferences: preferences,
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Favorites saved successfully!" }),
    };
  } catch (error) {
    console.error("Error saving preferences:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to save favorites" }),
    };
  }
};
