import boto3

# AWS Clients
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
sns = boto3.client("sns", region_name="us-east-1")

# AWS Resources
table = dynamodb.Table("UserPreferences")
SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:412597762399:DailyBrief"

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

    # Subscribe user to SNS Topic
    subscribe_user_to_sns(user_email)

    return event  # Always return the event to allow Cognito to proceed

def store_user_email(user_id, email):
    """Stores user email in DynamoDB with tel-aviv as default favorite city"""
    try:
        table.put_item(
            Item={
                "userId": user_id,   # Primary Key (Cognito User ID)
                "email": email,       # User Email
                "preferences": {
                    "favoriteCities": {"L": ['Tel-aviv']}  # Sets default city to 'Tel-Aviv'
                }
            }
        )
        print(f"Stored {email} in DynamoDB with empty favoriteCities list")
    except Exception as e:
        print(f"Failed to store email in DynamoDB: {str(e)}")

def subscribe_user_to_sns(email):
    """Subscribes a user to the SNS topic for daily weather updates."""
    try:
        response = sns.subscribe(
            TopicArn=SNS_TOPIC_ARN,
            Protocol="email",
            Endpoint=email
        )
        print(f"Subscribed {email} to SNS topic {SNS_TOPIC_ARN}")
    except Exception as e:
        print(f"Failed to subscribe {email} to SNS: {str(e)}")
