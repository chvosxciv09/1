
import React from 'react';
import { Project } from '../types';

interface TimelineProps {
  projects: Project[];
  title?: string;
}

const Timeline: React.FC<TimelineProps> = ({ projects, title }) => {
  // Calculate date range securely
  const dates = projects.flatMap(p => {
    const start = new Date(p.startDate).getTime();
    const end = new Date(p.dueDate).getTime();
    return [
      isNaN(start) ? new Date().getTime() : start,
      isNaN(end) ? new Date().getTime() : end
    ];
  });
  
  const minDate = dates.length ? Math.min(...dates) : new Date().getTime();
  const maxDate = dates.length ? Math.max(...dates) : new Date().getTime() + 1000 * 60 * 60 * 24 * 30;
  
  // Add buffer
  const startTimestamp = minDate - 1000 * 60 * 60 * 24 * 7;
  const endTimestamp = maxDate + 1000 * 60 * 60 * 24 * 7;
  const totalDuration = Math.max(endTimestamp - startTimestamp, 1); // Avoid division by zero

  const getPosition = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    if (isNaN(time)) return 0;
    return Math.max(0, Math.min(100, ((time - startTimestamp) / totalDuration) * 100));
  };

  const todayPos = ((new Date().getTime() - startTimestamp) / totalDuration) * 100;

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-6 overflow-hidden">
      {title && <h3 className="text-lg font-bold text-white mb-6">{title}</h3>}
      
      <div className="relative">
        {/* Today Marker */}
        <div 
            className="absolute top-0 bottom-0 w-px bg-red-500/50 z-10 pointer-events-none"
            style={{ left: `${Math.max(0, Math.min(100, todayPos))}%` }}
        >
            <div className="absolute -top-1 -translate-x-1/2 text-[10px] text-red-400 font-bold bg-slate-900 px-1 rounded">
                Today
            </div>
        </div>

        {/* Header (Months) - Simplified */}
        <div className="flex border-b border-slate-700 pb-2 mb-4 text-xs text-slate-500">
            <div className="w-1/4">项目名称</div>
            <div className="flex-1 relative h-4">
                <span className="absolute left-0">Timeline</span>
            </div>
        </div>

        {/* Rows */}
        <div className="space-y-6">
            {projects.map(project => {
                const left = getPosition(project.startDate);
                const width = getPosition(project.dueDate) - left;
                
                return (
                    <div key={project.id} className="flex items-center group">
                        <div className="w-1/4 pr-4">
                            <div className="font-medium text-slate-200 truncate">{project.name}</div>
                            <div className="text-xs text-slate-500 truncate">{project.currentPhase}</div>
                        </div>
                        <div className="flex-1 relative h-8 bg-slate-800/50 rounded-full overflow-hidden">
                            {/* Project Bar */}
                            <div 
                                className="absolute h-full rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center px-2 transition-all hover:bg-indigo-600/30"
                                style={{ 
                                    left: `${Math.max(0, left)}%`, 
                                    width: `${Math.max(2, width)}%` 
                                }}
                            >
                                {/* Progress Fill inside bar */}
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-indigo-500 opacity-20" 
                                    style={{ width: `${project.progress}%` }} 
                                ></div>
                                <span className="text-xs text-indigo-300 whitespace-nowrap overflow-hidden text-ellipsis z-10">
                                    {width > 10 ? `${project.progress}%` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
