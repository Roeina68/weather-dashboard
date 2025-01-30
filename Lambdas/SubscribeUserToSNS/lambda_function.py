import boto3

# AWS Clients
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("UsersTable")  # Replace with your table name

def lambda_handler(event, context):
    """Triggered when a user confirms their email in Cognito"""

    print("Received Cognito Post Confirmation event:", event)

    # Extract user email and ID from Cognito event
    user_email = event.get('request', {}).get('userAttributes', {}).get('email')
    user_id = event.get('userName')  # Unique Cognito user ID

    if not user_email:
        print("No email found, skipping storage.")
        return event

    # Store user email in DynamoDB
    store_user_email(user_id, user_email)

    return event  # Always return the event to allow Cognito to proceed

def store_user_email(user_id, email):
    """Stores user email in DynamoDB with an empty favoriteCities list"""
    try:
        table.put_item(
            Item={
                "userId": user_id,   # Primary Key (Cognito User ID)
                "email": email,       # User Email
                "preferences": {
                    "favoriteCities": {"L": []}  # Empty list initially
                }
            }
        )
        print(f"Stored {email} in DynamoDB with empty favoriteCities list")
    except Exception as e:
        print(f"Failed to store email in DynamoDB: {str(e)}")
