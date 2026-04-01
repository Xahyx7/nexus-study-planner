import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, Clock, CalendarDays, BarChart3, 
  Plus, X, BellRing, ChevronRight, Play, 
  ArrowRight, Activity, Calendar, Zap, LayoutDashboard
} from 'lucide-react';

// --- CUSTOM CSS FOR 3D, ANIMATIONS & GEMINI-STYLE INTRO ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  :root {
    --bg-dark: #020617;
    --glass-bg: rgba(30, 41, 59, 0.4);
    --glass-border: rgba(255, 255, 255, 0.08);
    --primary-cyan: #06b6d4;
    --primary-blue: #3b82f6;
  }

  body {
    font-family: 'Outfit', sans-serif;
    background-color: var(--bg-dark);
    color: #f8fafc;
    overflow-x: hidden;
  }

  /* Gemini-style Aurora Background */
  .aurora-bg {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at 15% 50%, rgba(6, 182, 212, 0.15), transparent 25%),
                radial-gradient(circle at 85% 30%, rgba(59, 130, 246, 0.15), transparent 25%);
    z-index: -1;
    animation: pulse-aurora 10s infinite alternate linear;
  }

  @keyframes pulse-aurora {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.1); opacity: 1; }
  }

  /* 3D Glassmorphism Cards */
  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    box-shadow: 
      20px 20px 40px -6px rgba(0, 0, 0, 0.5),
      inset 0px 1px 1px rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
  }

  /* 3D Button */
  .btn-3d {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
    box-shadow: 
      0 4px 15px -3px rgba(6, 182, 212, 0.4),
      inset 0 1px 1px rgba(255, 255, 255, 0.4),
      inset 0 -2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }
  .btn-3d:active {
    transform: translateY(2px);
    box-shadow: 
      0 2px 5px -2px rgba(6, 182, 212, 0.4),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Intro Animation */
  .intro-overlay {
    position: fixed;
    inset: 0;
    background: var(--bg-dark);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .intro-text-wrapper {
    position: relative;
    overflow: hidden;
  }

  .intro-text {
    font-size: 4rem;
    font-weight: 700;
    background: linear-gradient(to right, #fff, #3b82f6, #06b6d4, #fff);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shine 3s linear forwards, reveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform: translateY(100%);
  }

  @keyframes reveal {
    to { transform: translateY(0); }
  }
  @keyframes shine {
    to { background-position: 200% center; }
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
  
  /* Smooth Page Transitions */
  .page-enter {
    animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// --- UTILITY FUNCTIONS ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const formatTime = (timeString) => {
  if (!timeString) return '';
  const [h, m] = timeString.split(':');
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// --- COMPONENTS ---

// 1. Intro Animation Component
const IntroScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(false), 2500);
    const timer2 = setTimeout(() => onComplete(), 3500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [onComplete]);

  return (
    <div className={`intro-overlay ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_50%)] animate-pulse" />
      <div className="intro-text-wrapper">
        <h1 className="intro-text tracking-tight text-center">NEXUS<br/><span className="text-2xl font-light tracking-[0.2em] text-cyan-400/80">STUDY PLANNER</span></h1>
      </div>
    </div>
  );
};

// 2. Toast Notification Component
const Toast = ({ message, type = 'info', onClose }) => (
  <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl glass-card border border-white/10 shadow-2xl animate-[fadeUp_0.3s_ease-out] max-w-sm`}>
    {type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <BellRing className="w-5 h-5 text-cyan-400 animate-bounce" />}
    <p className="text-sm font-medium text-slate-200">{message}</p>
    <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition-colors">
      <X className="w-4 h-4" />
    </button>
  </div>
);

// 3. Main Application
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard', 'analytics'
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form State
  const [newTask, setNewTask] = useState({ title: '', startTime: '', endTime: '' });

  // Initialize clock and notification checker
  useEffect(() => {
    // Request Native Notification Permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check for notifications
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;
      const today = getTodayDateString();

      tasks.forEach(task => {
        if (task.date === today && task.status === 'pending') {
          // Calculate 10 mins before
          const [startH, startM] = task.startTime.split(':').map(Number);
          const startDate = new Date();
          startDate.setHours(startH, startM, 0);
          const reminderTime = new Date(startDate.getTime() - 10 * 60000);
          
          const remH = reminderTime.getHours().toString().padStart(2, '0');
          const remM = reminderTime.getMinutes().toString().padStart(2, '0');
          const remString = `${remH}:${remM}`;

          if (currentTimeString === remString && !task.notified10m) {
            showNotification(`Upcoming in 10 mins: ${task.title}`);
            updateTask(task.id, { notified10m: true });
          } else if (currentTimeString === task.startTime && !task.notifiedStart) {
            showNotification(`Time to start: ${task.title}!`);
            updateTask(task.id, { notifiedStart: true });
          }
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(timer);
  }, [tasks]);

  const showNotification = (msg) => {
    // In-app Toast
    setToast({ message: msg, type: 'info' });
    setTimeout(() => setToast(null), 5000);
    
    // Native Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification("Nexus Study", { body: msg, icon: '📚' });
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.startTime || !newTask.endTime) return;
    
    const task = {
      ...newTask,
      id: generateId(),
      date: getTodayDateString(),
      status: 'pending', // pending, completed, delayed
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, task].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    setNewTask({ title: '', startTime: '', endTime: '' });
    setIsModalOpen(false);
    
    setToast({ message: 'Task scheduled successfully!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleTaskAction = (id, action) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (action === 'complete') {
      updateTask(id, { status: 'completed' });
    } else if (action === 'extend') {
      // Add 15 mins to end time
      const [eh, em] = task.endTime.split(':').map(Number);
      const d = new Date(); d.setHours(eh, em + 15);
      const newEndTime = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      updateTask(id, { endTime: newEndTime });
      showNotification(`Extended ${task.title} by 15 mins`);
    } else if (action === 'delay') {
      // Move to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      updateTask(id, { 
        status: 'delayed', 
        date: tomorrow.toISOString().split('T')[0],
        notified10m: false, 
        notifiedStart: false 
      });
      showNotification(`Moved ${task.title} to tomorrow`);
    }
  };

  const todayTasks = useMemo(() => {
    const today = getTodayDateString();
    return tasks.filter(t => t.date === today);
  }, [tasks]);

  const completedToday = todayTasks.filter(t => t.status === 'completed').length;
  const progress = todayTasks.length === 0 ? 0 : Math.round((completedToday / todayTasks.length) * 100);

  // --- RENDERERS ---

  const renderDashboard = () => (
    <div className="page-enter space-y-8 pb-24 md:pb-6">
      {/* Header Profile/Progress Area */}
      <section className="glass-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-cyan-500/20 transition-all duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Hello, Scholar
            </h2>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-cyan-400" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5 w-full md:w-auto">
            <div className="relative w-14 h-14 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-cyan-400 transition-all duration-1000 ease-out" strokeDasharray={`${progress}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {progress}%
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">Today's Progress</p>
              <p className="text-xs text-slate-500">{completedToday} of {todayTasks.length} tasks completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Task List */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Today's Mission
          </h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-3d flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white md:hidden"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="glass-card p-12 text-center border-dashed border-2 border-white/10">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-lg font-medium text-slate-300">No tasks for today</p>
            <p className="text-sm text-slate-500 mt-2">Take a break, or schedule your next study session.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayTasks.map(task => (
              <div key={task.id} className={`glass-card p-5 transition-all duration-300 ${task.status === 'completed' ? 'opacity-50 grayscale select-none' : 'hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]'}`}>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center shadow-inner ${task.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-cyan-400 border border-white/5'}`}>
                      {task.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Play className="w-5 h-5 ml-1" />}
                    </div>
                    <div>
                      <h4 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 text-sm font-medium text-slate-400 bg-slate-900/50 w-fit px-2.5 py-1 rounded-lg border border-white/5">
                        <Clock className="w-3.5 h-3.5 text-cyan-500" />
                        {formatTime(task.startTime)} - {formatTime(task.endTime)}
                      </div>
                    </div>
                  </div>

                  {task.status === 'pending' && (
                    <div className="flex items-center gap-2 sm:self-center border-t border-white/5 pt-4 sm:pt-0 sm:border-t-0 sm:pl-4">
                      <button onClick={() => handleTaskAction(task.id, 'extend')} className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/5 transition-colors">
                        +15m
                      </button>
                      <button onClick={() => handleTaskAction(task.id, 'delay')} className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/5 transition-colors">
                        Tomorrow
                      </button>
                      <button onClick={() => handleTaskAction(task.id, 'complete')} className="flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderAnalytics = () => {
    // Generate dummy data based on actual tasks for visual representation
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
      <div className="page-enter space-y-8 pb-24 md:pb-6">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
            <Activity className="w-6 h-6 text-blue-400" /> Performance Analytics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
             <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-white">{tasks.length}</p>
             </div>
             <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-400">{tasks.filter(t => t.status === 'completed').length}</p>
             </div>
             <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm mb-1">Delayed</p>
                <p className="text-3xl font-bold text-orange-400">{tasks.filter(t => t.status === 'delayed').length}</p>
             </div>
          </div>

          <h3 className="text-lg font-medium mb-4 text-slate-200">Weekly Overview</h3>
          <div className="h-64 flex items-end justify-between gap-2 pb-6 border-b border-white/10">
            {days.map((day, i) => {
              // Mock height logic for visual flair, using real data if it matches today
              const isToday = new Date().getDay() === (i + 1 === 7 ? 0 : i + 1);
              let hComplete = isToday ? (completedToday * 20) : Math.floor(Math.random() * 60) + 10;
              let hPending = isToday ? ((todayTasks.length - completedToday) * 20) : Math.floor(Math.random() * 30);
              
              if (hComplete > 100) hComplete = 100;
              if (hPending > 100) hPending = 100 - hComplete;

              return (
                <div key={day} className="flex flex-col items-center flex-1 gap-2 group">
                  <div className="w-full max-w-[40px] h-48 flex flex-col justify-end gap-1 relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-slate-800 px-2 py-1 rounded text-white z-10 whitespace-nowrap pointer-events-none border border-white/10">
                      {isToday ? todayTasks.length : Math.floor((hComplete + hPending)/15)} tasks
                    </div>
                    {/* Pending Bar */}
                    <div 
                      className="w-full bg-slate-700/50 rounded-t-sm transition-all duration-500 ease-out" 
                      style={{ height: `${hPending}%` }}
                    />
                    {/* Completed Bar */}
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all duration-500 ease-out" 
                      style={{ height: `${hComplete}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${isToday ? 'text-cyan-400' : 'text-slate-500'}`}>{day}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div><span className="text-slate-300">Completed</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-600"></div><span className="text-slate-300">Pending/Missed</span></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{globalStyles}</style>
      
      {showIntro ? (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      ) : (
        <div className="min-h-screen relative flex flex-col md:flex-row max-w-7xl mx-auto selection:bg-cyan-500/30">
          <div className="aurora-bg" />
          
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

          {/* SIDEBAR (Desktop) */}
          <aside className="hidden md:flex flex-col w-64 p-6 border-r border-white/5 min-h-screen sticky top-0 bg-slate-900/20 backdrop-blur-3xl z-40">
            <div className="flex items-center gap-3 mb-12 px-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-wide text-white">NEXUS</h1>
            </div>

            <nav className="flex-1 space-y-2">
              <button onClick={() => setCurrentTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentTab === 'dashboard' ? 'bg-white/10 text-cyan-400 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              <button onClick={() => setCurrentTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentTab === 'analytics' ? 'bg-white/10 text-cyan-400 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </button>
            </nav>

            <button onClick={() => setIsModalOpen(true)} className="btn-3d w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-semibold mt-auto">
              <Plus className="w-5 h-5" /> New Session
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 p-4 md:p-8 lg:p-10 min-h-screen relative z-10">
            {/* Mobile Header */}
            <header className="md:hidden flex justify-between items-center mb-6 px-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-wide">NEXUS</h1>
              </div>
              <div className="text-xs font-medium text-cyan-400 bg-cyan-950/50 px-3 py-1.5 rounded-full border border-cyan-500/20">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </header>

            {currentTab === 'dashboard' ? renderDashboard() : renderAnalytics()}
          </main>

          {/* BOTTOM NAV (Mobile) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card rounded-b-none border-b-0 border-x-0 p-4 pb-safe flex justify-around items-center z-40 bg-slate-900/80">
            <button onClick={() => setCurrentTab('dashboard')} className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-500'}`}>
              <LayoutDashboard className="w-6 h-6" />
              <span className="text-[10px] font-medium">Tasks</span>
            </button>
            <div className="-mt-10 relative">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl scale-150 pointer-events-none"></div>
              <button onClick={() => setIsModalOpen(true)} className="btn-3d relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-[#020617]">
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <button onClick={() => setCurrentTab('analytics')} className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'analytics' ? 'text-cyan-400' : 'text-slate-500'}`}>
              <BarChart3 className="w-6 h-6" />
              <span className="text-[10px] font-medium">Stats</span>
            </button>
          </nav>

          {/* ADD TASK MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
              <div className="glass-card w-full max-w-md relative z-10 animate-[fadeUp_0.3s_ease-out] border border-white/20">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
                  <h3 className="text-xl font-semibold text-white">Schedule Study Session</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={addTask} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject / Task Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Physics Chapter 4 Revision"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Start Time</label>
                      <input 
                        type="time" 
                        required
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all [color-scheme:dark]"
                        value={newTask.startTime}
                        onChange={e => setNewTask({...newTask, startTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">End Time</label>
                      <input 
                        type="time" 
                        required
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all [color-scheme:dark]"
                        value={newTask.endTime}
                        onChange={e => setNewTask({...newTask, endTime: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button type="submit" className="btn-3d w-full py-3.5 rounded-xl font-semibold text-white tracking-wide shadow-lg">
                      Start Tracking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
}
