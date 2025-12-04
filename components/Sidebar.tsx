import React from 'react';
import { LayoutGrid, FolderOpen, Calendar, Users, Settings, PlusCircle } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutGrid, label: '工作台' },
    { id: 'projects', icon: FolderOpen, label: '项目列表' },
    { id: 'schedule', icon: Calendar, label: '日程安排' },
    { id: 'team', icon: Users, label: '团队成员' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <span className="text-xl font-bold text-slate-100 tracking-tight">DesignFlow</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === item.id
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-2 justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg transition-colors font-medium text-sm">
          <PlusCircle size={18} />
          <span>新建项目</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-slate-500 hover:text-slate-300 transition-colors">
          <Settings size={20} />
          <span className="font-medium">设置</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;