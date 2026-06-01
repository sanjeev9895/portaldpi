import {
  ArrowLeft,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

export default function BackButton() {

  const navigate =
    useNavigate()

  return (

    <button

      onClick={() =>
      navigate(-1)  
        }

      className="flex items-center gap-2 bg-white hover:bg-slate-100 transition border border-slate-200 shadow-sm px-5 h-12 rounded-2xl text-slate-700 font-semibold"
    >

      <ArrowLeft size={20} />

      Back

    </button>
  )
}