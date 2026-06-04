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
