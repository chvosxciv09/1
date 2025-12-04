import React, { useState } from 'react';
import { Sparkles, ArrowRight, MessageSquare, AlertTriangle, CheckSquare, HelpCircle, Copy } from 'lucide-react';
import { analyzeFeedback } from '../services/geminiService';
import { Project, LogEntry } from '../types';

interface AnalysisViewProps {
  project: Project;
  onAnalysisComplete: (projectId: string, logEntry: LogEntry) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ project, onAnalysisComplete }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeFeedback(inputText, project.currentPhase);
      const newEntry: LogEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        author: '当前用户', // In a real app this comes from auth
        rawText: inputText,
        analysis: result,
      };
      onAnalysisComplete(project.id, newEntry);
      setInputText('');
    } catch (e) {
      setError("分析反馈失败，请检查网络连接后重试。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex justify-between items-center">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-400" />
            录入客户反馈
          </h3>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">当前阶段: {project.currentPhase}</span>
        </div>
        
        <div className="flex-1 p-4">
          <textarea
            className="w-full h-full bg-transparent border-0 focus:ring-0 text-slate-300 placeholder-slate-600 resize-none leading-relaxed"
            placeholder="粘贴会议记录、邮件内容或直接输入客户的口头反馈...&#10;&#10;例如：'客户喜欢整体的造型风格，但觉得把手部分太厚重了。他们提到希望看起来'更圆润'、'更有科技感'，但没有具体说明这代表什么。另外他们询问是否可以使用再生塑料材质。'"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            {inputText.length} 字符
          </span>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
              isAnalyzing || !inputText.trim()
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                正在分析...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                AI 智能分析
              </>
            )}
          </button>
        </div>
        {error && (
            <div className="bg-red-500/10 border-t border-red-500/20 text-red-400 px-4 py-2 text-sm">
                {error}
            </div>
        )}
      </div>

      {/* History/Display Section */}
      <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
            <h3 className="font-semibold text-slate-200">历史分析记录</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {project.feedbackLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                    <Sparkles size={48} className="mb-4 text-slate-600" />
                    <p>暂无分析记录，请在左侧输入反馈。</p>
                </div>
            ) : (
                [...project.feedbackLogs].reverse().map((log) => (
                    <div key={log.id} className="bg-slate-800/40 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="bg-slate-800/60 p-3 flex justify-between items-center border-b border-slate-700">
                            <span className="text-xs text-slate-400 font-mono">{new Date(log.date).toLocaleString('zh-CN')}</span>
                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                log.analysis?.sentiment === '正面' ? 'bg-emerald-500/10 text-emerald-400' :
                                log.analysis?.sentiment === '负面' ? 'bg-red-500/10 text-red-400' :
                                'bg-amber-500/10 text-amber-400'
                            }`}>
                                {log.analysis?.sentiment}
                            </div>
                        </div>
                        
                        <div className="p-5 space-y-6">
                            {/* Summary */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">执行摘要</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">{log.analysis?.summary}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Action Items */}
                                <div className="bg-emerald-900/10 rounded-lg p-3 border border-emerald-900/20">
                                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CheckSquare size={14} />
                                        明确需求
                                    </h4>
                                    <ul className="space-y-2">
                                        {log.analysis?.key_requests.map((req, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                <span className="mt-1.5 w-1 h-1 bg-emerald-500 rounded-full flex-shrink-0"></span>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Ambiguities */}
                                <div className="bg-amber-900/10 rounded-lg p-3 border border-amber-900/20">
                                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <AlertTriangle size={14} />
                                        检测到模糊点
                                    </h4>
                                    <ul className="space-y-2">
                                        {log.analysis?.ambiguities.map((amb, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                <span className="mt-1.5 w-1 h-1 bg-amber-500 rounded-full flex-shrink-0"></span>
                                                "{amb}"
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Clarifying Questions */}
                            {log.analysis?.suggested_questions && log.analysis.suggested_questions.length > 0 && (
                                <div className="bg-indigo-900/10 rounded-lg p-4 border border-indigo-900/20">
                                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <HelpCircle size={14} />
                                        建议沟通话术
                                    </h4>
                                    <div className="space-y-2">
                                        {log.analysis.suggested_questions.map((q, i) => (
                                            <div key={i} className="flex items-center justify-between group">
                                                <p className="text-sm text-indigo-200 italic">"{q}"</p>
                                                <button 
                                                    onClick={() => navigator.clipboard.writeText(q)}
                                                    className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                                                    title="复制到剪贴板"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {/* Next Step */}
                             <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <div className="p-2 bg-slate-700 rounded-md">
                                    <ArrowRight size={16} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">推荐下一步</h4>
                                    <p className="text-sm text-white font-medium">{log.analysis?.next_steps_suggestion}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;