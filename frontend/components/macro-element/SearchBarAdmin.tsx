import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative w-full sm:w-60">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      placeholder="Nom ou CIN..."
      className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);