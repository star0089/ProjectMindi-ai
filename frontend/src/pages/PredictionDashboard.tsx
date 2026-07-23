import { useEffect, useState } from "react";
import { insightsService } from "../services/api";

export default function PredictionDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insightsService.getPredictions(1)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Predictions...</div>;
  if (!data) return <div className="p-8 text-white">Failed to load predictions.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Timeline Prediction & Dependencies</h1>
        <p className="text-gray-400 mt-2">AI-driven analysis of project schedules and task blockers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <h3 className="text-gray-400 text-sm font-medium">Est. Completion</h3>
          <div className="mt-2 text-2xl font-bold text-white">{data.prediction?.current_completion_date}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <h3 className="text-gray-400 text-sm font-medium">Possible Delay</h3>
          <div className="mt-2 text-2xl font-bold text-rose-400">{data.prediction?.possible_delay_days} Days</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <h3 className="text-gray-400 text-sm font-medium">Required Velocity</h3>
          <div className="mt-2 text-2xl font-bold text-indigo-400">{data.prediction?.required_velocity}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <h3 className="text-gray-400 text-sm font-medium">Sprint Confidence</h3>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{data.prediction?.sprint_completion_confidence_percent}%</div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Dependency Analysis</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-amber-400 mb-3 border-b border-gray-700 pb-2">Task Blocking</h3>
            <ul className="space-y-2">
              {data.dependency_analysis?.task_blocking?.map((item: any, i: number) => (
                <li key={i} className="text-gray-300">
                  <span className="font-semibold text-white">{item.task}</span> is blocking: {item.blocking.join(", ")}
                </li>
              ))}
              {(!data.dependency_analysis?.task_blocking || data.dependency_analysis.task_blocking.length === 0) && (
                <li className="text-gray-500">No task blocking detected.</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-rose-400 mb-3 border-b border-gray-700 pb-2">Circular Dependencies</h3>
            <ul className="space-y-2">
              {data.dependency_analysis?.circular_dependencies?.map((item: any, i: number) => (
                <li key={i} className="text-gray-300">{JSON.stringify(item)}</li>
              ))}
              {(!data.dependency_analysis?.circular_dependencies || data.dependency_analysis.circular_dependencies.length === 0) && (
                <li className="text-gray-500">No circular dependencies detected.</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-blue-400 mb-3 border-b border-gray-700 pb-2">Missing Dependencies</h3>
            <ul className="space-y-2">
              {data.dependency_analysis?.missing_dependencies?.map((item: any, i: number) => (
                <li key={i} className="text-gray-300">{JSON.stringify(item)}</li>
              ))}
              {(!data.dependency_analysis?.missing_dependencies || data.dependency_analysis.missing_dependencies.length === 0) && (
                <li className="text-gray-500">No missing dependencies detected.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
