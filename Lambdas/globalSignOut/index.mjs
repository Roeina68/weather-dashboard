const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const { accessToken } = JSON.parse(event.body); // Expect accessToken from the request body

  try {
    // Sign the user out globally
    await cognito.globalSignOut({ AccessToken: accessToken }).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",  // Allow requests from any origin
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({ message: 'User signed out successfully' }),
    };
  } catch (error) {
    console.error('Error during logout:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({ message: 'Failed to sign out', error }),
    };
  }
};
