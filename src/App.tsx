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
from './pages/Reports';

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

import NotificationSettings
from './pages/NotificationSettings';

import SecuritySettings
from './pages/SecuritySettings';

import MentorshipTeam
from './pages/mentorshipteam';

/* ===================================== */
/* COMMUNITY TEAM PAGES */
/* ===================================== */

import CommunityTeam
from './pages/communityteam';

import Centinary
from './pages/communityteam/centinary';

import Smc
from './pages/communityteam/Smc';

import Ambassador
from './pages/communityteam/Ambassador';

import CareerGuidance
from './pages/communityteam/CareerGuidance';

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

        <Route
          path="/communityteam/centinary"
          element={<Centinary />}
        />

        <Route
          path="/communityteam/smc"
          element={<Smc />}
        />

        <Route
          path="/communityteam/ambassador"
          element={<Ambassador />}
        />

        <Route
          path="/communityteam/careerguidance"
          element={
            <CareerGuidance />
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
          path="/notificationsettings"
          element={
            <NotificationSettings />
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