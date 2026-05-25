type Props = {
  title: string
  value: string
}

export default function StatCard({
  title,
  value,
}: Props) {

  return (

    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <p className="text-slate-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  )
}