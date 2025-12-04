import React, { useState } from 'react';
import { FileText, UploadCloud, File, Download, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Project, ProjectFile } from '../types';
import { summarizeProjectFile } from '../services/geminiService';

interface FileHubProps {
  project: Project;
  onUpdateFiles: (projectId: string, files: ProjectFile[]) => void;
}

const FileHub: React.FC<FileHubProps> = ({ project, onUpdateFiles }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [summarizingFileId, setSummarizingFileId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
        const newFile: ProjectFile = {
            id: Date.now().toString(),
            name: `设计报告_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.pdf`,
            type: 'application/pdf',
            size: 1024 * 1024 * 2.5, // 2.5MB
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'CurrentUser' // Should come from context
        };
        onUpdateFiles(project.id, [newFile, ...project.files]);
        setIsUploading(false);
    }, 1500);
  };

  const handleSummarize = async (file: ProjectFile) => {
      setSummarizingFileId(file.id);
      setSummary(null);
      
      // Mock content for demo purposes since we don't have a real backend to fetch file content
      const mockContent = `
        项目：${project.name}
        阶段：${project.currentPhase}
        
        关键发现：
        1. 用户对现有产品的握持手感表示不满，建议增加橡胶防滑纹理。
        2. 竞品分析显示，市场上80%的同类产品采用了Type-C充电接口。
        3. 目标用户群体偏好哑光黑和深灰色的配色方案。
        
        技术限制：
        - 电池仓空间有限，需使用定制锂电池。
        - 外壳壁厚不能低于1.5mm。
      `;

      try {
          const result = await summarizeProjectFile(mockContent, file.name);
          setSummary(result);
      } catch (e) {
          setSummary("总结失败");
      } finally {
          setSummarizingFileId(null);
      }
  };

  const handleDelete = (fileId: string) => {
      onUpdateFiles(project.id, project.files.filter(f => f.id !== fileId));
      if (summary && summarizingFileId === fileId) {
          setSummary(null);
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* File List */}
      <div className="lg:col-span-2 bg-slate-900/50 rounded-xl border border-slate-700/50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <FileText size={18} className="text-indigo-400" />
                项目文件
            </h3>
            <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                上传文件
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {project.files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <UploadCloud size={48} className="mb-4 opacity-50" />
                    <p>暂无文件，点击右上角上传</p>
                </div>
            ) : (
                project.files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                                <File size={20} />
                            </div>
                            <div>
                                <h4 className="text-slate-200 font-medium text-sm">{file.name}</h4>
                                <p className="text-xs text-slate-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.uploadedBy} • {new Date(file.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleSummarize(file)}
                                className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg tooltip-trigger"
                                title="AI 智能总结"
                            >
                                <Sparkles size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:bg-slate-700 rounded-lg">
                                <Download size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(file.id)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Summary View */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                AI 智能摘要
            </h3>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
            {summarizingFileId ? (
                <div className="h-full flex flex-col items-center justify-center text-indigo-400 gap-3">
                    <Loader2 size={32} className="animate-spin" />
                    <p className="text-sm animate-pulse">正在阅读并分析文件内容...</p>
                </div>
            ) : summary ? (
                <div className="prose prose-invert prose-sm">
                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                        {summary}
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
                    <FileText size={48} className="mb-4 opacity-30" />
                    <p className="text-sm">选择左侧文件点击 <Sparkles size={12} className="inline text-indigo-400" /> 进行智能总结</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FileHub;