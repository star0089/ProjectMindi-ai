import React from "react";
import { ServerCrash, RefreshCw, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export const ServerError: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-rose-500/10 text-rose-400 rounded-3xl flex items-center justify-center border border-rose-500/20 shadow-2xl backdrop-blur-xl">
          <ServerCrash className="w-12 h-12" />
        </div>
        <div className="absolute -top-2 -right-2 px-2.5 py-0.5 bg-rose-500 text-white font-mono text-xs font-bold rounded-full shadow-lg">
          500
        </div>
      </div>

      <h1 className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">
        Internal Server Error
      </h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
        Our backend server encountered an unexpected condition. The issue has been logged and our automated system is investigating.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-sm transition-all duration-200 shadow-lg shadow-rose-500/25 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm transition-all duration-200 border border-slate-700/50"
        >
          <LayoutDashboard className="w-4 h-4" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default ServerError;
