export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-glitch">
            404
          </h1>
          <h2 className="mt-2 text-3xl font-bold text-gray-800 animate-fadeIn">
            Oops! Page Not Found
          </h2>
          <p className="mt-4 text-lg text-gray-600 animate-slideUp">
            The page you're looking for has vanished into the digital void.
          </p>
          <div className="mt-8 space-y-4">
            <a
              href="/vansale"
              className="block w-full px-5 py-3 text-center font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Return to Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="block w-full px-5 py-3 text-center font-medium text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
            >
              Go Back
            </button>
          </div>
        </div>
        <div className="w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
      </div>
    </div>
  );
}
