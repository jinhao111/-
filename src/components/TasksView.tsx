import React, { useState } from 'react';
import { 
  BarChart2, 
  Hourglass, 
  AlertCircle, 
  Plus, 
  Filter, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Calendar, 
  X, 
  FolderPlus 
} from 'lucide-react';
import { TaskItem } from '../types';

interface TasksViewProps {
  tasks: TaskItem[];
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: TaskItem) => void;
  search?: string;
  userRole?: 'admin' | 'labeler';
  onAddSubmission?: (sub: {
    taskName: string;
    labelCount: number;
    unit: string;
    payoutPrice: number;
    description: string;
  }) => void;
}

export default function TasksView({ 
  tasks, 
  onAddTask, 
  onDeleteTask, 
  onEditTask, 
  search = '',
  userRole = 'labeler',
  onAddSubmission
}: TasksViewProps) {
  const [filterSlug, setFilterSlug] = useState<'all' | 'active' | 'urgent'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'CV' | 'NLP' | 'ASR'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Claimed task items for Labeler
  const [claimedTaskIds, setClaimedTaskIds] = useState<string[]>(['#RM-2024-001']);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitTask, setSubmitTask] = useState<TaskItem | null>(null);
  
  // Labeler submission states
  const [labelerCount, setLabelerCount] = useState('240');
  const [labelerLink, setLabelerLink] = useState('s3://romer-raw/labels-division-latest.zip');
  const [labelerComment, setLabelerComment] = useState('标定完成，点云精密度、框选边界已严格质检通过。');

  // Form States
  const [editId, setEditId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskCategory, setTaskCategory] = useState('计算机视觉 (CV)');
  const [deadline, setDeadline] = useState('2024-06-01');
  const [businessPrice, setBusinessPrice] = useState('1.25');
  const [labelPrice, setLabelPrice] = useState('0.85');

  // Interactive filtering of seed data
  const filteredTasks = tasks.filter(t => {
    if (filterSlug === 'active' && t.status !== 'active') return false;
    if (filterSlug === 'urgent' && t.status !== 'urgent') return false;

    // Category filter mapping
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'CV' && !t.group.includes('视觉')) return false;
      if (categoryFilter === 'NLP' && !t.group.includes('文本')) return false;
      if (categoryFilter === 'ASR' && !t.group.includes('语音')) return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.group.toLowerCase().includes(q)
      );
    }
    return true; // all
  });

  // Derived counts for stats row
  const activeCount = tasks.filter(t => t.status === 'active').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const urgentCount = tasks.filter(t => t.status === 'urgent').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const groupMapping: Record<string, string> = {
      '计算机视觉 (CV)': '视觉数据标注组',
      '自然语言处理 (NLP)': '文本语义组',
      '音频转写 (ASR)': '语音处理组'
    };

    if (isEditingMode && editId) {
      onEditTask({
        id: editId,
        name: taskName,
        group: groupMapping[taskCategory] || '通用数据组',
        priceLabel: parseFloat(labelPrice) || 0.1,
        priceAdmin: parseFloat(businessPrice) || 0.2,
        deadline,
        status: new Date(deadline) < new Date('2024-05-15') ? 'urgent' : 'active'
      });
    } else {
      onAddTask({
        name: taskName,
        group: groupMapping[taskCategory] || '通用数据组',
        priceLabel: parseFloat(labelPrice) || 0.1,
        priceAdmin: parseFloat(businessPrice) || 0.2,
        deadline,
        status: new Date(deadline) < new Date('2024-05-15') ? 'urgent' : 'active'
      });
    }

    // Reset Form
    setTaskName('');
    setEditId('');
    setIsEditingMode(false);
    setIsModalOpen(false);
  };

  const handleEditClick = (task: TaskItem) => {
    const revGroupMapping: Record<string, string> = {
      '视觉数据标注组': '计算机视觉 (CV)',
      '文本语义组': '自然语言处理 (NLP)',
      '语音处理组': '音频转写 (ASR)'
    };

    setEditId(task.id);
    setTaskName(task.name);
    setTaskCategory(revGroupMapping[task.group] || '计算机视觉 (CV)');
    setDeadline(task.deadline);
    setBusinessPrice(task.priceAdmin.toString());
    setLabelPrice(task.priceLabel.toString());
    setIsEditingMode(true);
    setIsModalOpen(true);
  };

  return (
    <div id="tasks-view-root" className="animate-fade-in space-y-8">
      {/* Dynamic Status Dashboard Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant font-mono text-[10px] tracking-widest uppercase">ACTIVE TASKS</span>
            <BarChart2 size={18} className="text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-4xl text-primary font-bold font-mono">{activeCount}</span>
            <span className="text-on-surface-variant text-sm">进行中</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant font-mono text-[10px] tracking-widest uppercase">PENDING APPROVAL</span>
            <Hourglass size={18} className="text-secondary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-4xl text-white font-bold font-mono">{pendingCount}</span>
            <span className="text-on-surface-variant text-sm">待审核</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-lg border-l-2 border-l-error">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant font-mono text-[10px] tracking-widest uppercase">URGENT DEADLINES</span>
            <AlertCircle size={18} className="text-error" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-4xl text-error font-bold font-mono">
              {urgentCount.toString().padStart(2, '0')}
            </span>
            <span className="text-on-surface-variant text-sm">即将截止</span>
          </div>
        </div>

        {/* Publish Task trigger Dotted Box or Labeler quick info */}
        {userRole === 'labeler' ? (
          <div className="glass-panel p-6 rounded-lg border-l-2 border-l-secondary flex flex-col justify-center bg-secondary/5">
            <div className="flex gap-2.5 items-center mb-1 text-secondary uppercase font-mono text-[9px] tracking-widest font-black">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-ping"></span>
              <span>RULE SPEC / 标定作业要规</span>
            </div>
            <p className="text-slate-100 text-xs font-bold leading-relaxed mb-1">
              由管理员分派的任务大厅。请选择并【申领标定任务】，并在完成后点击【提交数据成果】发起结算审批。
            </p>
            <span className="text-[10px] text-outline font-mono">CODE_STATUS: REALTIME_SYNC</span>
          </div>
        ) : (
          <div className="glass-panel p-1 rounded-lg">
            <button 
              id="tasks-trigger-add-modal"
              onClick={() => {
                setIsEditingMode(false);
                setTaskName('');
                setIsModalOpen(true);
              }}
              className="w-full h-full p-5 flex flex-col items-center justify-center gap-3 border border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group rounded-lg cursor-pointer"
            >
              <FolderPlus size={24} className="text-primary group-hover:scale-110 transition-transform duration-200" />
              <span className="text-chinese-base font-bold text-primary">发布新任务</span>
            </button>
          </div>
        )}
      </div>

      {/* Task Repository List Section */}
      <section className="glass-panel rounded-lg overflow-hidden border border-outline-variant/50">
        
        {/* Repository Control Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant bg-surface-container-high/30 flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <h2 className="font-mono text-xs tracking-widest text-on-surface-variant font-bold uppercase">TASK REPOSITORY</h2>
            
            {/* Filter Pills */}
            <div className="flex gap-2">
              <button 
                id="tasks-filter-all"
                onClick={() => setFilterSlug('all')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  filterSlug === 'all'
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border border-transparent'
                }`}
              >
                全部
              </button>
              
              <button 
                id="tasks-filter-active"
                onClick={() => setFilterSlug('active')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  filterSlug === 'active'
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border border-transparent'
                }`}
              >
                进行中
              </button>

              <button 
                id="tasks-filter-urgent"
                onClick={() => setFilterSlug('urgent')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  filterSlug === 'urgent'
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border border-transparent'
                }`}
              >
                已截止
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant relative">
            {/* Functional Category Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold font-mono outline-none ${categoryFilter !== 'all' ? 'bg-primary/25 border border-primary/35 text-primary' : 'hover:bg-surface-container-highest'}`}
                title="按分类筛选"
              >
                <Filter size={14} />
                {categoryFilter !== 'all' && <span>{categoryFilter}</span>}
              </button>

              {isFilterDropdownOpen && (
                <>
                  <div 
                    onClick={() => setIsFilterDropdownOpen(false)} 
                    className="fixed inset-0 z-40"
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-[#0e0f14] border border-white/10 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 font-sans text-xs">
                    <p className="text-[10px] font-mono text-outline uppercase px-2.5 py-1.5 font-bold border-b border-white/5">按技术品类筛选</p>
                    <button 
                      onClick={() => { setCategoryFilter('all'); setIsFilterDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${categoryFilter === 'all' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                    >
                      全部品类 (ALL)
                    </button>
                    <button 
                      onClick={() => { setCategoryFilter('CV'); setIsFilterDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${categoryFilter === 'CV' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                    >
                      计算机视觉 (CV)
                    </button>
                    <button 
                      onClick={() => { setCategoryFilter('NLP'); setIsFilterDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${categoryFilter === 'NLP' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                    >
                      自然语言处理 (NLP)
                    </button>
                    <button 
                      onClick={() => { setCategoryFilter('ASR'); setIsFilterDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${categoryFilter === 'ASR' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                    >
                      声音与语音处理 (ASR)
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Sync spinner indicator */}
            <button 
              onClick={() => {
                setIsSyncing(true);
                setTimeout(() => setIsSyncing(false), 1200);
              }}
              className={`p-1.5 hover:bg-surface-container-highest rounded-lg transition-colors cursor-pointer outline-none ${isSyncing ? 'text-primary' : ''}`}
              title="重新同步节点"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Data High Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-surface-container-lowest/50 text-on-surface-variant text-[11px] font-mono tracking-widest font-medium border-b border-outline-variant">
              <tr>
                <th className="p-4 pl-6 text-left">ID</th>
                <th className="p-4">任务名称</th>
                <th className="p-4">标注价格</th>
                <th className="p-4">{userRole === 'labeler' ? '我的承接状态' : '业务单价 (ADMIN)'}</th>
                <th className="p-4">截止日期</th>
                <th className="p-4 text-center">状态</th>
                <th className="p-4 pr-6 text-right">操作</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-on-surface-variant font-mono">
                    没有找到符合当前过滤条件的任务数据。
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-surface-container/50 transition-colors group">
                    <td className="p-4 pl-6 font-mono text-primary font-bold text-[13px]">{task.id}</td>
                    <td className="p-4 text-[14px]">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-100">{task.name}</span>
                        <span className="text-[10px] text-on-surface-variant mt-0.5">{task.group}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[13px] text-slate-300">
                      ¥ {task.priceLabel.toFixed(2)} 
                      <span className="text-[10px] text-outline ml-1">/{task.group.includes('语音') ? '分钟' : task.group.includes('文本') ? '项' : '帧'}</span>
                    </td>
                    <td className="p-4 font-mono text-[13px]">
                      {userRole === 'labeler' ? (
                        claimedTaskIds.includes(task.id) ? (
                          <span className="text-secondary font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                            配置已承接
                          </span>
                        ) : (
                          <span className="text-outline">大厅空闲</span>
                        )
                      ) : (
                        <span className="text-secondary">
                          ¥ {task.priceAdmin.toFixed(2)} 
                          <span className="text-[10px] text-outline ml-1">/{task.group.includes('语音') ? '分钟' : task.group.includes('文本') ? '项' : '帧'}</span>
                        </span>
                      )}
                    </td>
                    <td className={`p-4 font-mono text-[13px] ${task.status === 'urgent' ? 'text-error font-medium' : 'text-slate-300'}`}>
                      {task.deadline}
                    </td>
                    <td className="p-4 text-center">
                      {task.status === 'active' && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                          进行中
                        </div>
                      )}
                      {task.status === 'urgent' && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-error/10 border border-error/20 text-error text-[10px] font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          即将截止
                        </div>
                      )}
                      {task.status === 'pending' && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-highest border border-outline-variant text-on-surface-variant text-[10px] font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant opacity-40"></span>
                          待启动
                        </div>
                      )}
                    </td>
                    
                    {/* Action Panel */}
                    <td className="p-4 pr-6 text-right">
                      {userRole === 'labeler' ? (
                        <div className="flex justify-end gap-2">
                          {claimedTaskIds.includes(task.id) ? (
                            <button 
                              onClick={() => {
                                setSubmitTask(task);
                                setLabelerCount('250');
                                setIsSubmitModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] bg-secondary/15 border border-secondary/30 text-secondary hover:bg-secondary/25 hover:border-secondary/60 rounded font-bold cursor-pointer transition-colors outline-none"
                            >
                              提交成果
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                setClaimedTaskIds(prev => [...prev, task.id]);
                              }}
                              className="px-2.5 py-1 text-[11px] bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 hover:border-primary/60 rounded font-bold cursor-pointer transition-colors outline-none"
                            >
                              申领该包
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1.5 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button 
                            id={`tasks-edit-${task.id.replace('#', '')}`}
                            onClick={() => handleEditClick(task)}
                            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-surface-container"
                            title="编辑任务"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            id={`tasks-delete-${task.id.replace('#', '')}`}
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 text-on-surface-variant hover:text-error transition-colors cursor-pointer rounded-lg hover:bg-error-container/20"
                            title="删除任务"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Paginate Summary */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant text-[11px] font-mono text-on-surface-variant bg-surface-container-low/50">
          <span>SHOWING 1-{filteredTasks.length} OF {filteredTasks.length} TASKS</span>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 text-on-surface-variant bg-surface-container-highest border border-outline-variant/30 rounded-lg text-xs hover:border-primary transition-all font-bold transition-colors cursor-no-drop opacity-40" disabled>
              PREV
            </button>
            <span className="w-6 h-6 text-xs font-bold leading-none bg-primary text-on-primary flex items-center justify-center rounded-lg">
              1
            </span>
            <button className="px-2.5 py-1 text-on-surface-variant bg-surface-container-highest border border-outline-variant/30 rounded-lg text-xs hover:border-primary transition-all font-bold transition-colors cursor-no-drop opacity-40" disabled>
              NEXT
            </button>
          </div>
        </div>
      </section>

      {/* Floating Create Task Modal Overlay */}
      {isModalOpen && (
        <div id="publishModal" className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-in">
          <div 
            onClick={() => setIsModalOpen(false)} 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all"
          ></div>
          
          <div className="glass-panel w-full max-w-xl rounded-lg shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-high/40">
              <div className="flex flex-col">
                <h3 className="font-headline text-lg font-bold text-primary">
                  {isEditingMode ? '修改管道任务' : '发布新任务'}
                </h3>
                <span className="text-[10px] font-mono text-on-surface-variant tracking-widest uppercase">
                  INITIALIZE DATA PIPELINE
                </span>
              </div>
              <button 
                id="tasks-close-modal"
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-white p-1 hover:bg-white/5 rounded duration-150 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5 text-sm">
              <div className="space-y-2">
                <label className="text-mono text-[11px] text-on-surface-variant tracking-widest block font-mono uppercase">
                  TASK NAME / 任务名称
                </label>
                <input
                  type="text"
                  id="form-task-name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all placeholder:text-on-surface-variant/30 text-on-surface text-base font-medium"
                  placeholder="请输入任务标题/例如: AIFace 姿态分割..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-mono text-[11px] text-on-surface-variant tracking-widest block font-mono uppercase">
                    DEADLINE / 截止日期
                  </label>
                  <input
                    type="date"
                    id="form-task-deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none transition-all text-on-surface [color-scheme:dark]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-mono text-[11px] text-on-surface-variant tracking-widest block font-mono uppercase">
                    CATEGORY / 任务分类
                  </label>
                  <select
                    id="form-task-category"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none transition-all text-on-surface cursor-pointer"
                  >
                    <option>计算机视觉 (CV)</option>
                    <option>自然语言处理 (NLP)</option>
                    <option>音频转写 (ASR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-mono text-[11px] text-on-surface-variant tracking-widest block font-mono uppercase">
                    BUSINESS PRICE / 业务单价
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      id="form-task-admin-price"
                      value={businessPrice}
                      onChange={(e) => setBusinessPrice(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded pl-10 pr-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none transition-all text-on-surface"
                      placeholder="e.g. 1.20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-mono text-[11px] text-on-surface-variant tracking-widest block font-mono uppercase">
                    LABELING PRICE / 标注价格
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      id="form-task-label-price"
                      value={labelPrice}
                      onChange={(e) => setLabelPrice(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded pl-10 pr-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none transition-all text-on-surface border-primary/40"
                      placeholder="e.g. 0.85"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex justify-end gap-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  id="form-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg border border-outline-variant text-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer text-on-surface"
                >
                  取消
                </button>
                <button
                  type="submit"
                  id="form-btn-submit"
                  className="px-8 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:shadow-[0_0_15px_rgba(194,193,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  {isEditingMode ? '保存修改' : '发布任务'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Submit Data Packet Modal Overlay for Labeler */}
      {isSubmitModalOpen && submitTask && (
        <div id="submit-overlay-portal" className="fixed inset-0 bg-[#060608]/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div 
            id="submit-modal-container"
            className="w-full max-w-lg glass-panel p-8 rounded-2xl relative overflow-hidden animate-scale-up border max-h-[90vh] overflow-y-auto custom-scroller"
          >
            {/* Ambient Background Glow Spot */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -z-10 animate-pulse"></div>

            {/* Header Area */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-outline-variant/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-secondary/10 border border-secondary/30 text-secondary font-black uppercase tracking-wider">
                    成果提报上报
                  </span>
                  <span className="font-mono text-xs text-outline">{submitTask.id}</span>
                </div>
                <h3 className="font-headline text-lg font-bold text-white mt-1">提交标定成果包</h3>
              </div>
              <button 
                id="submit-modal-btn-close"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer text-on-surface-variant hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Interactive Form for submittals */}
            <form 
              id="submit-form" 
              onSubmit={(e) => {
                e.preventDefault();
                const unit = submitTask.group.includes('语音') ? '分钟' : submitTask.group.includes('文本') ? '项' : '帧';
                if (onAddSubmission) {
                  onAddSubmission({
                    taskName: submitTask.name,
                    labelCount: parseFloat(labelerCount) || 120,
                    unit,
                    payoutPrice: submitTask.priceLabel,
                    description: `${labelerComment} (储存库链地址: ${labelerLink})`
                  });
                }
                setIsSubmitModalOpen(false);
              }}
              className="space-y-5"
            >
              {/* Ready Only Task Information Fields */}
              <div className="space-y-1 p-4 bg-white/[0.02] border border-outline-variant/20 rounded-xl">
                <span className="font-mono text-[10px] text-on-surface-variant font-bold uppercase block">TASK / 关联标定项</span>
                <span className="text-[14px] text-white font-semibold">{submitTask.name}</span>
                <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-white/5 text-xs">
                  <span className="text-on-surface-variant">结算分配价格</span>
                  <span className="font-mono text-secondary font-bold">
                    ¥{submitTask.priceLabel.toFixed(2)} / {submitTask.group.includes('语音') ? '分钟' : submitTask.group.includes('文本') ? '项' : '帧'}
                  </span>
                </div>
              </div>

              {/* Completed Quantity Input */}
              <div className="space-y-2">
                <label className="text-mono text-[11px] text-on-surface-variant tracking-widest block font-mono uppercase">
                  QUANTITY / 完成计量单位数 ({submitTask.group.includes('语音') ? '分钟' : submitTask.group.includes('文本') ? '项' : '帧'})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="submit-form-quantity"
                    value={labelerCount}
                    onChange={(e) => setLabelerCount(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-secondary focus:outline-none transition-all text-on-surface"
                    placeholder="例如：250"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-on-surface-variant">
                    {submitTask.group.includes('语音') ? 'MINUTES' : submitTask.group.includes('文本') ? 'ITEMS' : 'FRAMES'}
                  </span>
                </div>
              </div>

              {/* Secure OSS / S3 cloud storage mock link */}
              <div className="space-y-2">
                <label className="text-mono text-[11px] text-on-surface-variant tracking-widest block font-mono uppercase">
                  STORAGE ROOT PATH / 存储归宿链址 (S3, OSS)
                </label>
                <input
                  type="text"
                  id="submit-form-link"
                  value={labelerLink}
                  onChange={(e) => setLabelerLink(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-secondary focus:outline-none transition-all text-on-surface font-mono text-xs"
                  placeholder="s3://romer-bucket/cv-task_v3.zip"
                  required
                />
              </div>

              {/* Explanatory Comments */}
              <div className="space-y-2">
                <label className="text-mono text-[11px] text-on-surface-variant tracking-widest block font-mono uppercase">
                  COMMENT / 提报备注
                </label>
                <textarea
                  id="submit-form-comment"
                  value={labelerComment}
                  onChange={(e) => setLabelerComment(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-secondary focus:outline-none transition-all text-on-surface text-xs leading-relaxed"
                  placeholder="可附带精密度审核、坏数据丢弃比例等说明"
                  required
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg border border-outline-variant text-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer text-on-surface"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-lg bg-secondary text-black text-sm font-bold hover:shadow-[0_0_15px_rgba(235,193,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  确认提报
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
