from sqlalchemy import Column, Integer, String
from database import Base

# =====================================
# EMPLOYEES
# =====================================

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    contact = Column(String, nullable=False)
    department = Column(String, nullable=False)
    role = Column(String, nullable=False)
    joining_date = Column(String, nullable=False)

    
# =====================================
# ATTENDANCE
# =====================================

class Attendance(Base):

    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)

    employee_name = Column(String)

    check_in = Column(String)

    check_out = Column(String)

    work_done = Column(String)

# =====================================
# SCHOOLS
# =====================================

class School(Base):

    __tablename__ = "schools"

    id = Column(Integer, primary_key=True)

    district = Column(String)

    block_name = Column(String)

    udise_code = Column(String)

    school_name = Column(String)

    school_category = Column(String)

    management_category = Column(String)

    centenary_celebration_status = Column(String)

    celebration_date = Column(String)

    preparatory_meeting_conducted_status = Column(String)

    organization_committee_formed_status = Column(String)
    
# =====================================
# AAMBASSADOR SCHOOLS List
# =====================================

class AmbassadorSchool(Base):

    __tablename__ = "ambassador_schools"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    udise_code = Column(String)

    district = Column(String)

    block = Column(String)

    school_name = Column(String)

    category_group = Column(String)

    status = Column(String)

    registration_status = Column(String)

# =====================================
# 
# =====================================
