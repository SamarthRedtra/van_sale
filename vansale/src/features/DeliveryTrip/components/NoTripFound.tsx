import { AlertCircle } from "lucide-react"

export default function NoTripFound() {
    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-yellow-100">
                            <AlertCircle className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h2>
                        <p className="text-gray-600 mb-6">
                            We couldn't find any delivery trips matching your search. Please try different keywords or check your spelling.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}