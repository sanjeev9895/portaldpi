import {
  GraduationCap,
  Users,
  UserCheck,
  MessageCircleMore,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import BackButton from "../components/BackButton";

export default function KPIs() {

  const navigate = useNavigate();

  const kpis = [

    {
      title: "School Level Alumni Community",
      description:
        "Track school level alumni community formation and engagement.",
      icon: <GraduationCap size={38} />,
      color: "from-blue-500 to-cyan-500",
      path: "/school-community",
    },

    {
      title: "Alumni Core Team Formation",
      description:
        "Monitor alumni core team creation and participation.",
      icon: <Users size={38} />,
      color: "from-violet-500 to-purple-500",
      path: "/core-team-formation",
    },

    {
      title: "Alumni Core Engagement",
      description:
        "Measure alumni core engagement activities and performance.",
      icon: <UserCheck size={38} />,
      color: "from-emerald-500 to-green-500",
      path: "/core-engagement",
    },

    {
      title: "WhatsApp Group Engagement",
      description:
        "Track WhatsApp group activity and member engagement.",
      icon: <MessageCircleMore size={38} />,
      color: "from-green-500 to-lime-500",
      path: "/whatsapp-engagement",
    },

  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="mb-6">
        <BackButton />
      </div>

      <div className="mb-10">

        <h1 className="text-5xl font-bold text-slate-800">
          Community Team KPIs
        </h1>

        <p className="text-slate-500 mt-3 text-lg">
          Select KPI Module
        </p>

      </div>

      <div
        className="
          grid grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-8
        "
      >
        {kpis.map((item, index) => (
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
            <div
              className="
                absolute -top-10 -right-10
                w-40 h-40
                rounded-full
                bg-white/10
              "
            />

            <div
              className="
                w-20 h-20
                rounded-3xl
                bg-white/20
                backdrop-blur-md
                flex items-center
                justify-center
                mb-8
              "
            >
              {item.icon}
            </div>

            <h2
              className="
                text-2xl font-bold
                leading-tight
                mb-4
              "
            >
              {item.title}
            </h2>

            <p
              className="
                text-white/85
                text-sm leading-7
              "
            >
              {item.description}
            </p>

            <div
              className="
                mt-8 flex items-center
                gap-3 text-sm
                font-semibold
              "
            >
              <span>Open KPI</span>

              <span
                className="
                  group-hover:translate-x-2
                  transition-all duration-300
                "
              >
                →
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}