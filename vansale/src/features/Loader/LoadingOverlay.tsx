import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({
  message = "Loading...",
}: LoadingOverlayProps = {}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-xl font-semibold text-primary">{message}</p>
      </div>
    </div>
  );
}
