import { useEffect, useState } from "react";
import { insightsService } from "../services/api";

export default function ExecutiveSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insightsService.getExecutiveSummary(1)
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-white">Generating Executive Summary...</div>;
  if (!summary) return <div className="p-8 text-white">Failed to generate summary.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b border-gray-700 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Weekly Executive Summary</h1>
          <p className="text-gray-400 mt-2">ProjectPilot AI Automated Report</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors print:hidden"
        >
          Export PDF
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Project Overview</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          {summary.project_summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-emerald-400 mb-4 border-b border-emerald-900/50 pb-2">Completed Work</h3>
          <ul className="space-y-3">
            {summary.completed_work?.map((item: string, i: number) => (
              <li key={i} className="text-gray-300 flex items-start gap-3">
                <span className="text-emerald-400 mt-1">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-amber-400 mb-4 border-b border-amber-900/50 pb-2">Pending Work</h3>
          <ul className="space-y-3">
            {summary.pending_work?.map((item: string, i: number) => (
              <li key={i} className="text-gray-300 flex items-start gap-3">
                <span className="text-amber-400 mt-1">○</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-rose-400 mb-4 border-b border-rose-900/50 pb-2">Risks</h3>
          <ul className="space-y-3">
            {summary.risks?.map((item: string, i: number) => (
              <li key={i} className="text-gray-300 flex items-start gap-3">
                <span className="text-rose-400 mt-1">!</span> {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-blue-400 mb-4 border-b border-blue-900/50 pb-2">Upcoming Deadlines</h3>
          <ul className="space-y-3">
            {summary.upcoming_deadlines?.map((item: string, i: number) => (
              <li key={i} className="text-gray-300 flex items-start gap-3">
                <span className="text-blue-400 mt-1">📅</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-indigo-900/20 border border-indigo-900/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Strategic Recommendations</h2>
        <ul className="space-y-4">
          {summary.recommendations?.map((item: string, i: number) => (
            <li key={i} className="text-indigo-200 text-lg flex items-start gap-4">
              <span className="mt-1">💡</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
