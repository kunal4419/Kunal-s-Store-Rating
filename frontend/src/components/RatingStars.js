export default function RatingStars({ value, onChange, max = 5 }) {
  return (
    <div className="flex space-x-1">
      {[...Array(max)].map((_, i) => (
        <span
          key={i}
          className={
            `cursor-pointer text-2xl ${i < value ? 'text-yellow-400' : 'text-gray-300'}`
          }
          onClick={() => onChange(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
