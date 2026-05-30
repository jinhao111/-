import React, { useState } from 'react';
import { 
  Database, 
  Clock, 
  RefreshCw, 
  DollarSign, 
  Plus, 
  CheckSquare, 
  HelpCircle, 
  TrendingUp, 
  UserPlus, 
  AlertTriangle, 
  UploadCloud, 
  ExternalLink 
} from 'lucide-react';
import { DashboardLog, ActiveView } from '../types';

interface DashboardViewProps {
  onNavigate: (view: ActiveView) => void;
  logs: DashboardLog[];
  metrics: {
    totalLabel: number;
    pendingCount: number;
    activeCount: number;
    estimatedProfit: number;
  };
  userRole?: 'admin' | 'labeler';
}

export default function DashboardView({ onNavigate, logs, metrics, userRole = 'labeler' }: DashboardViewProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; pass: number } | null>(null);
  const [activeRange, setActiveRange] = useState<'7days' | '30days'>('7days');
  const [svgCursorX, setSvgCursorX] = useState<number | null>(null);

  // Mapped dataset matching the chart data in mockups (7 data points)
  const chartPoints = [
    { label: '05-01', volume: 150, passRate: 80, x: 0 },
    { label: '05-02', volume: 120, passRate: 85, x: 100 },
    { label: '05-03', volume: 160, passRate: 82, x: 200 },
    { label: '05-04', volume: 100, passRate: 88, x: 300 },
    { label: '05-05', volume: 130, passRate: 85, x: 400 },
    { label: '05-06', volume: 40,  passRate: 90, x: 500 }, // Peak in workflow terms
    { label: '05-07', volume: 90,  passRate: 92, x: 600 },
    { label: '05-08', volume: 70,  passRate: 94, x: 700 },
    { label: '05-09', volume: 50,  passRate: 95, x: 800 },
  ];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const percentageX = relativeX / rect.width;
    const svgX = percentageX * 800; // mapped to SVG viewBox scale

    // Find nearest point
    let nearest = chartPoints[0];
    let minDiff = Math.abs(svgX - nearest.x);
    for (let i = 1; i < chartPoints.length; i++) {
      const diff = Math.abs(svgX - chartPoints[i].x);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = chartPoints[i];
      }
    }

    setSvgCursorX(nearest.x);
    setHoveredPoint({
      x: nearest.x,
      y: nearest.volume,
      val: Math.round((200 - nearest.volume) * 620), // conversion ratio
      pass: nearest.passRate
    });
  };

  const handleMouseLeave = () => {
    setSvgCursorX(null);
    setHoveredPoint(null);
  };

  return (
    <div id="dashboard-view-root" className="animate-fade-in space-y-8">
      {/* Telemetry Indicator Breadcrumbs */}
      <section className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-primary text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${userRole === 'labeler' ? 'bg-secondary' : 'bg-primary'}`}></span>
            {userRole === 'labeler' ? 'ANNOTATOR COMPILER / 我的标定工作台' : 'Operational Intelligence / 系统控制台'}
          </p>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
            {userRole === 'labeler' ? '我的标定绩效与工作台' : '系统概览与实时监控'}
            <span className="text-on-surface-variant text-xs font-mono ml-4 opacity-40">
              {userRole === 'labeler' ? 'LABELER_WORKSTATION_V4' : 'ADMIN_DASHBOARD_V4'}
            </span>
          </h2>
        </div>

        {/* Action CTAs */}
        <div className="flex gap-3">
          <button
            id="dash-btn-add-task"
            onClick={() => onNavigate('tasks')}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high border border-outline-variant text-on-surface text-sm font-bold rounded-2xl hover:bg-surface-container-highest transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Plus size={16} className={userRole === 'labeler' ? 'text-secondary' : 'text-primary'} />
            <span>{userRole === 'labeler' ? '领用标定任务' : '发布新任务'}</span>
          </button>
          
          <button
            id="dash-btn-approvals"
            onClick={() => onNavigate('approvals')}
            className={`flex items-center gap-2 px-5 py-2.5 text-zinc-950 text-sm font-bold rounded-2xl hover:brightness-110 shadow-lg transition-all duration-200 active:scale-95 cursor-pointer ${
              userRole === 'labeler' 
                ? 'bg-secondary shadow-secondary/10' 
                : 'bg-primary shadow-primary/10'
            }`}
          >
            <CheckSquare size={16} />
            <span>{userRole === 'labeler' ? '查阅提报状态' : '批量审批中心'}</span>
          </button>
        </div>
      </section>

      {/* Metrics High-Density Board Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1 */}
        <div 
          id="metric-card-total" 
          onClick={() => onNavigate('tasks')}
          className={`glass-panel p-6 rounded-2xl flex flex-col hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer ${
            userRole === 'labeler' ? 'hover:border-secondary/60 hover:shadow-[0_0_20px_rgba(235,193,255,0.15)]' : 'hover:border-primary/60 hover:shadow-[0_0_20px_rgba(194,193,255,0.15)]'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-on-surface-variant uppercase text-xs tracking-wider font-bold">
              {userRole === 'labeler' ? '我的标定完成量' : '标注总量'}
            </span>
            <Database size={18} className={userRole === 'labeler' ? 'text-secondary' : 'text-primary'} />
          </div>
          <h3 className="font-headline text-3xl text-white font-bold mb-1 font-mono">
            {userRole === 'labeler' 
              ? Math.floor(metrics.totalLabel * 0.082).toLocaleString() 
              : metrics.totalLabel.toLocaleString()}
          </h3>
          <div className="flex items-center gap-2 mt-auto">
            <span className={`text-xs font-mono font-bold ${userRole === 'labeler' ? 'text-secondary' : 'text-primary'}`}>
              {userRole === 'labeler' ? '+18.4%' : '+12.5%'}
            </span>
            <span className="text-xs text-outline">{userRole === 'labeler' ? 'VS 上期效能' : 'VS 上周'}</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div 
          id="metric-card-pending" 
          onClick={() => onNavigate('approvals')}
          className={`glass-panel p-6 rounded-2xl flex flex-col hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer ${
            userRole === 'labeler' ? 'hover:border-secondary/60 hover:shadow-[0_0_20px_rgba(235,193,255,0.15)]' : 'hover:border-error/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-on-surface-variant uppercase text-xs tracking-wider font-bold">
              {userRole === 'labeler' ? '我的提报审批中' : '待审批项'}
            </span>
            <AlertTriangle size={18} className={userRole === 'labeler' ? 'text-secondary font-bold' : 'text-error'} />
          </div>
          <h3 className="font-headline text-3xl text-white font-bold mb-1 font-mono">
            {userRole === 'labeler' ? 3 : metrics.pendingCount}
          </h3>
          <div className="flex items-center gap-2 mt-auto">
            <span className={`text-xs font-mono font-bold ${userRole === 'labeler' ? 'text-secondary' : 'text-error'}`}>
              {userRole === 'labeler' ? '1,200 帧点云' : '-5.2%'}
            </span>
            <span className="text-xs text-outline">{userRole === 'labeler' ? '排队待终审' : '优先级: 高'}</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div 
          id="metric-card-active" 
          onClick={() => onNavigate('tasks')}
          className={`glass-panel p-6 rounded-2xl flex flex-col hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer ${
            userRole === 'labeler' ? 'hover:border-secondary/60 hover:shadow-[0_0_20px_rgba(235,193,255,0.15)]' : 'hover:border-secondary/60 hover:shadow-[0_0_20px_rgba(194,193,255,0.15)]'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-on-surface-variant uppercase text-xs tracking-wider font-bold">
              {userRole === 'labeler' ? '我的进行中包件' : '进行中任务'}
            </span>
            <RefreshCw size={18} className="text-secondary animate-spin-slow" />
          </div>
          <h3 className="font-headline text-3xl text-white font-bold mb-1 font-mono">
            {userRole === 'labeler' ? 2 : metrics.activeCount}
          </h3>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-xs font-mono text-secondary font-bold">
              {userRole === 'labeler' ? '剩余 4 提报项' : '+2'}
            </span>
            <span className="text-xs text-outline">{userRole === 'labeler' ? '限期 5d' : '新增分配'}</span>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div 
          id="metric-card-profit" 
          onClick={() => onNavigate('salary')}
          className={`glass-panel p-6 rounded-2xl flex flex-col hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer ${
            userRole === 'labeler' ? 'hover:border-secondary/60 hover:shadow-[0_0_20px_rgba(235,193,255,0.15)]' : 'hover:border-primary/60 hover:shadow-[0_0_20px_rgba(194,193,255,0.15)]'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-on-surface-variant uppercase text-xs tracking-wider font-bold">
              {userRole === 'labeler' ? '我本月预估薪资' : '预估未结算'}
            </span>
            <DollarSign size={18} className={userRole === 'labeler' ? 'text-secondary' : 'text-primary'} />
          </div>
          <h3 className="font-headline text-3xl text-white font-bold mb-1 font-mono">
            ¥{(userRole === 'labeler' ? metrics.estimatedProfit * 0.082 : metrics.estimatedProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center gap-2 mt-auto">
            <span className={`text-xs font-mono font-bold ${userRole === 'labeler' ? 'text-secondary' : 'text-primary'}`}>
              {userRole === 'labeler' ? '开户卡已锁定' : '+8.4%'}
            </span>
            <span className="text-xs text-outline">{userRole === 'labeler' ? '实时核对中' : '实时计算'}</span>
          </div>
        </div>
      </section>

      {/* Charts & Interactive Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart Panel (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-headline text-lg font-bold text-white">
                {userRole === 'labeler' ? '我的标定能效分析' : '数据量质效统计大盘'}
              </h4>
              <p className="text-xs font-mono text-outline uppercase font-semibold">
                {userRole === 'labeler' ? 'My Labeling Speed vs. Quality Stream' : 'Daily Labeling Volume vs. Pass Rate'}
              </p>
            </div>

            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${userRole === 'labeler' ? 'bg-secondary' : 'bg-primary'}`}></span>
                <span className="text-xs font-mono text-on-surface uppercase font-bold">
                  {userRole === 'labeler' ? '我的成交量' : '全网标注量'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-outline border border-outline/50 border-dashed"></span>
                <span className="text-xs font-mono text-on-surface uppercase font-bold">
                  {userRole === 'labeler' ? '综合质检合格率' : '平均通过率'}
                </span>
              </div>

              <select 
                value={activeRange}
                onChange={(e) => setActiveRange(e.target.value as any)}
                className="bg-surface-container border border-outline-variant text-xs font-mono rounded px-2.5 py-1 focus:ring-1 focus:ring-primary outline-none cursor-pointer text-on-surface font-semibold"
              >
                <option value="7days">最近7天</option>
                <option value="30days">最近30天</option>
              </select>
            </div>
          </div>

          {/* SVG Animated Chart View */}
          <div className="h-64 w-full relative" id="performance-chart-container">
            <svg 
              className="w-full h-full overflow-visible" 
              preserveAspectRatio="none" 
              viewBox="0 0 800 200"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="lineGradDashboard" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#c2c1ff" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#c2c1ff" stopOpacity="0"></stop>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line stroke="rgba(70,69,84,0.2)" strokeWidth="1" x1="0" x2="800" y1="0" y2="0" />
              <line stroke="rgba(70,69,84,0.2)" strokeWidth="1" x1="0" x2="800" y1="50" y2="50" />
              <line stroke="rgba(70,69,84,0.2)" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" />
              <line stroke="rgba(70,69,84,0.2)" strokeWidth="1" x1="0" x2="800" y1="150" y2="150" />
              <line stroke="rgba(70,69,84,0.3)" strokeWidth="1" x1="0" x2="800" y1="200" y2="200" />

              {/* Scanning line cursor logic */}
              {svgCursorX !== null && (
                <line 
                  x1={svgCursorX} 
                  x2={svgCursorX} 
                  y1={0} 
                  y2={200} 
                  stroke="rgba(194,193,255,0.4)" 
                  strokeDasharray="4,2" 
                  strokeWidth={1.5}
                />
              )}

              {/* Gradient Area under curve */}
              <path 
                className="transition-all duration-300"
                d="M 0 150 L 100 120 L 200 160 L 300 100 L 400 130 L 500 40 L 600 90 L 700 70 L 800 50 L 800 200 L 0 200 Z"
                fill="url(#lineGradDashboard)"
              />

              {/* Primary Label Volume Curve */}
              <path 
                d="M 0 150 L 100 120 L 200 160 L 300 100 L 400 130 L 500 40 L 600 90 L 700 70 L 800 50" 
                fill="none" 
                stroke="#c2c1ff" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5}
                className="glow-stroke"
              />

              {/* Interactive Dots */}
              {chartPoints.map((pt, idx) => {
                const isHovered = svgCursorX === pt.x;
                return (
                  <g key={idx}>
                    <circle 
                      cx={pt.x} 
                      cy={pt.volume} 
                      r={isHovered ? 6 : 3} 
                      fill="#c2c1ff" 
                      className="transition-all duration-150 cursor-pointer"
                    />
                    {isHovered && (
                      <circle 
                        cx={pt.x} 
                        cy={pt.volume} 
                        r={12} 
                        fill="none" 
                        stroke="rgba(194, 193, 255, 0.3)" 
                        strokeWidth={4} 
                      />
                    )}
                  </g>
                );
              })}

              {/* Pass Rate Dotted Reference Curve */}
              <path 
                d="M 0 80 L 100 85 L 200 82 L 300 88 L 400 85 L 500 90 L 600 92 L 700 94 L 800 95" 
                fill="none" 
                stroke="#918f9f" 
                strokeDasharray="6,4" 
                strokeWidth={1.5}
              />
            </svg>

            {/* Hover Tooltip Overlay HUD */}
            {hoveredPoint && (
              <div 
                className="absolute bg-surface-container-high border border-primary/30 p-3 rounded-lg text-xs font-mono shadow-2xl transition-all duration-200 pointer-events-none"
                style={{
                  left: `${(hoveredPoint.x / 800) * 85}%`,
                  top: `${hoveredPoint.y - 12 > 20 ? hoveredPoint.y - 65 : hoveredPoint.y + 20}px`
                }}
              >
                <p className="font-bold text-primary">HUD Telemetry Stream</p>
                <p className="text-on-surface-variant font-medium mt-1">
                  标注数量: <span className="text-white">{hoveredPoint.val.toLocaleString()} Items</span>
                </p>
                <p className="text-on-surface-variant font-medium">
                  平均通过率: <span className="text-green-400">{hoveredPoint.pass}% ACC</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6 text-xs font-mono text-on-surface-variant uppercase tracking-wider border-t border-outline-variant/30 pt-4 font-bold">
            <span>05-01</span>
            <span>05-03</span>
            <span>05-05</span>
            <span>05-07</span>
            <span>05-09</span>
          </div>
        </div>

        {/* Recent Decisions Stream Panel (1 col) */}
        <div className="glass-panel rounded-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <h4 className="font-headline text-lg font-bold text-white">决策日志 (Recent Activity)</h4>
            <p className="text-xs font-mono text-outline uppercase font-semibold">Real-time Decision Stream</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px]">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="border-b border-outline-variant/30 p-4 flex gap-4 cursor-default transition-all hover:translate-x-1 hover:bg-white/5 group"
              >
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${log.color}`}>
                  {log.type === 'check_circle' && <CheckSquare size={14} />}
                  {log.type === 'person_add' && <UserPlus size={14} />}
                  {log.type === 'report_problem' && <AlertTriangle size={14} />}
                  {log.type === 'upload_file' && <UploadCloud size={14} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors leading-none">
                      {log.title}
                    </p>
                    <span className="font-mono text-xs text-outline ml-2 whitespace-nowrap font-bold">{log.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-snug">
                    {log.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button 
            id="dash-view-all-logs"
            onClick={() => onNavigate('approvals')}
            className="p-4 bg-surface-container-low text-center text-xs font-mono text-primary uppercase tracking-wider hover:underline hover:bg-surface-container transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none font-bold"
          >
            <span>查看所有审计日志</span>
            <ExternalLink size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
