import { useEffect, useState } from "react";
import { insightsService } from "../services/api";

export default function StandupReports() {
  const [standup, setStandup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insightsService.getStandup(1)
      .then(setStandup)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-white">Generating AI Standup...</div>;
  if (!standup) return <div className="p-8 text-white">Failed to generate standup.</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Daily AI Standup</h1>
          <p className="text-gray-400 mt-2">Generated automatically from project activity</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors print:hidden"
        >
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Yesterday
          </h3>
          <ul className="space-y-3">
            {standup.yesterday?.map((item: string, i: number) => (
              <li key={i} className="text-gray-300 flex items-start gap-3">
                <span className="text-emerald-400 mt-1">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Today
          </h3>
          <ul className="space-y-3">
            {standup.today?.map((item: string, i: number) => (
              <li key={i} className="text-gray-300 flex items-start gap-3">
                <span className="text-blue-400 mt-1">→</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-rose-900/20 border border-rose-900/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-rose-400 mb-4">Blockers</h3>
          <ul className="space-y-3">
            {standup.blockers?.map((item: string, i: number) => (
              <li key={i} className="text-rose-300 flex items-start gap-3">
                <span className="mt-1">!</span> {item}
              </li>
            ))}
            {(!standup.blockers || standup.blockers.length === 0) && (
              <li className="text-gray-400">No blockers identified.</li>
            )}
          </ul>
        </div>

        <div className="bg-indigo-900/20 border border-indigo-900/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-indigo-400 mb-4">Suggestions & Expected Completion</h3>
          <ul className="space-y-3 mb-4">
            {standup.suggestions?.map((item: string, i: number) => (
              <li key={i} className="text-indigo-300 flex items-start gap-3">
                <span className="mt-1">💡</span> {item}
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-indigo-900/50">
            <p className="text-gray-300">
              <span className="font-semibold text-white">Expected Completion: </span>
              {standup.expected_completion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
