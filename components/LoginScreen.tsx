
import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Loader2, Sparkles } from 'lucide-react';
import { Member } from '../types';

interface LoginScreenProps {
  onLogin: (user: Member) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock user data based on "login"
      const mockUser: Member = {
        id: 'u_' + Date.now(),
        name: email.split('@')[0] || '设计师',
        role: '设计主管',
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${email || 'alex'}&backgroundColor=e5e7eb`
      };
      setIsLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoUser: Member = {
        id: 'u1',
        name: 'Alex Chen',
        role: '高级工业设计师',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=e0e7ff'
      };
      setIsLoading(false);
      onLogin(demoUser);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-emerald-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10 animate-fadeIn">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-6">
            <span className="text-white font-bold text-3xl">D</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">DesignFlow AI</h1>
          <p className="text-slate-400">工业设计项目智能管理平台</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">工作邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="name@designstudio.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  登录系统
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/50">
            <button 
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-2 bg-slate-800/30 hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700"
            >
              <Sparkles size={14} className="text-amber-400" />
              试用演示账号 (无需密码)
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          © 2024 DesignFlow AI. Designed for Industrial Designers.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
