from fastapi import FastAPI, Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from schemas import EmployeeCreate
    
from database import SessionLocal, engine
import models
from models import Employee

from fastapi.middleware.cors import CORSMiddleware

# =====================================
# APP
# =====================================
app = FastAPI()


# =====================================
# CORS
# =====================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# CREATE TABLES
# =====================================

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# DB CONNECTION
# =====================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

# =========================================================
# EMPLOYEES API
# =========================================================

# CREATE
@app.post("/employees")
def create_employee(
    emp: EmployeeCreate,
    db: Session = Depends(get_db)
):
    employee = Employee(**emp.model_dump())

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return employee

# READ ALL
@app.get("/employees")
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

# READ ONE
@app.get("/employees/{id}")
def get_employee(id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == id).first()

    if not employee:
        raise HTTPException(404, "Employee not found")

    return employee

# UPDATE
@app.put("/employees/{id}")
def update_employee(
    id: int,
    emp: EmployeeCreate,
    db: Session = Depends(get_db)
):
    employee = db.query(Employee).filter(Employee.id == id).first()

    if not employee:
        raise HTTPException(404, "Employee not found")

    for key, value in emp.model_dump().items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)

    return employee

# DELETE
@app.delete("/employees/{id}")
def delete_employee(id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == id).first()

    if not employee:
        raise HTTPException(404, "Employee not found")

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted"}

# =========================================================
# ATTENDANCE API
# =========================================================

@app.get("/attendance")
def get_attendance(
    db: Session = Depends(get_db)
):

    return {
        "data":
        db.query(models.Attendance).all()
    }

@app.post("/attendance")
def add_attendance(
    data: dict,
    db: Session = Depends(get_db)
):

    attendance = models.Attendance(**data)

    db.add(attendance)

    db.commit()

    db.refresh(attendance)

    return attendance

