import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: SearchBarProps) {

  return (

    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8">

      <div className="flex items-center gap-3">

        <Search
          className="text-slate-400"
          size={20}
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
        />

      </div>

    </div>
  );
}