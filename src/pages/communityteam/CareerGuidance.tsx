
import BackButton from "../../components/BackButton";

export default function CareerGuidance() {

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
            from-emerald-500
            to-green-600
            mx-auto
            flex items-center
            justify-center
            text-white
            text-5xl
            shadow-xl
            mb-8
          ">

            💼

          </div>

          {/* TITLE */}

          <h1 className="
            text-5xl
            font-bold
            text-slate-800
            mb-5
          ">

            Career Guidance

          </h1>

          {/* SUBTITLE */}

          <p className="
            text-slate-500
            text-lg
            leading-8
          ">

            Career guidance programs,
            mentorship tracking and
            student career analytics
            are currently under
            development.

            More features and reports
            will be launched soon.

          </p>

          {/* BADGE */}

          <div className="
            mt-10 inline-flex
            items-center gap-3
            px-6 py-3
            rounded-full
            bg-emerald-100
            text-emerald-700
            font-semibold
            text-sm
          ">

            <span className="
              w-3 h-3
              rounded-full
              bg-emerald-500
              animate-pulse
            " />

            Updating Soon

          </div>

        </div>

      </div>

    </div>
  );
}