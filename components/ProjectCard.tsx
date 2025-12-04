
import React from 'react';
import { Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Project, ProjectStatus } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.IN_PROGRESS: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case ProjectStatus.REVIEW: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case ProjectStatus.COMPLETED: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div 
      onClick={() => onClick(project.id)}
      className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
          {project.status}
        </div>
        <div className="flex -space-x-2">
          {project.team.slice(0, 3).map((member) => (
            <img 
              key={member.id} 
              src={member.avatar} 
              alt={member.name}
              className="w-8 h-8 rounded-full border-2 border-slate-800 object-cover bg-slate-700" 
            />
          ))}
          {project.team.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs text-white">
              +{project.team.length - 3}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>阶段: {project.currentPhase}</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={14} />
            <span>截止 {new Date(project.dueDate).toLocaleDateString('zh-CN')}</span>
          </div>
          
          {/* Status Indicator Icon */}
          {project.status === ProjectStatus.REVIEW ? (
            <div className="flex items-center gap-1 text-amber-400 text-xs font-medium">
              <AlertCircle size={14} />
              <span>待处理反馈</span>
            </div>
          ) : (
             <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <TrendingUp size={14} />
              <span>进度正常</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
