export default function NoItemSelected() {
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
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No item selected
        </h2>
        <p className="text-sm text-gray-500">
          Please select an item from the list to view its details.
        </p>
      </div>
    </div>
  );
}
