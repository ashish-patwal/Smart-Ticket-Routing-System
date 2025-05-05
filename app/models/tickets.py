from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class TicketBase(BaseModel):
    jiraId: str
    title: str
    description: Optional[str] = ""
    status: str
    priority: str
    assignedTeam: str
    components: List[str] = []
    labels: List[str] = []
    reporter: Optional[str] = "Unknown"

class TicketCreate(TicketBase):
    pass

class TicketUpdate(TicketBase):
    pass

class TicketInDB(TicketBase):
    id: str
    created: datetime
    updated: datetime

    class Config:
        orm_mode = True