@app.put("/attendance/{id}")
def update_attendance(
    id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    attendance = db.query(
        models.Attendance
    ).filter(
        models.Attendance.id == id
    ).first()

    if attendance:

        attendance.employee_name = data["employee_name"]

        attendance.check_in = data["check_in"]

        attendance.check_out = data["check_out"]

        attendance.work_done = data["work_done"]

        db.commit()

    return {
        "message":
        "Attendance Updated"
    }

@app.delete("/attendance/{id}")
def delete_attendance(
    id: int,
    db: Session = Depends(get_db)
):

    attendance = db.query(
        models.Attendance
    ).filter(
        models.Attendance.id == id
    ).first()

    if attendance:

        db.delete(attendance)

        db.commit()

    return {
        "message":
        "Attendance Deleted"
    }

# =========================================================
# CENTINARY CELEBRATION SCHOOL API
# =========================================================
@app.get("/ambassador-schools")
def get_ambassador_schools(
    db: Session = Depends(get_db)
):

    schools = db.query(
        models.AmbassadorSchool
    ).all()

    return schools

# =========================================================
# ADD SCHOOL
# =========================================================

@app.post("/ambassador-schools")
def add_ambassador_school(
    data: dict,
    db: Session = Depends(get_db)
):

    school = models.AmbassadorSchool(

        district=data.get(
            "district"
        ),

        block_name=data.get(
            "block_name"
        ),

        udise_code=data.get(
            "udise_code"
        ),

        school_name=data.get(
            "school_name"
        ),

        school_category=data.get(
            "school_category"
        ),

        management_category=data.get(
            "management_category"
        ),

        centenary_celebration_status=data.get(
            "centenary_celebration_status"
        ),

        celebration_date=data.get(
            "celebration_date"
        ),

        preparatory_meeting_conducted_status=data.get(
            "preparatory_meeting_conducted_status"
        ),

        organization_committee_formed_status=data.get(
            "organization_committee_formed_status"
        ),
    )

    db.add(school)

    db.commit()

    db.refresh(school)

    return school

# =========================================================
# UPDATE SCHOOL
# =========================================================

@app.put("/ambassador-schools/{id}")
def update_ambassador_school(
    id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    school = db.query(
        models.AmbassadorSchool
    ).filter(
        models.AmbassadorSchool.id == id
    ).first()

    if school:

        school.district = data.get("district")

        school.block_name = data.get("block_name")

        school.udise_code = data.get("udise_code")

        school.school_name = data.get("school_name")

        school.school_category = data.get("school_category")

        school.management_category = data.get(
            "management_category"
        )

        school.centenary_celebration_status = data.get(
            "centenary_celebration_status"
        )

        school.celebration_date = data.get(
            "celebration_date"
        )

        school.preparatory_meeting_conducted_status = data.get(
            "preparatory_meeting_conducted_status"
        )

        school.organization_committee_formed_status = data.get(
            "organization_committee_formed_status"
        )

        db.commit()

        db.refresh(school)

    return school

# =========================================================
# DELETE SCHOOL
# =========================================================

@app.delete("/ambassador-schools/{id}")
def delete_ambassador_school(
    id: int,
    db: Session = Depends(get_db)
):

    school = db.query(
        models.AmbassadorSchool
    ).filter(
        models.AmbassadorSchool.id == id
    ).first()

    if school:

        db.delete(school)

        db.commit()

    return {
        "message":
        "School Deleted"
    }


# =====================================
# SCHOOLS CRUD API
# =====================================

# =====================================
# GET ALL SCHOOLS
# =====================================

@app.get("/schools")
def get_all_schools(
    db: Session = Depends(get_db)
):

    schools = db.query(
        models.School
    ).all()

    return {
        "count": len(schools),
        "data": schools
    }


# =====================================
# GET SINGLE SCHOOL
# =====================================

@app.get("/schools/{id}")
def get_single_school(
    id: int,
    db: Session = Depends(get_db)
):

    school = db.query(
        models.School
    ).filter(
        models.School.id == id
    ).first()

    if not school:

        raise HTTPException(
            status_code=404,
            detail="School not found"
        )

    return {
        "data": school
    }


# =====================================
# CREATE SCHOOL
# =====================================

@app.post("/schools")
def create_school(
    data: dict,
    db: Session = Depends(get_db)
):

    new_school = models.School(

        district=data.get(
            "district"
        ),

        block_name=data.get(
            "block_name"
        ),

        udise_code=data.get(
            "udise_code"
        ),

        school_name=data.get(
            "school_name"
        ),

        school_category=data.get(
            "school_category"
        ),

        management_category=data.get(
            "management_category"
        ),

        centenary_celebration_status=data.get(
            "centenary_celebration_status"
        ),

        celebration_date=data.get(
            "celebration_date"
        ),

        preparatory_meeting_conducted_status=data.get(
            "preparatory_meeting_conducted_status"
        ),

        organization_committee_formed_status=data.get(
            "organization_committee_formed_status"
        )
    )

    db.add(new_school)

    db.commit()

    db.refresh(new_school)

    return {
        "message": "School created successfully",
        "data": new_school
    }


# =====================================
# UPDATE SCHOOL
# =====================================

@app.put("/schools/{id}")
def update_school(
    id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    school = db.query(
        models.School
    ).filter(
        models.School.id == id
    ).first()

    if not school:

        raise HTTPException(
            status_code=404,
            detail="School not found"
        )

    school.district = data.get(
        "district"
    )

    school.block_name = data.get(
        "block_name"
    )

    school.udise_code = data.get(
        "udise_code"
    )

    school.school_name = data.get(
        "school_name"
    )

    school.school_category = data.get(
        "school_category"
    )

    school.management_category = data.get(
        "management_category"
    )

    school.centenary_celebration_status = data.get(
        "centenary_celebration_status"
    )

    school.celebration_date = data.get(
        "celebration_date"
    )

    school.preparatory_meeting_conducted_status = data.get(
        "preparatory_meeting_conducted_status"
    )

    school.organization_committee_formed_status = data.get(
        "organization_committee_formed_status"
    )

    db.commit()

    db.refresh(school)

    return {
        "message": "School updated successfully",
        "data": school
    }


# =====================================
# DELETE SCHOOL
# =====================================

@app.delete("/schools/{id}")
def delete_school(
    id: int,
    db: Session = Depends(get_db)
):

    school = db.query(
        models.School
    ).filter(
        models.School.id == id
    ).first()

    if not school:

        raise HTTPException(
            status_code=404,
            detail="School not found"
        )

    db.delete(school)

    db.commit()

    return {
        "message": "School deleted successfully"
    }


# =====================================
# GET ALL
# =====================================

@app.get("/ambassador-schools")

def get_ambassador_schools(

    db: Session = Depends(get_db)

):

    schools = db.query(
        models.AmbassadorSchool
    ).all()

    return {
        "data": schools
    }


# =====================================
# GET SINGLE
# =====================================

@app.get("/ambassador-schools/{id}")

def get_single_ambassador_school(

    id: int,

    db: Session = Depends(get_db)

):

    school = db.query(
        models.AmbassadorSchool
    ).filter(

        models.AmbassadorSchool.id == id

    ).first()

    if not school:

        raise HTTPException(

            status_code=404,

            detail="School not found"

        )

    return school


# =====================================
# CREATE
# =====================================

@app.post("/ambassador-schools")

def create_ambassador_school(

    data: dict,

    db: Session = Depends(get_db)

):

    new_school = models.AmbassadorSchool(

        udise_code=data.get(
            "udise_code"
        ),

        district=data.get(
            "district"
        ),

        block=data.get(
            "block"
        ),

        school_name=data.get(
            "school_name"
        ),

        category_group=data.get(
            "category_group"
        ),

        status=data.get(
            "status"
        ),

        registration_status=data.get(
            "registration_status"
        )

    )

    db.add(new_school)

    db.commit()

    db.refresh(new_school)

    return {
        "message": "Created successfully",
        "data": new_school
    }


# =====================================
# UPDATE
# =====================================

@app.put("/ambassador-schools/{id}")

def update_ambassador_school(

    id: int,

    data: dict,

    db: Session = Depends(get_db)

):

    school = db.query(
        models.AmbassadorSchool
    ).filter(

        models.AmbassadorSchool.id == id

    ).first()

    if not school:

        raise HTTPException(

            status_code=404,

            detail="School not found"

        )

    school.udise_code = data.get(
        "udise_code"
    )

    school.district = data.get(
        "district"
    )

    school.block = data.get(
        "block"
    )

    school.school_name = data.get(
        "school_name"
    )

    school.category_group = data.get(
        "category_group"
    )

    school.status = data.get(
        "status"
    )

    school.registration_status = data.get(
        "registration_status"
    )

    db.commit()

    db.refresh(school)

    return {
        "message": "Updated successfully",
        "data": school
    }


# =====================================
# DELETE
# =====================================

@app.delete("/ambassador-schools/{id}")

def delete_ambassador_school(

    id: int,

    db: Session = Depends(get_db)

):

    school = db.query(
        models.AmbassadorSchool
    ).filter(

        models.AmbassadorSchool.id == id

    ).first()

    if not school:

        raise HTTPException(

            status_code=404,

            detail="School not found"

        )

    db.delete(school)

    db.commit()

    return {
        "message": "Deleted successfully"
    }
