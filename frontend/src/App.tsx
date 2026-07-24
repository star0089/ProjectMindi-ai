import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./hooks/useTheme";
import { ToastProvider } from "./hooks/useToast";
import { PageLayout } from "./components/layout/PageLayout";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { NetworkStatusBanner } from "./components/common/NetworkStatusBanner";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages with route-splitting
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Projects = lazy(() => import("./pages/Projects").then(m => ({ default: m.Projects })));
const TaskBoard = lazy(() => import("./pages/TaskBoard").then(m => ({ default: m.TaskBoard })));
const Timeline = lazy(() => import("./pages/Timeline").then(m => ({ default: m.Timeline })));
const Milestones = lazy(() => import("./pages/Milestones").then(m => ({ default: m.Milestones })));
const ScopeGuardian = lazy(() => import("./pages/ScopeGuardian").then(m => ({ default: m.ScopeGuardian })));
const RiskCenter = lazy(() => import("./pages/RiskCenter").then(m => ({ default: m.RiskCenter })));
const AIChat = lazy(() => import("./pages/AIChat").then(m => ({ default: m.AIChat })));
const AIPlanner = lazy(() => import("./pages/AIPlanner").then(m => ({ default: m.AIPlanner })));
const Settings = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })));

// AI Intelligence Pages (Default Exports)
const AIInsights = lazy(() => import("./pages/AIInsights"));
const StandupReports = lazy(() => import("./pages/StandupReports"));
const ExecutiveSummary = lazy(() => import("./pages/ExecutiveSummary"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const PredictionDashboard = lazy(() => import("./pages/PredictionDashboard"));

// Enterprise Features
const Team = lazy(() => import("./pages/Team").then(m => ({ default: m.Team })));
const Analytics = lazy(() => import("./pages/Analytics").then(m => ({ default: m.Analytics })));
const Notifications = lazy(() => import("./pages/Notifications").then(m => ({ default: m.Notifications })));
const Reports = lazy(() => import("./pages/Reports").then(m => ({ default: m.Reports })));
const CalendarView = lazy(() => import("./pages/CalendarView").then(m => ({ default: m.CalendarView })));
const Activity = lazy(() => import("./pages/Activity").then(m => ({ default: m.Activity })));

// Error Pages
const NotFound = lazy(() => import("./pages/NotFound"));
const ServerError = lazy(() => import("./pages/ServerError"));

// TanStack Query Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute caching
      retry: 1,
    },
  },
});

const LoadingFallback: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    <span className="text-sm font-medium text-slate-400">Loading module...</span>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <NetworkStatusBanner />
            <BrowserRouter>
              <PageLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/planner" element={<AIPlanner />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<TaskBoard />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/milestones" element={<Milestones />} />
                    <Route path="/scope" element={<ScopeGuardian />} />
                    <Route path="/risk" element={<RiskCenter />} />
                    <Route path="/chat" element={<AIChat />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/activity" element={<Activity />} />
                    <Route path="/notifications" element={<Notifications />} />
                    
                    {/* AI Insights Engine */}
                    <Route path="/insights" element={<AIInsights />} />
                    <Route path="/standup" element={<StandupReports />} />
                    <Route path="/executive-summary" element={<ExecutiveSummary />} />
                    <Route path="/recommendations" element={<Recommendations />} />
                    <Route path="/prediction" element={<PredictionDashboard />} />

                    <Route path="/settings" element={<Settings />} />
                    <Route path="/500" element={<ServerError />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </PageLayout>
            </BrowserRouter>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
