from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from typing import Optional
from dotenv import load_dotenv
import json
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

from database import SessionLocal, engine
import models
import schemas
from seed import seed_database

# Create database tables if they do not exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Vizhuthugal Dashboard API",
    description="Backend API for Vizhuthugal Dashboard — Employees, Attendance, Alumni Community Registry & Core Team Formation",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vizhuthugal-dashboard.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Configure CORS middleware to allow the frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def serialize_db_payload(data_dict: dict) -> dict:
    # Ensure any list/dict fields are stored as JSON-serialized strings in database
    for key, value in list(data_dict.items()):
        if isinstance(value, (list, dict)):
            data_dict[key] = json.dumps(value)
    return data_dict


@app.get("/", tags=["Health"])
def greet():
    return {
        "message": "Welcome to Vizhuthugal Dashboard API"
    }


@app.post("/db/reset", tags=["Database"])
def reset_database_endpoint():
    """Clear all tables in the database and re-seed them with initial mock records."""
    try:
        seed_database()
        return {"status": "success", "message": "Database reset and seeded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset database: {str(e)}")


# =========================================================
# EMPLOYEES API
# =========================================================

@app.post("/employees", response_model=schemas.EmployeeResponse, tags=["Employees"])
def create_employee(
    emp: schemas.EmployeeCreate,
    db: Session = Depends(get_db)
):
    # Check if email already exists
    existing = db.query(models.Employee).filter(models.Employee.email == emp.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    employee = models.Employee(**emp.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@app.get("/employees", response_model=list[schemas.EmployeeResponse], tags=["Employees"])
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()


@app.get("/employees/{id}", response_model=schemas.EmployeeResponse, tags=["Employees"])
def get_employee(id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@app.put("/employees/{id}", response_model=schemas.EmployeeResponse, tags=["Employees"])
def update_employee(
    id: int,
    emp: schemas.EmployeeCreate,
    db: Session = Depends(get_db)
):
    employee = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    for key, value in emp.model_dump().items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return employee


@app.delete("/employees/{id}", tags=["Employees"])
def delete_employee(id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employee)
    db.commit()
    return {"message": "Employee deleted"}


# =========================================================
# ATTENDANCE API
# =========================================================

@app.get("/attendance", tags=["Attendance"])
def get_attendance(db: Session = Depends(get_db)):
    records = db.query(models.Attendance).all()
    return {"data": records}


@app.post("/attendance", response_model=schemas.AttendanceResponse, tags=["Attendance"])
def add_attendance(
    data: schemas.AttendanceCreate,
    db: Session = Depends(get_db)
):
    attendance = models.Attendance(**data.model_dump())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


@app.put("/attendance/{id}", tags=["Attendance"])
def update_attendance(
    id: int,
    data: schemas.AttendanceCreate,
    db: Session = Depends(get_db)
):
    attendance = db.query(models.Attendance).filter(models.Attendance.id == id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    for key, value in data.model_dump().items():
        setattr(attendance, key, value)

    db.commit()
    return {"message": "Attendance Updated"}


@app.delete("/attendance/{id}", tags=["Attendance"])
def delete_attendance(id: int, db: Session = Depends(get_db)):
    attendance = db.query(models.Attendance).filter(models.Attendance.id == id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    db.delete(attendance)
    db.commit()
    return {"message": "Attendance Deleted"}


# =========================================================
# ALUMNI COMMUNITY REGISTRY (School Community) API
# =========================================================

@app.post("/school-community", response_model=schemas.SchoolCommunityResponse, tags=["Alumni Community Registry"])
def create_school_community(
    data: schemas.SchoolCommunityCreate,
    db: Session = Depends(get_db)
):
    record = models.SchoolCommunity(**serialize_db_payload(data.model_dump()))
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.get("/school-community", response_model=list[schemas.SchoolCommunityResponse], tags=["Alumni Community Registry"])
def get_all_school_communities(
    district: Optional[str] = Query(None, description="Filter by district"),
    block: Optional[str] = Query(None, description="Filter by block"),
    db: Session = Depends(get_db)
):
    query = db.query(models.SchoolCommunity)
    if district:
        query = query.filter(models.SchoolCommunity.district == district)
    if block:
        query = query.filter(models.SchoolCommunity.block == block)
    return query.all()


@app.get("/school-community/{id}", response_model=schemas.SchoolCommunityResponse, tags=["Alumni Community Registry"])
def get_school_community(id: int, db: Session = Depends(get_db)):
    record = db.query(models.SchoolCommunity).filter(models.SchoolCommunity.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="School Community record not found")
    return record

    
@app.put("/school-community/{id}", response_model=schemas.SchoolCommunityResponse, tags=["Alumni Community Registry"])
def update_school_community(
    id: int,
    data: schemas.SchoolCommunityCreate,
    db: Session = Depends(get_db)
):
    record = db.query(models.SchoolCommunity).filter(models.SchoolCommunity.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="School Community record not found")

    for key, value in serialize_db_payload(data.model_dump()).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@app.delete("/school-community/{id}", tags=["Alumni Community Registry"])
def delete_school_community(id: int, db: Session = Depends(get_db)):
    record = db.query(models.SchoolCommunity).filter(models.SchoolCommunity.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="School Community record not found")

    db.delete(record)
    db.commit()
    return {"message": "School Community record deleted"}


# =========================================================
# ALUMNI CORE TEAM FORMATION API
# =========================================================

@app.post("/core-team-formation", response_model=schemas.CoreTeamFormationResponse, tags=["Alumni Core Team Formation"])
def create_core_team_formation(
    data: schemas.CoreTeamFormationCreate,
    db: Session = Depends(get_db)
):
    record_data = serialize_db_payload(data.model_dump())
    count = record_data.get("core_team_count", 0)
    record_data["core_team_status"] = "Formed" if count >= 25 else "Not Formed"

    record = models.CoreTeamFormation(**record_data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.get("/core-team-formation", response_model=list[schemas.CoreTeamFormationResponse], tags=["Alumni Core Team Formation"])
def get_all_core_team_formations(
    district: Optional[str] = Query(None, description="Filter by district"),
    block: Optional[str] = Query(None, description="Filter by block"),
    school_name: Optional[str] = Query(None, description="Search by school name"),
    db: Session = Depends(get_db)
):
    query = db.query(models.CoreTeamFormation)
    if district:
        query = query.filter(models.CoreTeamFormation.district == district)
    if block:
        query = query.filter(models.CoreTeamFormation.block == block)
    if school_name:
        query = query.filter(models.CoreTeamFormation.school_name.ilike(f"%{school_name}%"))
    return query.all()


@app.get("/core-team-formation/{id}", response_model=schemas.CoreTeamFormationResponse, tags=["Alumni Core Team Formation"])
def get_core_team_formation(id: int, db: Session = Depends(get_db)):
    record = db.query(models.CoreTeamFormation).filter(models.CoreTeamFormation.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Core Team Formation record not found")
    return record


@app.put("/core-team-formation/{id}", response_model=schemas.CoreTeamFormationResponse, tags=["Alumni Core Team Formation"])
def update_core_team_formation(
    id: int,
    data: schemas.CoreTeamFormationCreate,
    db: Session = Depends(get_db)
):
    record = db.query(models.CoreTeamFormation).filter(models.CoreTeamFormation.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Core Team Formation record not found")

    update_data = serialize_db_payload(data.model_dump())
    count = update_data.get("core_team_count", 0)
    update_data["core_team_status"] = "Formed" if count >= 25 else "Not Formed"

    for key, value in update_data.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@app.delete("/core-team-formation/{id}", tags=["Alumni Core Team Formation"])
def delete_core_team_formation(id: int, db: Session = Depends(get_db)):
    record = db.query(models.CoreTeamFormation).filter(models.CoreTeamFormation.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Core Team Formation record not found")

    db.delete(record)
    db.commit()
    return {"message": "Core Team Formation record deleted"}


# =========================================================
# ALUMNI CORE ENGAGEMENT API
# /core-engagements in API endpoints
# =========================================================

@app.post("/core-engagements", response_model=schemas.CoreEngagementResponse, tags=["Alumni Core Engagement"])
def create_core_engagement(
    data: schemas.CoreEngagementCreate,
    db: Session = Depends(get_db)
):
    record = models.CoreEngagement(**serialize_db_payload(data.model_dump()))
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.get("/core-engagements", response_model=list[schemas.CoreEngagementResponse], tags=["Alumni Core Engagement"])
def get_all_core_engagements(
    district: Optional[str] = Query(None, description="Filter by district"),
    block: Optional[str] = Query(None, description="Filter by block"),
    school_name: Optional[str] = Query(None, description="Search by school name"),
    db: Session = Depends(get_db)
):
    query = db.query(models.CoreEngagement)
    if district:
        query = query.filter(models.CoreEngagement.district == district)
    if block:
        query = query.filter(models.CoreEngagement.block == block)
    if school_name:
        query = query.filter(models.CoreEngagement.school_name.ilike(f"%{school_name}%"))
    return query.all()


@app.get("/core-engagements/{id}", response_model=schemas.CoreEngagementResponse, tags=["Alumni Core Engagement"])
def get_core_engagement(id: int, db: Session = Depends(get_db)):
    record = db.query(models.CoreEngagement).filter(models.CoreEngagement.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Core Engagement record not found")
    return record


@app.put("/core-engagements/{id}", response_model=schemas.CoreEngagementResponse, tags=["Alumni Core Engagement"])
def update_core_engagement(
    id: int,
    data: schemas.CoreEngagementCreate,
    db: Session = Depends(get_db)
):
    record = db.query(models.CoreEngagement).filter(models.CoreEngagement.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Core Engagement record not found")

    for key, value in serialize_db_payload(data.model_dump()).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@app.delete("/core-engagements/{id}", tags=["Alumni Core Engagement"])
def delete_core_engagement(id: int, db: Session = Depends(get_db)):
    record = db.query(models.CoreEngagement).filter(models.CoreEngagement.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Core Engagement record not found")

    db.delete(record)
    db.commit()
    return {"message": "Core Engagement record deleted"}


# =========================================================
# WHATSAPP ENGAGEMENT API
# /whatsapp-engagements in API endpoints
# =========================================================

@app.post("/whatsapp-engagements", response_model=schemas.WhatsAppEngagementResponse, tags=["WhatsApp Engagement"])
def create_whatsapp_engagement(
    data: schemas.WhatsAppEngagementCreate,
    db: Session = Depends(get_db)
):
    record = models.WhatsAppEngagement(**serialize_db_payload(data.model_dump()))
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.get("/whatsapp-engagements", response_model=list[schemas.WhatsAppEngagementResponse], tags=["WhatsApp Engagement"])
def get_all_whatsapp_engagements(
    district: Optional[str] = Query(None, description="Filter by district"),
    block: Optional[str] = Query(None, description="Filter by block"),
    school_name: Optional[str] = Query(None, description="Search by school name"),
    db: Session = Depends(get_db)
):
    query = db.query(models.WhatsAppEngagement)
    if district:
        query = query.filter(models.WhatsAppEngagement.district == district)
    if block:
        query = query.filter(models.WhatsAppEngagement.block == block)
    if school_name:
        query = query.filter(models.WhatsAppEngagement.school_name.ilike(f"%{school_name}%"))
    return query.all()


@app.get("/whatsapp-engagements/{id}", response_model=schemas.WhatsAppEngagementResponse, tags=["WhatsApp Engagement"])
def get_whatsapp_engagement(id: int, db: Session = Depends(get_db)):
    record = db.query(models.WhatsAppEngagement).filter(models.WhatsAppEngagement.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="WhatsApp Engagement record not found")
    return record


@app.put("/whatsapp-engagements/{id}", response_model=schemas.WhatsAppEngagementResponse, tags=["WhatsApp Engagement"])
def update_whatsapp_engagement(
    id: int,
    data: schemas.WhatsAppEngagementCreate,
    db: Session = Depends(get_db)
):
    record = db.query(models.WhatsAppEngagement).filter(models.WhatsAppEngagement.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="WhatsApp Engagement record not found")

    for key, value in serialize_db_payload(data.model_dump()).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@app.delete("/whatsapp-engagements/{id}", tags=["WhatsApp Engagement"])
def delete_whatsapp_engagement(id: int, db: Session = Depends(get_db)):
    record = db.query(models.WhatsAppEngagement).filter(models.WhatsAppEngagement.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="WhatsApp Engagement record not found")

    db.delete(record)
    db.commit()
    return {"message": "WhatsApp Engagement record deleted"}
