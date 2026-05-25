import BackButton from "../../components/BackButton";

export default function Smc() {

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
      {/* CONTENT */}
      {/* ===================================== */}

      <div className="
        flex items-center
        justify-center
        min-h-[80vh]
      ">

        <div className="
          bg-white
          rounded-[32px]
          shadow-2xl
          p-14
          text-center
          max-w-2xl
          w-full
        ">

          {/* ICON */}

          <div className="
            w-28 h-28
            rounded-full
            bg-gradient-to-br
            from-blue-500
            to-cyan-600
            mx-auto
            flex items-center
            justify-center
            text-white
            text-5xl
            shadow-xl
            mb-8
          ">

            🏫

          </div>

          {/* TITLE */}

          <h1 className="
            text-5xl
            font-bold
            text-slate-800
            mb-5
          ">

            SMC Module

          </h1>

          {/* SUBTITLE */}

          <p className="
            text-slate-500
            text-lg
            leading-8
          ">

            School Management Committee
            features and analytics are
            currently being developed.

            Advanced reporting,
            school coordination and
            management tools will
            be available soon.

          </p>

          {/* BADGE */}

          <div className="
            mt-10 inline-flex
            items-center gap-3
            px-6 py-3
            rounded-full
            bg-blue-100
            text-blue-700
            font-semibold
            text-sm
          ">

            <span className="
              w-3 h-3
              rounded-full
              bg-blue-500
              animate-pulse
            " />

            Updating Soon

          </div>

        </div>

      </div>

    </div>
  );
}