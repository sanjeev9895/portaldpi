import BackButton from '../components/BackButton'

export default function MentorshipTeam() {

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      {/* Back Button */}

      <div className="mb-6">

        <BackButton />

      </div>

      {/* Content */}

      <div className="flex items-center justify-center">

        <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 p-12 max-w-2xl w-full text-center">

          {/* Icon */}

          <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-8">

            <span className="text-5xl">

              🚀

            </span>

          </div>

          {/* Title */}

          <h1 className="text-4xl font-bold text-slate-800 mb-4">

            Mentorship Team

          </h1>

          {/* Subtitle */}

          <p className="text-xl text-slate-500 leading-relaxed">

            Coming Soon in Next Phase

          </p>

          {/* Description */}

          <p className="text-slate-400 mt-6 leading-7">

            We are currently building advanced mentorship features
            including mentor allocation, session tracking,
            student guidance management, and analytics dashboard.

          </p>

          {/* Status */}

          <div className="mt-10 inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-semibold">

            <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />

            Under Development

          </div>

        </div>

      </div>

    </div>
  )
}