import {
  BookText,
  Feather,
  Orbit,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import BackButton from '../../components/BackButton'

export default function AlumniMagazine() {

  const navigate = useNavigate()

  const modules = [

    {
      title: 'கணவாசிரியர்',

      description:
        'கணவாசிரியர் activities and management.',

      icon:
        <BookText size={38} />,

      color:
        'from-lime-500 to-green-500',

      path:
        '/communityteam/kanavaciriyar',
    },

    {
      title: 'தேன் சிட்டு',

      description:
        'தேன் சிட்டு student activities and tracking.',

      icon:
        <Feather size={38} />,

      color:
        'from-yellow-500 to-orange-500',

      path:
        '/communityteam/thensittu',
    },

    {
      title: 'ஊஞ்சல்',

      description:
        'ஊஞ்சல் program monitoring and reports.',

      icon:
        <Orbit size={38} />,

      color:
        'from-sky-500 to-indigo-500',

      path:
        '/communityteam/oonjal',
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

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="
          text-5xl font-bold
          text-slate-800
        ">

          Alumni Magazine

        </h1>

        <p className="
          text-slate-500
          mt-3 text-lg
        ">

          Select a magazine module

        </p>

      </div>

      {/* GRID */}

      <div className="
        grid grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
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

              {/* DESCRIPTION */}

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
  )
}