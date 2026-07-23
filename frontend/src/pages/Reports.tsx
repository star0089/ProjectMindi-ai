import React from "react";
import { FileText, Download, FileSpreadsheet, FileIcon } from "lucide-react";

export const Reports = () => {
  const reports = [
    { title: "Daily Status Report", desc: "Summary of daily activities and progress.", type: "Daily" },
    { title: "Weekly Project Summary", desc: "Comprehensive weekly review of all projects.", type: "Weekly" },
    { title: "Sprint Retrospective", desc: "Velocity, completed tasks, and blockers.", type: "Sprint" },
    { title: "Executive Risk Report", desc: "High-level overview of project risks and health.", type: "Executive" },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Professional Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and export automated project reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {reports.map((r, i) => (
          <div key={i} className="p-6 bg-card border rounded-2xl shadow-sm group hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{r.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{r.desc}</p>
            </div>
            <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-secondary hover:bg-muted text-foreground text-xs font-medium rounded-lg transition-colors">
                <FileIcon className="w-3.5 h-3.5" /> PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-secondary hover:bg-muted text-foreground text-xs font-medium rounded-lg transition-colors">
                <FileText className="w-3.5 h-3.5" /> DOCX
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-secondary hover:bg-muted text-foreground text-xs font-medium rounded-lg transition-colors">
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
