from pydantic import BaseModel, field_validator
from typing import Optional, List, Any
import json

# =====================================
# AUTH SCHEMAS
# =====================================
class UserRegister(BaseModel):
    name: str
    phone: str
    email: str
    password: str
    role: str = "employee"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    role: str

    class Config:
        from_attributes = True


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


# =====================================
# CORE ENGAGEMENT SCHEMAS
# =====================================
class CoreEngagementCreate(BaseModel):
    district: str
    block: str
    school_name: str
    school_type: Optional[str] = None
    school_category: Optional[str] = None
    engagement_type: Optional[str] = None
    other_engagement_type: Optional[str] = None
    alumni_count: int = 0
    amount_collected: int = 0
    proof_files: Optional[List[Any]] = None
    important_attendees: Optional[str] = None
    remarks: Optional[str] = None
    entered_by: Optional[str] = None
    entered_time: Optional[str] = None

    @field_validator('proof_files', mode='before')
    @classmethod
    def parse_proof_files(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v

class CoreEngagementResponse(CoreEngagementCreate):
    id: int

    class Config:
        from_attributes = True


# =====================================
# CORE TEAM FORMATION SCHEMAS
# =====================================
class CoreTeamFormationCreate(BaseModel):
    district: str
    block: str
    school_name: str
    school_type: Optional[str] = None
    school_category: Optional[str] = None
    hm_supportive: str = "No"
    smc_alumni_support: str = "No"
    ambassador_alumni_support: str = "No"
    approach_taken: Optional[str] = None
    period_started: Optional[str] = None
    period_ended: Optional[str] = None
    core_team_count: int = 0
    core_team_status: Optional[str] = None
    core_team_platforms: Optional[List[Any]] = None  # JSON string
    other_platform: Optional[str] = None
    platform_link: Optional[str] = None
    risk_challenge: Optional[str] = None
    mitigation_taken: Optional[str] = None
    take_back: Optional[str] = None
    proof_files: Optional[List[Any]] = None  # JSON string
    media_content: Optional[str] = None
    celebrated_status: str = "No"
    entered_by: Optional[str] = None
    entered_time: Optional[str] = None

    @field_validator('core_team_platforms', 'proof_files', mode='before')
    @classmethod
    def parse_core_team_fields(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v

class CoreTeamFormationResponse(CoreTeamFormationCreate):
    id: int

    class Config:
        from_attributes = True


# =====================================
# SCHOOL COMMUNITY SCHEMAS
# =====================================
class SchoolCommunityCreate(BaseModel):
    district: str
    block: str
    school_name: str
    school_type: Optional[str] = None
    school_category: Optional[str] = None
    hm_supportive: str = "No"
    smc_alumni_count: int = 0
    ambassador_alumni_count: int = 0
    approach_taken: Optional[str] = None
    period_started: Optional[str] = None
    period_ended: Optional[str] = None
    mobilized_count: int = 0
    mobilized_status: Optional[str] = None
    alumni_group_platforms: Optional[List[Any]] = None  # JSON string
    other_platform: Optional[str] = None
    platform_link: Optional[str] = None
    risk_challenge: Optional[str] = None
    mitigation_taken: Optional[str] = None
    take_back: Optional[str] = None
    proof_files: Optional[List[Any]] = None  # JSON string
    media_content: Optional[str] = None
    celebrated_status: str = "No"
    entered_by: Optional[str] = None
    entered_time: Optional[str] = None

    @field_validator('alumni_group_platforms', 'proof_files', mode='before')
    @classmethod
    def parse_school_comm_fields(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v

class SchoolCommunityResponse(SchoolCommunityCreate):
    id: int

    class Config:
        from_attributes = True


# =====================================
# WHATSAPP ENGAGEMENT SCHEMAS
# =====================================
class WhatsAppEngagementCreate(BaseModel):
    school_name: str
    district: Optional[str] = None
    block: Optional[str] = None
    school_type: Optional[str] = None
    school_category: Optional[str] = None
    group_formed: str = "Yes"
    group_link: Optional[str] = None
    member_count: int = 0
    last_shared_message: Optional[str] = None
    last_shared_message_date: Optional[str] = None
    last_msg_responses: Optional[str] = None
    activity_status: Optional[str] = None
    changes_count: int = 0
    history_json: Optional[List[Any]] = None
    entered_by: Optional[str] = None
    entered_time: Optional[str] = None

    @field_validator('history_json', mode='before')
    @classmethod
    def parse_history_json(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v

class WhatsAppEngagementResponse(WhatsAppEngagementCreate):
    id: int

    class Config:
        from_attributes = True
