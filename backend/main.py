from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine
import models
import schemas

# Create database tables if they do not exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vizhuthugal Dashboard API")

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def greet():
    return {
        "message": "Welcome to Vizhuthugal Dashboard API"
    }


# =========================================================
# EMPLOYEES API
# =========================================================

@app.post("/employees", response_model=schemas.EmployeeResponse)
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


@app.get("/employees", response_model=list[schemas.EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()


@app.get("/employees/{id}", response_model=schemas.EmployeeResponse)
def get_employee(id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@app.put("/employees/{id}", response_model=schemas.EmployeeResponse)
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


@app.delete("/employees/{id}")
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

@app.get("/attendance")
def get_attendance(db: Session = Depends(get_db)):
    records = db.query(models.Attendance).all()
    return {"data": records}


@app.post("/attendance", response_model=schemas.AttendanceResponse)
def add_attendance(
    data: schemas.AttendanceCreate,
    db: Session = Depends(get_db)
):
    attendance = models.Attendance(**data.model_dump())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


@app.put("/attendance/{id}")
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


@app.delete("/attendance/{id}")
def delete_attendance(id: int, db: Session = Depends(get_db)):
    attendance = db.query(models.Attendance).filter(models.Attendance.id == id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    db.delete(attendance)
    db.commit()
    return {"message": "Attendance Deleted"}



