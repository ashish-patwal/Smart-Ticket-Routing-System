from fastapi import APIRouter, Request, HTTPException, Depends
from app.firebase_config import db
from app.services.team_assignment import team_assignment_model
from firebase_admin import firestore
import logging

router = APIRouter(prefix="/api", tags=["jira"])

@router.post("/jira-webhook")
async def jira_webhook(request: Request):
    try:
        # Parse the webhook payload
        jira_event = await request.json()
        
        # Check if this is a relevant event (issue created/updated)
        if jira_event.get("webhookEvent") in ["jira:issue_created", "jira:issue_updated"]:
            issue = jira_event.get("issue", {})
            fields = issue.get("fields", {})
            
            # Extract data for team assignment
            ticket_data = {
                "title": fields.get("summary", ""),
                "description": fields.get("description", ""),
                "components": [c.get("name") for c in fields.get("components", [])],
                "labels": fields.get("labels", [])
            }
            
            # Use the model to determine the team
            assigned_team = team_assignment_model.predict(ticket_data)
            
            # Transform Jira ticket to our format
            ticket = {
                "jiraId": issue.get("key"),
                "title": fields.get("summary", ""),
                "description": fields.get("description", ""),
                "status": fields.get("status", {}).get("name", "Open"),
                "priority": fields.get("priority", {}).get("name", "Medium"),
                "assignedTeam": assigned_team,
                "components": [c.get("name") for c in fields.get("components", [])],
                "labels": fields.get("labels", []),
                "reporter": fields.get("reporter", {}).get("displayName", "Unknown"),
                "created": firestore.SERVER_TIMESTAMP,
                "updated": firestore.SERVER_TIMESTAMP
            }
            
            # Check if this ticket already exists in our system
            tickets_ref = db.collection("tickets")
            query = tickets_ref.where("jiraId", "==", issue.get("key")).limit(1)
            docs = list(query.stream())
            
            if docs:
                # Update existing ticket
                doc_id = docs[0].id
                tickets_ref.document(doc_id).update({
                    **ticket,
                    "updated": firestore.SERVER_TIMESTAMP
                })
                logging.info(f"Updated ticket {issue.get('key')} in Firebase")
            else:
                # Add new ticket
                tickets_ref.add(ticket)
                logging.info(f"Added new ticket {issue.get('key')} to Firebase")
            
            return {"success": True, "message": "Ticket processed successfully"}
        else:
            return {"success": True, "message": "Event ignored - not relevant"}
            
    except Exception as e:
        logging.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
