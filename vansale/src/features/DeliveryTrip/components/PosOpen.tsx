import { useNavigate } from 'react-router-dom';
import { Store } from "lucide-react";

export default function PosOpen({ pos_profile }: any) {
  const navigate = useNavigate();

  // Redirect to POS
  const handleOpenPOS = () => {
    //navigate('/app/point-of-sale');
    window.location.href = `/app/point-of-sale?pos_profile=${pos_profile}`;
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100">
              <Store className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Open Point of Sale
            </h2>
            <p className="text-gray-700 mb-6">
              Access the POS system to manage your sales and transactions with ease.
            </p>
            <button
              onClick={handleOpenPOS}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700"
            >
              Open POS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
