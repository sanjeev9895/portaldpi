import BackButton from "../../../components/BackButton";

import {
  useNavigate,
} from "react-router-dom";

export default function Ambassador() {

  const navigate =
    useNavigate();

  return (

    <div className="
      min-h-screen
      bg-slate-100
      p-6
    ">

      {/* ===================================== */}
      {/* BACK BUTTON */}
      {/* ===================================== */}

      <div className="mb-6">

        <BackButton />

      </div>

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="mb-10">

        <h1 className="
          text-5xl
          font-bold
          text-slate-800
          mb-3
        ">

          Ambassador Module

        </h1>

        <p className="
          text-slate-500
          text-lg
        ">

          Select ambassador management module

        </p>

      </div>

      {/* ===================================== */}
      {/* CARDS */}
      {/* ===================================== */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-8
      ">

        {/* ===================================== */}
        {/* CARD 1 */}
        {/* ===================================== */}

        <div

          onClick={() =>
            navigate(
              '/communityteam/ambassadorpage/ambassadorlist'

            )
          }

          className="
            relative overflow-hidden
            rounded-[32px]
            bg-gradient-to-br
            from-violet-500
            to-purple-600
            p-10
            text-white
            shadow-2xl
            cursor-pointer
            hover:scale-[1.02]
            transition-all duration-300
            group
          "
        >

          {/* BG */}

          <div className="
            absolute
            -top-10
            -right-10
            w-40 h-40
            rounded-full
            bg-white/10
          " />

          {/* ICON */}

          <div className="
            w-24 h-24
            rounded-3xl
            bg-white/20
            backdrop-blur-md
            flex items-center
            justify-center
            text-5xl
            mb-8
          ">

            👨‍🎓

          </div>

          {/* TITLE */}

          <h2 className="
            text-4xl
            font-bold
            mb-4
          ">

            Ambassador List

          </h2>

          {/* DESC */}

          <p className="
            text-white/85
            text-lg
            leading-8
          ">

            View and manage all
            ambassador students,
            coordinators and reports.

          </p>

          {/* BUTTON */}

          <div className="
            mt-10
            flex items-center
            gap-3
            text-sm
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

        {/* ===================================== */}
        {/* CARD 2 */}
        {/* ===================================== */}

        <div

          onClick={() =>
            navigate(
              '/communityteam/ambassadorpage/ambassadorschools'
            )
          }

          className="
            relative overflow-hidden
            rounded-[32px]
            bg-gradient-to-br
            from-cyan-500
            to-blue-600
            p-10
            text-white
            shadow-2xl
            cursor-pointer
            hover:scale-[1.02]
            transition-all duration-300
            group
          "
        >

          {/* BG */}

          <div className="
            absolute
            -top-10
            -right-10
            w-40 h-40
            rounded-full
            bg-white/10
          " />

          {/* ICON */}

          <div className="
            w-24 h-24
            rounded-3xl
            bg-white/20
            backdrop-blur-md
            flex items-center
            justify-center
            text-5xl
            mb-8
          ">

            🏫

          </div>

          {/* TITLE */}

          <h2 className="
            text-4xl
            font-bold
            mb-4
          ">

            Ambassador School List

          </h2>

          {/* DESC */}

          <p className="
            text-white/85
            text-lg
            leading-8
          ">

            Track schools participating
            in ambassador activities
            and engagement programs.

          </p>

          {/* BUTTON */}

          <div className="
            mt-10
            flex items-center
            gap-3
            text-sm
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

      </div>

    </div>
  );
}