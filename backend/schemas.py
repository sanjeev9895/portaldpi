from pydantic import BaseModel
from typing import Optional

# =====================================
# EMPLOYEES SCHEMAS
# =====================================

class EmployeeCreate(BaseModel):
    name: str
    email: str
    contact: str
    department: str
    role: str
    joining_date: str

class EmployeeResponse(EmployeeCreate):
    id: int

    class Config:
        from_attributes = True

# =====================================
# ATTENDANCE SCHEMAS
# =====================================

class AttendanceCreate(BaseModel):
    employee_name: str
    check_in: str
    check_out: Optional[str] = None
    work_done: Optional[str] = None

class AttendanceResponse(AttendanceCreate):
    id: int

    class Config:
        from_attributes = True
