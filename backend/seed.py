import os
import sys

# Ensure backend directory is in the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from database import SessionLocal, engine, Base
import models

def seed_database():
    print("Initializing database tables...")
    # Ensure tables exist in target database (Supabase)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Clearing existing data from all tables (remove all)...")
        db.query(models.Attendance).delete()
        db.query(models.Employee).delete()
        db.query(models.CoreEngagement).delete()
        db.query(models.CoreTeamFormation).delete()
        db.query(models.SchoolCommunity).delete()
        db.query(models.WhatsAppEngagement).delete()
        db.query(models.User).delete()
        db.commit()
        print("Existing data removed successfully.")

        print("Seeding initial mock data (insert all)...")
        
        # 1. Seed Employees
        employees = [
            models.Employee(
                name="State Admin",
                email="admin@gmail.com",
                contact="9876543210",
                department="Management",
                role="Admin",
                joining_date="2026-06-01"
            ),
            models.Employee(
                name="Manager User",
                email="manager@gmail.com",
                contact="9876543211",
                department="Operations",
                role="Manager",
                joining_date="2026-06-01"
            ),
            models.Employee(
                name="Employee User",
                email="employee@gmail.com",
                contact="9876543212",
                department="Field Operations",
                role="Employee",
                joining_date="2026-06-01"
            )
        ]
        db.add_all(employees)
        db.commit()

        # 2. Seed Users
        users = [
            models.User(
                name="State Admin",
                phone="9876543210",
                email="admin@gmail.com",
                password_hash="admin1",
                role="admin"
            ),
            models.User(
                name="Manager User",
                phone="9876543211",
                email="manager@gmail.com",
                password_hash="manager1",
                role="manager"
            ),
            models.User(
                name="Employee User",
                phone="9876543212",
                email="employee@gmail.com",
                password_hash="employee1",
                role="employee"
            )
        ]
        db.add_all(users)
        db.commit()

        # 3. Seed Attendance Records
        attendance = [
            models.Attendance(
                employee_name="State Admin",
                check_in="2026-06-05 09:00:00",
                check_out="2026-06-05 18:00:00",
                work_done="Conducted planning and state level reviews."
            ),
            models.Attendance(
                employee_name="Manager User",
                check_in="2026-06-05 09:30:00",
                check_out="2026-06-05 17:30:00",
                work_done="Field coordination and school visits."
            ),
            models.Attendance(
                employee_name="Employee User",
                check_in="2026-06-05 09:15:00",
                check_out="2026-06-05 18:15:00",
                work_done="WhatsApp group engagement updates and support."
            )
        ]
        db.add_all(attendance)
        db.commit()

        # 4. Seed WhatsApp Group Engagements
        whatsapp_engagements = [
            models.WhatsAppEngagement(
                school_name="Govt Hr Sec School, Madurai",
                district="Madurai",
                block="Madurai East",
                school_type="High Sec School",
                school_category="Centinary School",
                group_formed="Yes",
                group_link="https://chat.whatsapp.com/GHSSAlumniMadurai2025",
                member_count=245,
                last_shared_message="Invitation for centenary fundraising meeting on June 15th.",
                last_shared_message_date="2026-06-01",
                last_msg_responses="12 members clicked join, 5 sent RSVPs directly.",
                activity_status="High",
                changes_count=0,
                history_json="[]",
                entered_by="Admin",
                entered_time="2026-06-01, 10:00:00 AM"
            ),
            models.WhatsAppEngagement(
                school_name="St. Mary's School, Trichy",
                district="Tiruchirappalli",
                block="Thiruverumbur",
                school_type="Middle School",
                school_category="Vetri Palligal School",
                group_formed="Yes",
                group_link="https://chat.whatsapp.com/StMarysAlumniTrichy",
                member_count=480,
                last_shared_message="Announced the new SMC mentoring session timetable.",
                last_shared_message_date="2026-06-02",
                last_msg_responses="22 members confirmed availability, 2 asked for rescheduling.",
                activity_status="High",
                changes_count=0,
                history_json="[]",
                entered_by="Manager",
                entered_time="2026-06-02, 11:30:00 AM"
            ),
            models.WhatsAppEngagement(
                school_name="Municipal Boys High School, Salem",
                district="Salem",
                block="Salem South",
                school_type="High School",
                school_category="Career Guidance",
                group_formed="No",
                group_link="https://chat.whatsapp.com/SalemBoysHighAlumni",
                member_count=0,
                last_shared_message="N/A - Group is being set up",
                last_shared_message_date="2026-06-03",
                last_msg_responses="N/A",
                activity_status="Low",
                changes_count=0,
                history_json="[]",
                entered_by="Karthik",
                entered_time="2026-06-03, 04:15:00 PM"
            )
        ]
        db.add_all(whatsapp_engagements)
        db.commit()

        # 5. Seed Core Engagements
        core_engagements = [
            models.CoreEngagement(
                district="Madurai",
                block="Madurai East",
                school_name="Govt Hr Sec School, Madurai",
                school_type="High Sec School",
                school_category="Centinary School",
                engagement_type="Alumni Meet",
                alumni_count=45,
                amount_collected=25000,
                proof_files="[]",
                important_attendees="District Collector, School Headmaster, SMC President",
                remarks="Discussed centenary celebration funding and sports ground expansion plans.",
                entered_by="Admin",
                entered_time="2026-06-01, 10:00:00 AM"
            ),
            models.CoreEngagement(
                district="Tiruchirappalli",
                block="Thiruverumbur",
                school_name="St. Joseph's Middle School",
                school_type="Middle School",
                school_category="Vetri Palligal School",
                engagement_type="Career Guidance Session",
                alumni_count=12,
                amount_collected=0,
                proof_files="[]",
                important_attendees="IT Professional Alumni Lead, local teachers",
                remarks="Interactive guidance on computer science careers for 8th-grade students.",
                entered_by="Manager",
                entered_time="2026-06-02, 11:30:00 AM"
            ),
            models.CoreEngagement(
                district="Salem",
                block="Salem South",
                school_name="Municipal Boys High School",
                school_type="High School",
                school_category="Career Guidance",
                engagement_type="Others",
                alumni_count=30,
                amount_collected=120000,
                proof_files="[]",
                important_attendees="Alumni Association President, local business sponsors",
                remarks="Raised funds to upgrade classroom projectors and install high-speed internet.",
                entered_by="Karthik",
                entered_time="2026-06-03, 04:15:00 PM"
            )
        ]
        db.add_all(core_engagements)
        db.commit()

        # 6. Seed School Communities
        school_communities = [
            models.SchoolCommunity(
                district="Madurai",
                block="Madurai East",
                school_name="Govt Hr Sec School, Madurai",
                school_type="High Sec School",
                school_category="Centinary School",
                hm_supportive="Yes",
                smc_alumni_count=15,
                ambassador_alumni_count=5,
                approach_taken="Direct HM visit",
                period_started="2026-05-01",
                period_ended="2026-05-15",
                mobilized_count=650,
                mobilized_status="Yes",
                alumni_group_platforms='["WhatsApp", "Telegram"]',
                other_platform="",
                platform_link="https://chat.whatsapp.com/GHSSAlumni2025",
                risk_challenge="Coordination with remote alumni",
                mitigation_taken="Assigned block leaders",
                take_back="Need regular updates",
                proof_files="[]",
                media_content="Inaugural event photos",
                celebrated_status="Yes",
                entered_by="State Admin",
                entered_time="2026-06-01, 10:00:00 AM"
            ),
            models.SchoolCommunity(
                district="Salem",
                block="Salem South",
                school_name="Municipal Boys High School",
                school_type="High School",
                school_category="Career Guidance",
                hm_supportive="Yes",
                smc_alumni_count=8,
                ambassador_alumni_count=3,
                approach_taken="SMC Meeting integration",
                period_started="2026-05-10",
                period_ended="2026-05-25",
                mobilized_count=65,
                mobilized_status="No",
                alumni_group_platforms='["Telegram"]',
                other_platform="",
                platform_link="https://t.me/sample-group",
                risk_challenge="Lack of coordinates",
                mitigation_taken="Checking register logs",
                take_back="Supportive HM",
                proof_files="[]",
                media_content="",
                celebrated_status="No",
                entered_by="Karthik",
                entered_time="2026-06-03, 04:15:00 PM"
            )
        ]
        db.add_all(school_communities)
        db.commit()

        # 7. Seed Core Team Formations
        core_team_formations = [
            models.CoreTeamFormation(
                district="Madurai",
                block="Madurai East",
                school_name="Govt Hr Sec School, Madurai",
                school_type="High Sec School",
                school_category="Centinary School",
                hm_supportive="Yes",
                smc_alumni_support="Yes",
                ambassador_alumni_support="Yes",
                approach_taken="Core group meeting",
                period_started="2026-05-15",
                period_ended="2026-05-30",
                core_team_count=28,
                core_team_status="Formed",
                core_team_platforms='["WhatsApp", "Telegram"]',
                other_platform="",
                platform_link="https://chat.whatsapp.com/sample-core-team",
                risk_challenge="Busy schedules",
                mitigation_taken="Weekend virtual syncs",
                take_back="Excited lead organizers",
                proof_files="[]",
                media_content="",
                celebrated_status="Yes",
                entered_by="State Admin",
                entered_time="2026-06-01, 10:00:00 AM"
            ),
            models.CoreTeamFormation(
                district="Tiruchirappalli",
                block="Thiruverumbur",
                school_name="St. Joseph's Middle School",
                school_type="Middle School",
                school_category="Vetri Palligal School",
                hm_supportive="No",
                smc_alumni_support="Yes",
                ambassador_alumni_support="No",
                approach_taken="Phone campaigning",
                period_started="2026-05-20",
                period_ended="2026-06-01",
                core_team_count=10,
                core_team_status="Not Formed",
                core_team_platforms='["WhatsApp"]',
                other_platform="",
                platform_link="",
                risk_challenge="HM hesitant to host meetups",
                mitigation_taken="SMC President hosted meetups",
                take_back="Strong local lead alumni",
                proof_files="[]",
                media_content="",
                celebrated_status="No",
                entered_by="Manager User",
                entered_time="2026-06-02, 11:30:00 AM"
            )
        ]
        db.add_all(core_team_formations)
        db.commit()

        print("Database seeded successfully with mock records.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
