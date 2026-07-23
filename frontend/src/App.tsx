import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./hooks/useTheme";
import { ToastProvider } from "./hooks/useToast";
import { PageLayout } from "./components/layout/PageLayout";

// Import all pages
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { TaskBoard } from "./pages/TaskBoard";
import { Timeline } from "./pages/Timeline";
import { Milestones } from "./pages/Milestones";
import { ScopeGuardian } from "./pages/ScopeGuardian";
import { RiskCenter } from "./pages/RiskCenter";
import { AIChat } from "./pages/AIChat";
import { AIPlanner } from "./pages/AIPlanner";
import { Settings } from "./pages/Settings";

// AI Project Intelligence Pages
import AIInsights from "./pages/AIInsights";
import StandupReports from "./pages/StandupReports";
import ExecutiveSummary from "./pages/ExecutiveSummary";
import Recommendations from "./pages/Recommendations";
import PredictionDashboard from "./pages/PredictionDashboard";

// Instantiate TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <PageLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/planner" element={<AIPlanner />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<TaskBoard />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/milestones" element={<Milestones />} />
                <Route path="/scope" element={<ScopeGuardian />} />
                <Route path="/risk" element={<RiskCenter />} />
                <Route path="/chat" element={<AIChat />} />
                
                {/* AI Insights Engine */}
                <Route path="/insights" element={<AIInsights />} />
                <Route path="/standup" element={<StandupReports />} />
                <Route path="/executive-summary" element={<ExecutiveSummary />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/prediction" element={<PredictionDashboard />} />

                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </PageLayout>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
