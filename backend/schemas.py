from pydantic import BaseModel

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