import { useEffect, useState } from "react";
import { insightsService, projectService } from "../services/api";

export default function Recommendations() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getProjects()
      .then((projects) => {
        const activeId = projects && projects.length > 0 ? projects[0].id : 1;
        return insightsService.getRecommendations(activeId);
      })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Recommendations...</div>;
  if (!data) return <div className="p-8 text-white">Failed to load recommendations.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Smart AI Recommendations</h1>
        <p className="text-gray-400 mt-2">Actionable steps to improve project health and avoid delays</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8">
        {data.recommendations?.map((rec: any, i: number) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-start gap-6">
            <div className="bg-indigo-900/30 text-indigo-400 p-4 rounded-lg shrink-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{rec.action}: <span className="text-indigo-400">{rec.target}</span></h3>
              <p className="text-gray-300 text-lg leading-relaxed">{rec.reason}</p>
            </div>
          </div>
        ))}
        {(!data.recommendations || data.recommendations.length === 0) && (
          <div className="text-gray-400">No recommendations available at this time.</div>
        )}
      </div>
    </div>
  );
}
