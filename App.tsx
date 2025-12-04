
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProjectCard from './components/ProjectCard';
import AnalysisView from './components/AnalysisView';
import Whiteboard from './components/Whiteboard';
import Timeline from './components/Timeline';
import FileHub from './components/FileHub';
import LoginScreen from './components/LoginScreen';
import AIAssistant from './components/AIAssistant';
import { Project, ProjectStatus, DesignPhase, LogEntry, WhiteboardNote, Member, ProjectFile } from './types';
import { ChevronRight, ArrowLeft, LayoutList, Users, PieChart, BarChart, Clock, Lightbulb, FolderOpen } from 'lucide-react';

// Mock Data (Initial State)
const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Nebula 智能手冲咖啡机',
    client: 'Nebula Home',
    description: '一款极简主义、支持App互联的智能手冲咖啡机，目标用户为城市年轻白领。',
    thumbnail: 'https://picsum.photos/400/300',
    status: ProjectStatus.REVIEW,
    progress: 45,
    currentPhase: DesignPhase.CONCEPT,
    startDate: '2023-10-01',
    dueDate: '2023-12-15',
    team: [
        { id: 'u1', name: 'Alex', role: '设计主管', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=e0e7ff' },
        { id: 'u2', name: 'Sarah', role: '建模师', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=fce7f3' }
    ],
    feedbackLogs: [],
    whiteboardNotes: [
      { id: 'n1', x: 100, y: 100, content: '我们要强调"仪式感"，比如出水时的灯光效果。', color: 'yellow', authorId: 'u1', createdAt: '2023-11-20T10:00:00Z' },
      { id: 'n2', x: 400, y: 150, content: '材质方面，尝试一下磨砂黑配铜色金属？', color: 'blue', authorId: 'u2', createdAt: '2023-11-20T10:05:00Z' },
      { id: 'n3', x: 200, y: 400, content: '不要忘记 App 的连接体验，必须要在 3 秒内完成配对。', color: 'red', authorId: 'u1', createdAt: '2023-11-20T10:10:00Z' }
    ],
    phases: [
      { id: 'ph1', name: '用户研究', startDate: '2023-10-01', endDate: '2023-10-15', status: 'completed' },
      { id: 'ph2', name: '概念草图', startDate: '2023-10-16', endDate: '2023-11-05', status: 'completed' },
      { id: 'ph3', name: '3D 建模', startDate: '2023-11-06', endDate: '2023-11-25', status: 'in_progress' },
      { id: 'ph4', name: '手板制作', startDate: '2023-11-26', endDate: '2023-12-10', status: 'pending' }
    ],
    files: [
       { id: 'f1', name: '用户调研报告_v1.pdf', type: 'application/pdf', size: 2500000, uploadedAt: '2023-10-14', uploadedBy: 'Alex' },
       { id: 'f2', name: '竞品分析矩阵.png', type: 'image/png', size: 1200000, uploadedAt: '2023-10-05', uploadedBy: 'Sarah' }
    ]
  },
  {
    id: 'p2',
    name: 'ErgoLife 工学办公椅',
    client: 'ErgoLife Inc.',
    description: '新一代人体工学椅，专注于腰部支撑系统创新与环保材料应用。',
    thumbnail: 'https://picsum.photos/400/301',
    status: ProjectStatus.IN_PROGRESS,
    progress: 70,
    currentPhase: DesignPhase.PROTOTYPING,
    startDate: '2023-09-01',
    dueDate: '2024-01-20',
    team: [
         { id: 'u1', name: 'Alex', role: '设计主管', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=e0e7ff' },
         { id: 'u3', name: 'Mike', role: '结构工', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mike&backgroundColor=dbeafe' },
         { id: 'u4', name: 'Jen', role: 'CMF设计', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jen&backgroundColor=ffedd5' }
    ],
    feedbackLogs: [],
    whiteboardNotes: [],
    phases: [
      { id: 'ph1', name: '人机工学数据采集', startDate: '2023-09-01', endDate: '2023-09-20', status: 'completed' },
      { id: 'ph2', name: '机构设计', startDate: '2023-09-21', endDate: '2023-11-15', status: 'completed' },
      { id: 'ph3', name: '样机测试', startDate: '2023-11-16', endDate: '2024-01-10', status: 'in_progress' }
    ],
    files: []
  },
  {
    id: 'p3',
    name: 'Sonic 降噪蓝牙耳机',
    client: 'Sonic Audio',
    description: '高性价比主动降噪耳机，主打多色个性化定制与超长续航。',
    thumbnail: 'https://picsum.photos/400/302',
    status: ProjectStatus.PLANNING,
    progress: 10,
    currentPhase: DesignPhase.RESEARCH,
    startDate: '2024-01-01',
    dueDate: '2024-03-01',
    team: [
        { id: 'u1', name: 'Alex', role: '设计主管', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=e0e7ff' }
    ],
    feedbackLogs: [],
    whiteboardNotes: [],
    phases: [],
    files: []
  },
  {
    id: 'p4',
    name: '模块化露营灯',
    client: 'WildGear',
    description: '适应不同户外场景的可拼接模块化照明系统。',
    thumbnail: 'https://picsum.photos/400/303',
    status: ProjectStatus.IN_PROGRESS,
    progress: 30,
    currentPhase: DesignPhase.CONCEPT,
    startDate: '2023-12-01',
    dueDate: '2024-04-10',
    team: [
        { id: 'u1', name: 'Alex', role: '设计主管', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=e0e7ff' },
        { id: 'u5', name: 'David', role: '设计师', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=David&backgroundColor=f3e8ff' }
    ],
    feedbackLogs: [],
    whiteboardNotes: [],
    phases: [],
    files: []
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [activeView, setActiveView] = useState('projects');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'brainstorm' | 'team' | 'files'>('analysis');

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleAnalysisComplete = (projectId: string, logEntry: LogEntry) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, feedbackLogs: [...p.feedbackLogs, logEntry] };
      }
      return p;
    }));
  };

  const handleUpdateNotes = (projectId: string, notes: WhiteboardNote[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, whiteboardNotes: notes };
      }
      return p;
    }));
  };

  const handleFilesUpdate = (projectId: string, newFiles: ProjectFile[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, files: newFiles };
      }
      return p;
    }));
  };

  const handleLogin = (user: Member) => {
    setCurrentUser(user);
  };

  // Login Check
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (selectedProjectId && selectedProject) {
        return (
            <div className="flex flex-col h-full animate-fadeIn">
                 {/* Project Header */}
                 <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                    <button 
                        onClick={() => setSelectedProjectId(null)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {selectedProject.name}
                            <span className="text-sm font-normal text-slate-500 px-2 py-0.5 border border-slate-700 rounded-md bg-slate-800/50">
                                {selectedProject.currentPhase}
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm">客户: {selectedProject.client}</p>
                    </div>
                    <div className="ml-auto flex bg-slate-800 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            项目概览
                        </button>
                        <button 
                            onClick={() => setActiveTab('analysis')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <PieChart size={14} />
                            反馈分析
                        </button>
                         <button 
                            onClick={() => setActiveTab('brainstorm')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'brainstorm' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <Lightbulb size={14} />
                            头脑风暴
                        </button>
                        <button 
                            onClick={() => setActiveTab('files')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'files' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <FolderOpen size={14} />
                            文件归档
                        </button>
                        <button 
                            onClick={() => setActiveTab('team')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'team' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            团队协作
                        </button>
                    </div>
                 </div>

                 {/* Tab Content */}
                 <div className="flex-1 min-h-0">
                    {activeTab === 'analysis' && (
                        <AnalysisView project={selectedProject} onAnalysisComplete={handleAnalysisComplete} />
                    )}
                    {activeTab === 'brainstorm' && (
                        <Whiteboard 
                          project={selectedProject} 
                          currentUser={currentUser}
                          onUpdateNotes={handleUpdateNotes} 
                        />
                    )}
                    {activeTab === 'files' && (
                        <FileHub 
                          project={selectedProject}
                          onUpdateFiles={handleFilesUpdate}
                        />
                    )}
                    {activeTab === 'overview' && (
                         <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-8 h-full overflow-y-auto">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-200 mb-2">项目概况</h3>
                                    <p className="text-slate-400 max-w-2xl">{selectedProject.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500">截止日期</p>
                                    <p className="text-lg font-bold text-indigo-400">{new Date(selectedProject.dueDate).toLocaleDateString('zh-CN')}</p>
                                </div>
                            </div>

                            {/* Timeline Component */}
                            <Timeline projects={[selectedProject]} title="项目进度计划表" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700/50">
                                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">设计要求</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-slate-400 text-sm">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                            符合品牌极简主义设计语言
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-400 text-sm">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                            成本控制在目标 BOM 范围内
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-400 text-sm">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                            使用至少 30% 可回收材料
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-slate-800/30 p-6 rounded-lg border border-slate-700/50">
                                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">关键交付物</h4>
                                     <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-slate-400 text-sm">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                            用户旅程地图
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-400 text-sm">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                            外观手板 (CMF Standard)
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-400 text-sm">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                            DFM 报告
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                     {activeTab === 'team' && (
                         <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-8 h-full">
                             <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">项目组成员</h3>
                                <button className="text-indigo-400 text-sm hover:underline">管理团队</button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {selectedProject.team.map(member => (
                                    <div key={member.id} className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                                        <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover bg-slate-700" />
                                        <div>
                                            <h4 className="font-bold text-slate-200">{member.name}</h4>
                                            <p className="text-sm text-indigo-400">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                                <button className="flex items-center justify-center gap-2 p-4 border border-dashed border-slate-600 rounded-lg text-slate-500 hover:bg-slate-800/50 hover:border-slate-500 hover:text-slate-300 transition-all h-20">
                                    <Users size={20} />
                                    <span>添加成员</span>
                                </button>
                             </div>
                        </div>
                    )}
                 </div>
            </div>
        );
    }

    // Default Dashboard View
    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 p-8 h-full min-w-0 overflow-hidden flex flex-col">
                {selectedProjectId ? (
                    renderContent()
                ) : (
                    <div className="h-full overflow-y-auto pr-2">
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">欢迎回来, {currentUser.name}</h1>
                                <p className="text-slate-400">您目前有 {projects.length} 个活跃项目，其中 1 个需要立即关注。</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">{currentUser.name}</p>
                                    <p className="text-xs text-slate-500">{currentUser.role}</p>
                                </div>
                                <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-slate-600 bg-slate-700" alt="Profile" />
                            </div>
                        </header>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Clock size={64} className="text-indigo-500" />
                                </div>
                                <h3 className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-2">待评审反馈</h3>
                                <p className="text-3xl font-bold text-white">1</p>
                            </div>
                            <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <BarChart size={64} className="text-emerald-500" />
                                </div>
                                <h3 className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-2">进度正常</h3>
                                <p className="text-3xl font-bold text-white">3</p>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <LayoutList size={64} className="text-slate-500" />
                                </div>
                                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">总项目数</h3>
                                <p className="text-3xl font-bold text-white">{projects.length}</p>
                            </div>
                        </div>

                        {/* Global Timeline View */}
                        <Timeline projects={projects} />

                        <div className="flex items-center justify-between mb-6 mt-8">
                            <h2 className="text-xl font-bold text-white">活跃项目列表</h2>
                            <div className="flex gap-2 text-sm">
                                <span className="text-slate-400">排序:</span>
                                <button className="text-white font-medium hover:text-indigo-400 transition-colors">优先级</button>
                                <span className="text-slate-600">|</span>
                                <button className="text-slate-400 hover:text-white transition-colors">截止日期</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                            {projects.map(project => (
                                <ProjectCard 
                                    key={project.id} 
                                    project={project} 
                                    onClick={(id) => setSelectedProjectId(id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>
            
            {/* AI Assistant Widget */}
            <AIAssistant projects={projects} currentUser={currentUser} />
        </div>
    );
};
