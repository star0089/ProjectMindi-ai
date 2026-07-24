import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, LayoutDashboard, Search } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-indigo-500/10 text-indigo-400 rounded-3xl flex items-center justify-center border border-indigo-500/20 shadow-2xl backdrop-blur-xl">
          <HelpCircle className="w-12 h-12" />
        </div>
        <div className="absolute -top-2 -right-2 px-2.5 py-0.5 bg-indigo-500 text-white font-mono text-xs font-bold rounded-full shadow-lg">
          404
        </div>
      </div>

      <h1 className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
        The route or view you are looking for does not exist or has been relocated to another module.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25"
        >
          <LayoutDashboard className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <Link
          to="/projects"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm transition-all duration-200 border border-slate-700/50"
        >
          <Search className="w-4 h-4" />
          Browse Projects
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
