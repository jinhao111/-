import { useState, useEffect } from 'react';
import { ActiveView, TaskItem, TeamMember, ApprovalSubmission, DashboardLog, UserProfile } from './types';
import { INITIAL_TASKS, INITIAL_TEAM, INITIAL_APPROVALS, INITIAL_LOGS } from './data';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import ApprovalsView from './components/ApprovalsView';
import TeamView from './components/TeamView';
import SalaryView from './components/SalaryView';
import OnboardingScreen from './components/OnboardingScreen';
import SuccessScreen from './components/SuccessScreen';
import ProfileModal from './components/ProfileModal';

export default function App() {
  // Router States
  const [activeView, setActiveView] = useState<ActiveView>('onboarding');
  
  // Layout States for Fullscreen
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }[]>([]);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('romer_user_profile');
    return saved ? JSON.parse(saved) : {
      name: '系统管理员',
      email: 'admin@romer.com',
      phone: '18888888888',
      cardNo: '6222 0210 1004 5678 910',
      cardBank: '中国工商银行北京分行',
      password: 'RomerAdmin2026!',
      role: 'admin'
    };
  });
  
  // Persist user profile state of choice
  useEffect(() => {
    localStorage.setItem('romer_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);
  
  // Database States (Safely synchronized with React context)
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('romer_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [submissions, setSubmissions] = useState<ApprovalSubmission[]>(() => {
    const saved = localStorage.getItem('romer_submissions');
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('romer_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [activityLogs, setActivityLogs] = useState<DashboardLog[]>(INITIAL_LOGS);

  // Global search input query
  const [searchTerm, setSearchTerm] = useState('');

  // Persisting states to client standard local storage trigger
  useEffect(() => {
    localStorage.setItem('romer_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('romer_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('romer_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Dynamic calculations for overall stats board KPIs
  const totalSubmissionsLabelCount = submissions
    .filter(s => s.status === 'approved')
    .reduce((sum, curr) => sum + curr.labelCount, 0);

  // Start with 1,280,000 baseline matching screenshots, then offset dynamically
  const KPI_TOTAL_LABELS = 1284500 + totalSubmissionsLabelCount;
  
  const KPI_PENDING_APPROVALS_COUNT = submissions.filter(s => s.status === 'pending').length;
  
  const KPI_ACTIVE_TASKS_COUNT = tasks.filter(t => t.status === 'active' || t.status === 'urgent').length;

  const totalPayout = submissions
    .filter(s => s.status === 'pending')
    .reduce((sum, curr) => sum + curr.estimatedPayout, 0);
  
  // Base baseline price ¥45,200 offset dynamically
  const KPI_ESTIMATED_PROFIT = 45200 + totalPayout;

  // Handlers for Tasks View CRUD
  const handleAddTask = (newTask: Omit<TaskItem, 'id'>) => {
    const nextIndex = tasks.length + 1;
    const paddedId = nextIndex.toString().padStart(3, '0');
    const item: TaskItem = {
      ...newTask,
      id: `#RM-2024-${paddedId}`
    };
    setTasks([item, ...tasks]);
    triggerToast(`任务 "${newTask.name}" 发布成功！`);

    // Push state action into decision log stream
    const newLog: DashboardLog = {
      id: `log-${Date.now()}`,
      time: '刚刚',
      title: `管道新任务：${newTask.name} 已发布`,
      text: `已向[${newTask.group}]广播分配该任务，截止日期 ${newTask.deadline}`,
      type: 'upload_file',
      color: 'text-primary bg-primary/10 hover:bg-primary/20'
    };
    setActivityLogs([newLog, ...activityLogs]);
  };

  const handleDeleteTask = (id: string) => {
    const t = tasks.find(item => item.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    if (t) {
      triggerToast(`任务 "${t.name}" 已从库中安全清退`, 'warning');
    }
  };

  const handleEditTask = (updatedTask: TaskItem) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    triggerToast(`任务 "${updatedTask.name}" 属性修改成功`);
  };

  // Handlers for Review Approvals View
  const handleApproveSubmission = (id: string) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'approved' } : s));
    triggerToast(`批次 ${id} 已审核通过，应付薪资已记账并发起划款流程`, 'success');
    
    const approvedSub = submissions.find(s => s.id === id);
    if (approvedSub) {
      const newLog: DashboardLog = {
        id: `log-${Date.now()}`,
        time: '刚刚',
        title: `数据核准通过：${approvedSub.id}`,
        text: `管理员批量通过了 124 条数据 [${approvedSub.taskName}]`,
        type: 'check_circle',
        color: 'text-primary bg-primary/10 hover:bg-primary/20'
      };
      setActivityLogs([newLog, ...activityLogs]);
    }
  };

  const handleRejectSubmission = (id: string) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
    triggerToast(`批次 ${id} 标注数据质量未达标，已被驳回重提`, 'error');
    
    // Inject alert log
    const rejectedSub = submissions.find(s => s.id === id);
    if (rejectedSub) {
      const newLog: DashboardLog = {
        id: `log-${Date.now()}`,
        time: '刚刚',
        title: `审批驳回限制警告`,
        text: `批次 ${rejectedSub.id} 分割精度检验异常，退回重提。`,
        type: 'report_problem',
        color: 'text-error bg-error/10 hover:bg-error/20'
      };
      setActivityLogs([newLog, ...activityLogs]);
    }
  };

  // Handlers for Team View addition
  const handleAddMember = (newMember: Omit<TeamMember, 'id' | 'initials'>) => {
    const initials = newMember.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const member: TeamMember = {
      ...newMember,
      id: initials + '-' + Math.floor(Math.random() * 90 + 10),
      initials
    };
    setTeamMembers([member, ...teamMembers]);
    triggerToast(`成员 ${newMember.name} 节点配置成功！已上线。`, 'success');

    // Add log
    const newLog: DashboardLog = {
      id: `log-${Date.now()}`,
      time: '刚刚',
      title: `授权增加新成员成功`,
      text: `${newMember.name} 作为 ${newMember.role} 加入，同步到节点：${newMember.node}`,
      type: 'person_add',
      color: 'text-secondary bg-secondary/10 hover:bg-secondary/20'
    };
    setActivityLogs([newLog, ...activityLogs]);
  };

  const handleAddSubmission = (sub: {
    taskName: string;
    labelCount: number;
    unit: string;
    payoutPrice: number;
    description: string;
  }) => {
    const initials = userProfile.name.substring(0, 2).toUpperCase() || 'LB';
    const newSub: ApprovalSubmission = {
      id: `#SB-${Math.floor(10000 + Math.random() * 90000)}`,
      userInitials: initials,
      userName: userProfile.name,
      taskName: sub.taskName,
      labelCount: sub.labelCount,
      unit: sub.unit,
      timestamp: '刚刚',
      status: 'pending',
      payoutPrice: sub.payoutPrice,
      estimatedPayout: sub.labelCount * sub.payoutPrice,
      deadline: '2026-06-15',
      progress: 0,
      annotationTypes: ['感知标定', sub.unit],
      description: sub.description
    };
    setSubmissions(prev => [newSub, ...prev]);
    triggerToast(`任务包数据已打包签名！待管理员节点审核。`, 'success');

    // Add log
    const newLog: DashboardLog = {
      id: `log-${Date.now()}`,
      time: '刚刚',
      title: `标定项完成提报上报`,
      text: `${userProfile.name} 提交了 ${sub.taskName} (共 ${sub.labelCount} 帧/点)，等待系统审核。`,
      type: 'upload_file',
      color: 'text-primary bg-primary/10 hover:bg-primary/20'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Switch router views handler
  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    setSearchTerm(''); // clear local filters on view transit
  };

  // Helper title strings mappings
  const viewTitles: Record<ActiveView, string> = (userProfile.role || 'labeler') === 'labeler' ? {
    onboarding: '安全配置初始化',
    success: '正在获取标注系统授权',
    dashboard: '我的标注面板',
    tasks: '标定任务申领大厅',
    approvals: '我的提报记录与审计',
    team: '数据节点效能榜',
    salary: '结薪核算账期单'
  } : {
    onboarding: '安全配置初始化',
    success: '正在获取系统授权',
    dashboard: '系统概览',
    tasks: '任务管理',
    approvals: '提报审批',
    team: '团队管理',
    salary: '薪资统计'
  };

  const viewSubtitles: Record<ActiveView, string> = (userProfile.role || 'labeler') === 'labeler' ? {
    onboarding: 'Romer Data systems v2.4',
    success: 'Romer OS Verified',
    dashboard: 'Romer Personal Workbench',
    tasks: 'Self-Claim Active Sorter Packs',
    approvals: 'My Processing Auditing Lines',
    team: 'Real-time Sorter Performance Node Ranks',
    salary: 'Romer Sorter Billing Ledger'
  } : {
    onboarding: 'Romer Data systems v2.4',
    success: 'Romer OS Verified',
    dashboard: 'Romer Operations Console',
    tasks: 'Romer Data Repository',
    approvals: 'Queue Active Submissions',
    team: 'Romer Data Labeling Sorters',
    salary: 'Romer Billing Engine V2.0'
  };

  // Render layouts
  if (activeView === 'onboarding') {
    return <OnboardingScreen onComplete={(role, name, email) => {
      setUserProfile(prev => ({
        ...prev,
        role,
        name,
        email
      }));
      setActiveView('success');
    }} />;
  }

  if (activeView === 'success') {
    return <SuccessScreen onBypass={() => setActiveView('dashboard')} />;
  }

  return (
    <div id="romer-workspace-shell" className="relative min-h-screen bg-[#070708] text-on-surface flex font-sans">
      
      {/* Structural Telemetry Grid Details overlay */}
      <div className="absolute inset-0 telemetry-grid pointer-events-none select-none z-0"></div>

      {/* Sidebar navigation */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
        pendingApprovalsCount={KPI_PENDING_APPROVALS_COUNT}
        isSidebarCollapsed={isSidebarCollapsed}
        userRole={userProfile.role || 'labeler'}
        onRoleToggle={() => {
          const nextRole = (userProfile.role || 'labeler') === 'labeler' ? 'admin' : 'labeler';
          setUserProfile(prev => ({ ...prev, role: nextRole }));
          triggerToast(`工作空间模式已切换至：${nextRole === 'labeler' ? '高通量标注员' : '超级管理员'}`, 'success');
        }}
      />

      {/* Primary content area */}
      <div className={`flex-grow flex flex-col min-h-screen relative z-10 select-none pb-12 transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-64'}`}>
        {/* Universal Top Header bar */}
        <Header 
          title={viewTitles[activeView]}
          subtitle={viewSubtitles[activeView]}
          searchValue={searchTerm}
          onSearchValueChange={setSearchTerm}
          onNotificationClick={() => setIsNotificationsPanelOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userProfile={userProfile}
          onProfileClick={() => setIsProfileModalOpen(true)}
        />

        {/* Content routing view container */}
        <main className="flex-grow pt-24 px-8 max-w-[1600px] w-full mx-auto select-text">
          {activeView === 'dashboard' && (
            <DashboardView 
              onNavigate={handleViewChange} 
              logs={activityLogs}
              metrics={{
                totalLabel: KPI_TOTAL_LABELS,
                pendingCount: KPI_PENDING_APPROVALS_COUNT,
                activeCount: KPI_ACTIVE_TASKS_COUNT,
                estimatedProfit: KPI_ESTIMATED_PROFIT
              }}
              userRole={userProfile.role || 'labeler'}
            />
          )}

          {activeView === 'tasks' && (
            <TasksView 
              tasks={tasks}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              search={searchTerm}
              userRole={userProfile.role || 'labeler'}
              onAddSubmission={handleAddSubmission}
            />
          )}

          {activeView === 'approvals' && (
            <ApprovalsView 
              submissions={submissions}
              onApprove={handleApproveSubmission}
              onReject={handleRejectSubmission}
              search={searchTerm}
              userRole={userProfile.role || 'labeler'}
              userName={userProfile.name}
            />
          )}

          {activeView === 'team' && (
            <TeamView 
              members={teamMembers}
              onAddMember={handleAddMember}
              search={searchTerm}
              userRole={userProfile.role || 'labeler'}
            />
          )}

          {activeView === 'salary' && (
            <SalaryView 
              search={searchTerm} 
              onShowToast={triggerToast}
              userRole={userProfile.role || 'labeler'}
              userName={userProfile.name}
            />
          )}
        </main>
      </div>

      {/* Dynamic Slide-out System Notifications Panel */}
      {isNotificationsPanelOpen && (
        <div id="notifications-drawer-overlay" className="fixed inset-0 z-50 flex justify-end">
          <div 
            onClick={() => setIsNotificationsPanelOpen(false)} 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          ></div>
          
          <div className="relative w-full max-w-[420px] h-full bg-[#0a0b0e]/95 border-l border-white/10 backdrop-blur-2xl shadow-2xl p-6 flex flex-col justify-between animate-[slide-left_0.25s_ease-out] z-50">
            {/* Styles for dynamic slide animation and telemetry logs */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes slide-left {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            ` }} />
            
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-mono text-primary uppercase tracking-widest font-black">Information Hub / 实时数据中心</h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">系统事件、决策历史与异常提报</p>
                </div>
                <button 
                  onClick={() => setIsNotificationsPanelOpen(false)}
                  className="p-1 px-2.5 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Status lights section */}
              <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-[10px] leading-relaxed">
                <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/20">
                  <p className="text-outline uppercase font-bold text-[8px] tracking-wider">Node Clustered</p>
                  <p className="text-green-400 font-extrabold mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    4/4 ACTIVE
                  </p>
                </div>
                <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/20">
                  <p className="text-outline uppercase font-bold text-[8px] tracking-wider">Sync Frequency</p>
                  <p className="text-primary font-extrabold mt-1">0.14s INTERVAL</p>
                </div>
              </div>

              {/* Activity logs stream */}
              <div className="flex-1 space-y-4 overflow-y-auto pr-1 pb-4">
                <p className="text-[10px] font-mono text-outline uppercase tracking-wider font-extrabold">审计追踪与决策历史 ({activityLogs.length})</p>
                
                <div className="space-y-3">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex gap-3 text-sm hover:border-white/10 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-white text-xs truncate mr-1">{log.title}</h4>
                          <span className="text-[9px] text-outline font-mono shrink-0">{log.time}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">{log.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant/20 pt-4 flex gap-3 font-mono">
              <button 
                onClick={() => {
                  setActivityLogs(INITIAL_LOGS);
                  triggerToast('通知缓存与调试日志已重置清零', 'info');
                }}
                className="flex-1 py-2.5 border border-outline-variant text-[#918f9f] rounded-lg text-[10px] font-black uppercase text-on-surface-variant hover:text-white hover:border-white/20 transition-all hover:bg-white/5 cursor-pointer text-center"
              >
                重置活动日志
              </button>
              <button 
                onClick={() => {
                  setIsNotificationsPanelOpen(false);
                  triggerToast('管道各级指标自检完毕: NORMAL_OPTIMAL', 'success');
                }}
                className="flex-1 py-2.5 bg-primary text-zinc-950 font-black rounded-lg text-[10px] uppercase hover:brightness-110 active:scale-95 transition-all cursor-pointer text-center"
              >
                运行系统自检
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Profile/Credentials Modifier Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSave={(updated) => {
          setUserProfile(updated);
          triggerToast('个人信息与结算账户同步升级成功！', 'success');
        }}
      />

      {/* Beautiful Global Glowing Toast Portal overlay */}
      <div id="toast-portal" className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const borderStyle = 
            toast.type === 'success' ? 'border-primary/40 bg-[#0c0d12]/95 shadow-primary/10' :
            toast.type === 'error' ? 'border-red-500/40 bg-[#0c0d12]/95 shadow-red-500/10' :
            toast.type === 'warning' ? 'border-yellow-500/40 bg-[#0c0d12]/95 shadow-yellow-500/10' :
            'border-white/10 bg-[#0c0d12]/95 shadow-white/5';
          const iconText = 
            toast.type === 'success' ? '✓' :
            toast.type === 'error' ? '✖' :
            toast.type === 'warning' ? '⚠' :
            'ℹ';
          const iconColor = 
            toast.type === 'success' ? 'text-primary' :
            toast.type === 'error' ? 'text-red-400' :
            toast.type === 'warning' ? 'text-yellow-400' :
            'text-blue-400';

          return (
            <div 
              key={toast.id} 
              className={`p-4 border rounded-xl flex items-start gap-3 shadow-2xl backdrop-blur-xl animate-[slide-up_0.25s_ease-out] pointer-events-auto ${borderStyle}`}
            >
              <span className={`font-black font-mono select-none ${iconColor}`}>{iconText}</span>
              <p className="text-xs text-white font-medium flex-1 leading-normal">{toast.message}</p>
            </div>
          );
        })}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slide-up {
            from { transform: translateY(15px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        ` }} />
      </div>

    </div>
  );
}
