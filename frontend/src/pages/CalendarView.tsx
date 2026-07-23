import React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export const CalendarView = () => {
  // A simple mock calendar view for demonstration
  return (
    <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Calendar
          </h1>
          <p className="text-muted-foreground mt-1">Track deadlines, milestones, and upcoming events.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card border p-1 rounded-xl shadow-sm">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-semibold min-w-[120px] text-center">October 2026</span>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-1 bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="p-3 text-center text-sm font-semibold text-muted-foreground border-r last:border-0">
              {d}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="border-r border-b p-2 min-h-[100px] hover:bg-muted/10 transition-colors">
              <span className={`text-sm font-medium ${i===14 ? 'w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full' : 'text-muted-foreground'}`}>
                {(i % 31) + 1}
              </span>
              {i === 12 && (
                <div className="mt-2 text-xs p-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-md font-medium truncate">
                  Release v1.2
                </div>
              )}
              {i === 18 && (
                <div className="mt-2 text-xs p-1.5 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-md font-medium truncate">
                  Deadline: Alpha
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
