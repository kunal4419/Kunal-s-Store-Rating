export default function StoreCard({ name, address, avgRating, myRating, onRate }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 mb-4 flex flex-col gap-2">
      <div className="font-bold text-lg">{name}</div>
      <div className="text-gray-500">{address}</div>
      <div className="flex items-center gap-2">
        <span>Avg Rating:</span>
        <span className="text-yellow-400">{'★'.repeat(Math.round(avgRating))}</span>
        <span className="text-gray-400">({avgRating})</span>
      </div>
      {myRating !== undefined && (
        <div className="flex items-center gap-2">
          <span>Your Rating:</span>
          <span className="text-blue-400">{'★'.repeat(myRating)}</span>
        </div>
      )}
      {onRate && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl mt-2" onClick={onRate}>
          Rate This Store
        </button>
      )}
    </div>
  );
}
