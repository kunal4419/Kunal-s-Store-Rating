export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search stores..."
      className="border rounded-2xl px-4 py-2 w-full shadow"
    />
  );
}
