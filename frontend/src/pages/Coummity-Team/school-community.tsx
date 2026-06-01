import {
  Settings as SettingsIcon,
  Clock,
} from "lucide-react";

import BackButton from "../../components/BackButton";

export default function SchoolCommunity() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Back Button */}
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="flex items-center justify-center min-h-[80vh]">

        <div className="bg-white rounded-3xl shadow-lg p-12 max-w-lg w-full text-center">

          <div className="w-24 h-24 mx-auto rounded-3xl bg-blue-100 flex items-center justify-center mb-6">
            <SettingsIcon
              size={50}
              className="text-blue-600"
            />
          </div>

          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            School Community
          </h1>

          <p className="text-slate-500 text-lg mb-8">
            This module will be available in
            Phase 2.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">

            <div className="flex items-center justify-center gap-3 text-slate-600">

              <Clock size={22} />

              <span className="font-semibold">
                Coming Soon
              </span>

            </div>

            <p className="text-sm text-slate-400 mt-3">
              User Management, Roles &
              Permissions, System Settings,
              Notifications, Security and more.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}