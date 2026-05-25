interface PageHeaderProps {
  title: string;
  subtitle: string;
  buttonText?: string;
}

export default function PageHeader({
  title,
  subtitle,
  buttonText,
}: PageHeaderProps) {

  return (

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

      <div>

        <h1 className="text-4xl font-bold text-slate-800">
          {title}
        </h1>

        <p className="text-slate-500 mt-1">
          {subtitle}
        </p>

      </div>

      {buttonText && (

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow-sm transition font-medium">

          {buttonText}

        </button>

      )}

    </div>
  );
}