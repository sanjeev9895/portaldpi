from fastapi import FastAPI, Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import SessionLocal, engine
import models

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

@app.get("/employees")
def get_employees(
    db: Session = Depends(get_db)
):

    return db.query(
        models.Employee
    ).all()

@app.post("/employees")
def add_employee(
    data: dict,
    db: Session = Depends(get_db)
):

    employee = models.Employee(**data)

    db.add(employee)

    db.commit()

    db.refresh(employee)

    return employee

@app.put("/employees/{id}")
def update_employee(
    id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    employee = db.query(
        models.Employee
    ).filter(
        models.Employee.id == id
    ).first()

    if employee:

        employee.name = data["name"]
        employee.email = data["email"]
        employee.phone = data["phone"]
        employee.department = data["department"]
        employee.role = data["role"]
        employee.joining_date = data["joining_date"]

        db.commit()

    return {
        "message":
        "Employee Updated"
    }

@app.delete("/employees/{id}")
def delete_employee(
    id: int,
    db: Session = Depends(get_db)
):

    employee = db.query(
        models.Employee
    ).filter(
        models.Employee.id == id
    ).first()

    if employee:

        db.delete(employee)

        db.commit()

        db.execute(text("""
        SELECT setval(
            'employees_id_seq',
            COALESCE((SELECT MAX(id) FROM employees), 1)
        )
        """))

        db.commit()

    return {
        "message":
        "Employee Deleted"
    }

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

@app.get("/schools")
def get_schools(
    db: Session = Depends(get_db)
):

    schools = db.query(
        models.School
    ).all()

    return {
        "data":
        schools
    }

# =========================================================
# ADD SCHOOL
# =========================================================

@app.post("/schools")
def add_school(
    data: dict,
    db: Session = Depends(get_db)
):

    school = models.School(

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

    if school:

        db.delete(school)

        db.commit()

    return {
        "message":
        "School Deleted"
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