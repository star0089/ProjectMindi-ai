import { useEffect, useState } from "react";
import { insightsService } from "../services/api";

export default function AIInsights() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming project 1 for MVP
    insightsService.getHealthScore(1)
      .then(setHealthData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading AI Insights...</div>;
  }

  if (!healthData) {
    return <div className="p-8 text-white">Failed to load AI Insights.</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Project Insights</h1>
          <p className="text-gray-400 mt-2">Comprehensive health analysis powered by ProjectPilot AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm font-medium">Overall Health</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{healthData.overall_health_score}%</span>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm font-medium">Timeline Health</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-emerald-400">{healthData.timeline_health}%</span>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm font-medium">Scope Coverage</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-blue-400">{healthData.scope_coverage}%</span>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-gray-400 text-sm font-medium">Risk Level</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${
              healthData.risk_level?.toLowerCase() === 'high' ? 'text-rose-400' :
              healthData.risk_level?.toLowerCase() === 'medium' ? 'text-amber-400' : 'text-emerald-400'
            }`}>{healthData.risk_level}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">AI Analysis Explanation</h2>
        <p className="text-gray-300 leading-relaxed">
          {healthData.explanation}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Task Completion</h3>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${healthData.task_completion}%` }}></div>
          </div>
          <p className="mt-2 text-right text-gray-400 text-sm">{healthData.task_completion}% Complete</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Milestone Progress</h3>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-purple-500 h-4 rounded-full" style={{ width: `${healthData.milestone_progress}%` }}></div>
          </div>
          <p className="mt-2 text-right text-gray-400 text-sm">{healthData.milestone_progress}% Complete</p>
        </div>
      </div>
    </div>
  );
}
