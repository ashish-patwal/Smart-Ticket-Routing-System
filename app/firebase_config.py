import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Path to service account key file
service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")

# Initialize Firebase
if not firebase_admin._apps:
    if os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    else:
        # For environments where service account is provided as JSON string (like Heroku)
        import json
        service_account_info = json.loads(os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "{}"))
        if service_account_info:
            cred = credentials.Certificate(service_account_info)
            firebase_admin.initialize_app(cred)
        else:
            raise Exception("Firebase credentials not found")

# Get Firestore client
db = firestore.client()
