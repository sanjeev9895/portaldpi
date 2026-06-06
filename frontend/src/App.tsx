import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import DashboardLayout
  from './layouts/DashboardLayout';

import Dashboard
  from './pages/Dashboard';

import Employees
  from './pages/Employees';

import Reports
  from './pages/KPIS';

import Settings
  from './pages/Settings';

import Login
  from './pages/Login';

import Attendance
  from './pages/Attendance';

import Notifications
  from './pages/Notification';

import Register
  from './pages/Register';

import ForgotPassword
  from './pages/Forgotpassword';

import ProfileSettings
  from './pages/profile-settings';

import SecuritySettings
  from './pages/SecuritySettings';

import MentorshipTeam
  from './pages/mentorshipteam';

/* ===================================== */
/* COMMUNITY TEAM PAGES */
/* ===================================== */

import CommunityTeam
  from './pages/communityteam';
import CoreEngagement 
  from './pages/Coummity-Team/core-engagement';
import CoreTeamFormation
  from './pages/Coummity-Team/core-team-formation';
import WhatsappEngagement
   from './pages/Coummity-Team/whatsapp-engagement';
import SchoolCommunity
   from './pages/Coummity-Team/school-community';

export default function App() {

  return (

    <Routes>

      {/* ===================================== */}
      {/* AUTH */}
      {/* ===================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgotpassword"
        element={
          <ForgotPassword />
        }
      />

      {/* ===================================== */}
      {/* DEFAULT */}
      {/* ===================================== */}

      <Route

        path="/"

        element={
          <Navigate
            to="/login"
            replace
          />
        }

      />

      {/* ===================================== */}
      {/* DASHBOARD LAYOUT */}
      {/* ===================================== */}

      <Route
        element={<DashboardLayout />}
      >

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Employees */}

        <Route
          path="/employees"
          element={<Employees />}
        />

        {/* Attendance */}

        <Route
          path="/attendance"
          element={<Attendance />}
        />

        {/* Reports */}

        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* ===================================== */}
        {/* COMMUNITY TEAM */}
        {/* ===================================== */}

        <Route
          path="/communityteam"
          element={
            <CommunityTeam />
          }
        />

       
        {/* ===================================== */}
        {/* MENTORSHIP */}
        {/* ===================================== */}

        <Route
          path="/mentorshipteam"
          element={
            <MentorshipTeam />
          }
        />

        {/* ===================================== */}
        {/* SETTINGS */}
        {/* ===================================== */}

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/profile-settings"
          element={
            <ProfileSettings />
          }
        />

        <Route
          path="/notifications"
          element={
            <Notifications />
          }
        />

        <Route
        path="/core-engagement"
        element={
          <CoreEngagement />
          }
        />

        <Route 
          path="/core-team-formation"
          element={
            <CoreTeamFormation />
          }
        />

        <Route
          path="/whatsapp-engagement"
          element={
            <WhatsappEngagement />
          }
        />

        <Route
          path="/school-community"
          element={
            <SchoolCommunity />
          }
        />

        <Route
          path="/securitysettings"
          element={
            <SecuritySettings />
          }
        />

      </Route>

    </Routes>
  );
} 