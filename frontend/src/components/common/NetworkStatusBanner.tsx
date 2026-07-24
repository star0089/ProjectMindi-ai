import React, { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export const NetworkStatusBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500/90 text-amber-950 px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-md backdrop-blur-md sticky top-0 z-50">
      <WifiOff className="w-4 h-4 animate-bounce" />
      <span>Network Connection Disconnected. Attempting to reconnect...</span>
    </div>
  );
};
