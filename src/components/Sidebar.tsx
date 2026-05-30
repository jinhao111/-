import { ActiveView } from '../types';
import { 
  Terminal, 
  LayoutDashboard, 
  ClipboardList, 
  FileCheck, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  pendingApprovalsCount: number;
  isSidebarCollapsed: boolean;
  userRole?: 'admin' | 'labeler';
  onRoleToggle?: () => void;
}

export default function Sidebar({ 
  activeView, 
  onViewChange, 
  pendingApprovalsCount, 
  isSidebarCollapsed,
  userRole = 'labeler',
  onRoleToggle
}: SidebarProps) {
  const navItems = userRole === 'labeler' ? [
    { id: 'dashboard' as ActiveView, label: '标注工作台', icon: LayoutDashboard },
    { id: 'tasks' as ActiveView, label: '标定任务大厅', icon: ClipboardList },
    { id: 'approvals' as ActiveView, label: '我的提报记录', icon: FileCheck },
    { id: 'team' as ActiveView, label: '团队效能排行', icon: Users },
    { id: 'salary' as ActiveView, label: '结算账期单', icon: CreditCard },
  ] : [
    { id: 'dashboard' as ActiveView, label: '控制台概览', icon: LayoutDashboard },
    { id: 'tasks' as ActiveView, label: '任务管线配置', icon: ClipboardList },
    { id: 'approvals' as ActiveView, label: '提报审批流', icon: FileCheck, badge: pendingApprovalsCount },
    { id: 'team' as ActiveView, label: '标定分组管理', icon: Users },
    { id: 'salary' as ActiveView, label: '薪资结算大盘', icon: CreditCard },
  ];

  return (
    <aside id="romer-sidebar" className={`h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface-container-low flex flex-col py-6 z-50 transition-all duration-300 transform ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div id="romer-logo" className="size-8 bg-primary rounded flex items-center justify-center text-on-primary shadow-[0_0_12px_rgba(194,193,255,0.4)]">
          <Terminal size={18} />
        </div>
        <div className="flex flex-col">
          <span className="font-headline text-lg font-bold text-white tracking-tighter leading-none">ROMER</span>
          <span className="font-mono text-xs text-outline uppercase tracking-widest mt-1">Data Systems v2.4</span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-primary bg-primary-container/10 border-r-2 border-primary font-bold font-medium shadow-inner'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-primary' : 'text-on-surface-variant'} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20 text-xs font-bold rounded-full font-mono transition-colors">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Utility Actions */}
      <div className="mt-auto px-3 border-t border-outline-variant/30 pt-4 flex flex-col gap-1.5">
        {onRoleToggle && (
          <button
            id="nav-btn-role-toggle"
            onClick={onRoleToggle}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all text-left cursor-pointer font-bold select-none border ${
              userRole === 'labeler'
                ? 'text-primary bg-primary/5 hover:bg-primary/10 border-primary/10 hover:border-primary/30'
                : 'text-secondary bg-secondary/5 hover:bg-secondary/10 border-secondary/10 hover:border-secondary/30'
            }`}
          >
            <div className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${userRole === 'labeler' ? 'bg-primary' : 'bg-secondary'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${userRole === 'labeler' ? 'bg-primary' : 'bg-secondary'}`}></span>
            </div>
            <span>工作权限：{userRole === 'labeler' ? '管理员模式' : '标注员模式'}</span>
          </button>
        )}
        <button
          id="nav-btn-settings"
          onClick={() => onViewChange('dashboard')} // Fallback or notification trigger
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all text-left cursor-pointer"
        >
          <Settings size={18} />
          <span>设置</span>
        </button>
        <button
          id="nav-btn-logout"
          onClick={() => onViewChange('onboarding')} // Simulated clean reset onboarding sequence!
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs text-on-surface-variant hover:text-error hover:bg-error-container/15 transition-all text-left cursor-pointer"
        >
          <LogOut size={18} />
          <span>控制台退登</span>
        </button>
      </div>
    </aside>
  );
}
