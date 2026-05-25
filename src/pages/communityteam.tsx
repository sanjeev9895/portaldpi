import {
  Users,
  Sparkles,
  GraduationCap,
  Briefcase,
  School,
  Film,
  UserPlus,
  BriefcaseBusiness,
  BookOpen,

} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import BackButton from "../components/BackButton";


export default function CommunityTeam() {

  const navigate =
    useNavigate();

  /* ===================================== */
  /* CARDS */
  /* ===================================== */

 const modules = [

  {
    title: 'Centinary Celebration',
    description:
      'Manage school celebration activities and reports.',
    icon: <Sparkles size={38} />,
    color: 'from-pink-500 to-rose-500',
    path: '/communityteam/centinary',
  },

  {
    title: 'SMC',
    description:
      'School Management Committee reports and activities.',
    icon: <Users size={38} />,
    color: 'from-blue-500 to-cyan-500',
    path: '/communityteam/smc',
  },

  {
    title: 'Ambassador',
    description:
      'Track ambassador programs and student engagement.',
    icon: <GraduationCap size={38} />,
    color: 'from-violet-500 to-purple-500',
    path: '/communityteam/ambassador',
  },

  {
    title: 'Career Guidance',
    description:
      'Career sessions and mentorship management.',
    icon: <Briefcase size={38} />,
    color: 'from-emerald-500 to-green-500',
    path: '/communityteam/careerguidance',
  },

  {
    title: 'ACIS',
    description:
      'ACIS program monitoring and reports.',
    icon: <School size={38} />,
    color: 'from-orange-500 to-amber-500',
    path: '/communityteam/acis',
  },

  {
    title: 'Movie Screening',
    description:
      'Movie screening activities and schedules.',
    icon: <Film size={38} />,
    color: 'from-red-500 to-pink-500',
    path: '/communityteam/moviescreening',
  },

  {
    title: 'Enrollment',
    description:
      'Student enrollment tracking and management.',
    icon: <UserPlus size={38} />,
    color: 'from-teal-500 to-cyan-500',
    path: '/communityteam/enrollment',
  },

  {
    title: 'Vocation',
    description:
      'Vocational training programs and activities.',
    icon: <BriefcaseBusiness size={38} />,
    color: 'from-indigo-500 to-blue-500',
    path: '/communityteam/vocation',
  },

  {
    title: 'Alumni Magazine',
    description:
      'Manage alumni magazines and publications.',
    icon: <BookOpen size={38} />,
    color: 'from-fuchsia-500 to-purple-500',
    path: '/communityteam/alumnimagazine',
  },
  

]

  return (

    
         

    <div className="
      min-h-screen
      bg-slate-100
      p-8
    ">

       <div className="mb-6">
    
            <BackButton />
    
          </div>

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="mb-10">

        <h1 className="
          text-5xl font-bold
          text-slate-800
        ">

          Community Team

        </h1>

        <p className="
          text-slate-500
          mt-3 text-lg
        ">

          Select a module to continue

        </p>

      </div>

      {/* ===================================== */}
      {/* GRID */}
      {/* ===================================== */}

      <div className="
        grid grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-8
      ">

        {

          modules.map((item, index) => (

            <div

              key={index}

              onClick={() =>
                navigate(item.path)
              }

              className={`
                relative overflow-hidden
                rounded-[30px]
                bg-gradient-to-br
                ${item.color}
                p-8 text-white
                shadow-2xl
                cursor-pointer
                hover:scale-[1.03]
                transition-all duration-300
                group
              `}
            >

              {/* BG EFFECT */}

              <div className="
                absolute -top-10 -right-10
                w-40 h-40
                rounded-full
                bg-white/10
              " />

              {/* ICON */}

              <div className="
                w-20 h-20
                rounded-3xl
                bg-white/20
                backdrop-blur-md
                flex items-center
                justify-center
                mb-8
              ">

                {item.icon}

              </div>

              {/* TITLE */}

              <h2 className="
                text-3xl font-bold
                leading-tight
                mb-4
              ">

                {item.title}

              </h2>

              {/* DESC */}

              <p className="
                text-white/85
                text-sm leading-7
              ">

                {item.description}

              </p>

              {/* BUTTON */}

              <div className="
                mt-8 flex items-center
                gap-3 text-sm
                font-semibold
              ">

                <span>

                  Open Module

                </span>

                <span className="
                  group-hover:translate-x-2
                  transition-all duration-300
                ">

                  →

                </span>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}