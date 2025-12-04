
import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Loader2, Sparkles, User, Briefcase, ChevronLeft } from 'lucide-react';
import { Member } from '../types';

interface LoginScreenProps {
  onLogin: (user: Member) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('工业设计师');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock user data based on "login"
      const mockUser: Member = {
        id: 'u_' + Date.now(),
        name: loginEmail.split('@')[0] || '设计师',
        role: '设计主管',
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${loginEmail || 'alex'}&backgroundColor=e5e7eb`
      };
      setIsLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
        const newUser: Member = {
            id: 'u_' + Date.now(),
            name: name,
            role: role,
            avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}&backgroundColor=e0e7ff`
        };
        setIsLoading(false);
        onLogin(newUser);
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

  const toggleMode = () => {
      setIsRegistering(!isRegistering);
      // Reset forms
      setLoginEmail('');
      setLoginPassword('');
      setName('');
      setEmail('');
      setPassword('');
      setRole('工业设计师');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-emerald-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="mb-8 text-center animate-fadeIn">
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-6">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">DesignFlow AI</h1>
          <p className="text-slate-400 text-sm">工业设计项目智能管理平台</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl transition-all duration-300">
          
          {/* Header Switch */}
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                  {isRegistering ? '创建新账号' : '登录系统'}
              </h2>
              {isRegistering && (
                  <button 
                    onClick={toggleMode}
                    className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-xs"
                  >
                      <ChevronLeft size={14} /> 返回登录
                  </button>
              )}
          </div>

          {isRegistering ? (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">全名</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="Alex Chen"
                  />
                </div>
              </div>

               <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">工作邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="name@design.com"
                  />
                </div>
              </div>

               <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">职位 / 角色</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
                  >
                      <option>工业设计师</option>
                      <option>设计主管</option>
                      <option>结构工程师</option>
                      <option>CMF 设计师</option>
                      <option>项目经理</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">设置密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    注册并登录
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">工作邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="name@designstudio.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">密码</label>
                    <a href="#" className="text-[10px] text-indigo-400 hover:text-indigo-300">忘记密码?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    登录系统
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Switching Logic */}
          {!isRegistering && (
            <div className="mt-6 pt-5 border-t border-slate-800/50">
                <button 
                onClick={handleDemoLogin}
                className="w-full mb-3 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition-colors py-2 bg-slate-800/30 hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700"
                >
                <Sparkles size={14} className="text-amber-400" />
                试用演示账号
                </button>
                
                <p className="text-center text-xs text-slate-500">
                    还没有账号? <button onClick={toggleMode} className="text-indigo-400 hover:text-indigo-300 font-medium">立即注册</button>
                </p>
            </div>
          )}
           {isRegistering && (
            <div className="mt-6 pt-5 border-t border-slate-800/50">
                <p className="text-center text-xs text-slate-500">
                    已有账号? <button onClick={toggleMode} className="text-indigo-400 hover:text-indigo-300 font-medium">直接登录</button>
                </p>
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-widest">
          © 2024 DesignFlow AI
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
