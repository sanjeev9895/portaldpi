from sqlalchemy import Column, Integer, String, Text
from database import Base

# =====================================
# USERS (Auth)
# =====================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="employee")


# =====================================
# EMPLOYEES
# =====================================

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    contact = Column(String(50), nullable=False)
    department = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    joining_date = Column(String(50), nullable=False)


# =====================================
# ATTENDANCE
# =====================================

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String(255))
    check_in = Column(String(100))
    check_out = Column(String(100))
    work_done = Column(Text)


# =====================================
# CORE ENGAGEMENT
# =====================================

class CoreEngagement(Base):
    __tablename__ = "core_engagements"

    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(100), nullable=False)
    block = Column(String(100), nullable=False)
    school_name = Column(String(255), nullable=False)
    school_type = Column(String(100))
    school_category = Column(String(100))
    engagement_type = Column(String(100))
    other_engagement_type = Column(String(255), nullable=True)
    alumni_count = Column(Integer, default=0)
    amount_collected = Column(Integer, default=0)
    proof_files = Column(Text, nullable=True)  # Store multiple files as JSON string
    important_attendees = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)
    entered_by = Column(String(255), nullable=True)
    entered_time = Column(String(100), nullable=True)


# =====================================
# CORE TEAM FORMATION
# =====================================

class CoreTeamFormation(Base):
    __tablename__ = "core_team_formations"

    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(100), nullable=False)
    block = Column(String(100), nullable=False)
    school_name = Column(String(255), nullable=False)
    school_type = Column(String(100))
    school_category = Column(String(100))
    hm_supportive = Column(String(10), default="No")
    smc_alumni_support = Column(String(10), default="No")
    ambassador_alumni_support = Column(String(10), default="No")
    approach_taken = Column(String(255))
    period_started = Column(String(50))
    period_ended = Column(String(50))
    core_team_count = Column(Integer, default=0)
    core_team_status = Column(String(50))
    core_team_platforms = Column(Text)  # JSON string of platforms list
    other_platform = Column(String(255), nullable=True)
    platform_link = Column(String(500))
    risk_challenge = Column(Text)
    mitigation_taken = Column(Text)
    take_back = Column(Text)
    proof_files = Column(Text)  # JSON string of proof files
    media_content = Column(Text)
    celebrated_status = Column(String(10), default="No")
    entered_by = Column(String(255), nullable=True)
    entered_time = Column(String(100), nullable=True)


# =====================================
# SCHOOL COMMUNITY
# =====================================

class SchoolCommunity(Base):
    __tablename__ = "school_communities"

    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(100), nullable=False)
    block = Column(String(100), nullable=False)
    school_name = Column(String(255), nullable=False)
    school_type = Column(String(100))
    school_category = Column(String(100))
    hm_supportive = Column(String(10), default="No")
    smc_alumni_count = Column(Integer, default=0)
    ambassador_alumni_count = Column(Integer, default=0)
    approach_taken = Column(String(255))
    period_started = Column(String(50))
    period_ended = Column(String(50))
    mobilized_count = Column(Integer, default=0)
    mobilized_status = Column(String(10))
    alumni_group_platforms = Column(Text)  # JSON string
    other_platform = Column(String(255), nullable=True)
    platform_link = Column(String(500))
    risk_challenge = Column(Text)
    mitigation_taken = Column(Text)
    take_back = Column(Text)
    proof_files = Column(Text)  # JSON string
    media_content = Column(Text)
    celebrated_status = Column(String(10), default="No")
    entered_by = Column(String(255), nullable=True)
    entered_time = Column(String(100), nullable=True)


# =====================================
# WHATSAPP ENGAGEMENT
# =====================================

class WhatsAppEngagement(Base):
    __tablename__ = "whatsapp_engagements"

    id = Column(Integer, primary_key=True, index=True)
    school_name = Column(String(255), nullable=False)
    district = Column(String(100), nullable=True)
    block = Column(String(100), nullable=True)
    school_type = Column(String(100))
    school_category = Column(String(100))
    group_formed = Column(String(10), default="Yes")
    group_link = Column(String(500))
    member_count = Column(Integer, default=0)
    last_shared_message = Column(Text, nullable=True)
    last_shared_message_date = Column(String(50), nullable=True)
    last_msg_responses = Column(Text, nullable=True)
    activity_status = Column(String(50))
    changes_count = Column(Integer, default=0)
    history_json = Column(Text, nullable=True)  # JSON representation of history log
    entered_by = Column(String(255), nullable=True)
    entered_time = Column(String(100), nullable=True)
