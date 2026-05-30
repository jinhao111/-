import { useState, useEffect } from 'react';
import { Search, Bell, Sun, Moon, Menu, ChevronLeft, Maximize2, Minimize2 } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchValueChange: (val: string) => void;
  onNotificationClick: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  userProfile?: UserProfile;
  onProfileClick?: () => void;
}

export default function Header({
  title,
  subtitle,
  searchPlaceholder = '搜索任务、人员或日志...',
  searchValue,
  onSearchValueChange,
  onNotificationClick,
  isSidebarCollapsed,
  onToggleSidebar,
  userProfile,
  onProfileClick
}: HeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <header id="romer-header" className={`h-16 fixed top-0 right-0 bg-surface-container/70 backdrop-blur-xl border-b border-outline-variant flex items-center justify-between px-8 z-40 transition-all duration-300 ${isSidebarCollapsed ? 'left-0' : 'left-64'}`}>
      
      {/* Title & Search Panel */}
      <div className="flex items-center gap-6">
        {/* Toggle Sidebar Collapse Trigger */}
        <button
          onClick={onToggleSidebar}
          id="header-sidebar-toggle-btn"
          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all duration-150 cursor-pointer flex items-center justify-center -ml-2"
          title={isSidebarCollapsed ? "展开工作区侧栏" : "全屏内容区 (收起工作区侧栏)"}
        >
          {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className="flex items-center gap-4">
          <h1 className="font-headline text-base sm:text-lg font-semibold text-on-surface leading-none truncate max-w-[120px] sm:max-w-none">{title}</h1>
          {subtitle && (
            <>
              <div className="h-4 w-[1px] bg-outline-variant hidden sm:block"></div>
              <span className="text-on-surface-variant text-sm font-medium hidden sm:block truncate max-w-[200px] md:max-w-none">{subtitle}</span>
            </>
          )}
          {isSidebarCollapsed && (
            <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded font-mono font-bold tracking-widest animate-pulse hidden md:inline-block">
              FULL_SCREEN
            </span>
          )}
        </div>
        
        {/* Dynamic Interactive Input */}
        <div id="header-search-wrapper" className="relative group transition-transform duration-200">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors duration-150" />
          <input
            type="text"
            id="header-search-input"
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded px-10 py-1.5 text-sm w-72 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all duration-150 placeholder:text-on-surface-variant/40 text-on-surface"
            placeholder={searchPlaceholder}
          />
        </div>
      </div>

      {/* Global Metadata & Utilities */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onNotificationClick}
            id="header-bell-btn"
            className="relative material-symbols-custom text-on-surface-variant hover:text-primary transition-all duration-150 cursor-pointer p-1 rounded-full hover:bg-white/5 active:scale-90"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface animate-bounce"></span>
          </button>
          
          {/* Native HTML5 Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            id="header-fullscreen-btn"
            className="text-on-surface-variant hover:text-primary transition-all duration-150 cursor-pointer p-1 rounded-full hover:bg-white/5 active:scale-90 flex items-center justify-center"
            title={isFullscreen ? "退出网页全屏" : "进入网页全屏"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          <button
            id="header-theme-btn"
            className="material-symbols-custom text-on-surface-variant hover:text-primary transition-all duration-150 cursor-pointer p-1 rounded-full hover:bg-white/5 active:scale-90"
          >
            <Moon size={18} />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-outline-variant"></div>

        {/* User Account Console Panel */}
        <div 
          id="header-user-avatar-trigger" 
          onClick={onProfileClick}
          className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-lg hover:bg-white/5 transition-colors duration-150"
          title="点击修改个人信息与结算信息"
        >
          <div className="text-right">
            <p className="text-sm font-semibold text-on-surface leading-none group-hover:text-primary transition-colors duration-200">
              {userProfile?.name || '系统管理员'}
            </p>
            <p className="text-xs font-mono text-outline uppercase tracking-tighter mt-1">Admin Access</p>
          </div>
          <div className="h-10 w-10 rounded-full border border-primary/30 overflow-hidden group-hover:border-primary transition-all duration-200 bg-surface-container-highest flex items-center justify-center">
            <img 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsIfOpLepjvQomAvsdh78uUkCtsALUbpszI-PA7_WHEwNVMwY8GPXYHMCjD6LEmNBW3--hLJ_MnFt0i7hKdntbEnGf93CiDs3n5er4BEJ8sVDiMj1zbWEBh6Wl1D1zg1UK2MVsdtjPW_qJ2BhFEn-nBPaqgbuj-BE71V9HE2ZW8V-sSlyqDBoSI8MBo5pOm-DOKJXW8UXkya98ygyfhz9BWuVx3SIUYYKSo3PdXTMXsDz4zz4FXVaPvaLVkBATZz_5-ZPROdbXC6hr" 
            />
          </div>
        </div>
      </div>

    </header>
  );
}
