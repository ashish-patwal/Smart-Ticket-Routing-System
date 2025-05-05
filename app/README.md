Ticket routing system
# Smart Ticket Routing API

FastAPI server that receives Jira webhooks, determines the appropriate team using ML, and updates Firebase.

## Setup

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

3. **Run the server**
   ```bash
   python main.py
   ```
   The server will run on port 8000 by default.

## Endpoints

- `GET /health` - Health check endpoint
- `POST /api/jira-webhook` - Webhook endpoint for Jira

## Deployment

### Using Docker

```bash
docker build -t smart-ticket-api .
docker run -p 8000:8000 -e FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/key.json smart-ticket-api
```

### Cloud Deployment Options

- Google Cloud Run
- Heroku
- AWS Lambda with API Gateway
```

## Running the FastAPI Server

To run the FastAPI server locally:

```bash
cd api
pip install -r requirements.txt
python main.py
