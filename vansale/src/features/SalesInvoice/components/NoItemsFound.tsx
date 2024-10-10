export default function NoItemsFound() {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden border">
      <div className="p-6 flex flex-col items-center text-center">
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
          <path d="M16.5 9.4 7.55 4.24"></path>
          <polyline points="3.29 7 12 12 20.71 7"></polyline>
          <line x1="12" y1="22" x2="12" y2="12"></line>
          <path d="m17 13 5 5m-5 0 5-5"></path>
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No items found
        </h2>
        <p className="text-sm text-gray-500">
          We couldn't find any items matching your criteria. Try adjusting your
          search or filters.
        </p>
      </div>
    </div>
  );
}
