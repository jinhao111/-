import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  X, 
  Network 
} from 'lucide-react';
import { TeamMember } from '../types';

interface TeamViewProps {
  members: TeamMember[];
  onAddMember: (member: Omit<TeamMember, 'id' | 'initials'>) => void;
  search?: string;
  userRole?: 'admin' | 'labeler';
}

export default function TeamView({ members, onAddMember, search = '', userRole = 'labeler' }: TeamViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'all' | '管理员' | '标注员' | '审核员'>('all');
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  
  // New Sorter Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [node, setNode] = useState('CN-SOUTH-2');
  const [role, setRole] = useState<'管理员' | '标注员' | '审核员'>('标注员');
  const [throughput, setThroughput] = useState('75');

  // Active query combining
  const activeSearch = (search || searchTerm).toLowerCase();

  const filteredMembers = members.filter(
    (m) => {
      if (roleFilter !== 'all' && m.role !== roleFilter) return false;

      if (!activeSearch) return true;
      return (
        m.name.toLowerCase().includes(activeSearch) ||
        m.email.toLowerCase().includes(activeSearch) ||
        m.node.toLowerCase().includes(activeSearch) ||
        m.role.toLowerCase().includes(activeSearch)
      );
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onAddMember({
      name,
      email,
      node,
      role,
      throughput: parseFloat(throughput) || 50,
      status: 'online',
      groupSlug: '活跃人员'
    });

    // Reset Form
    setName('');
    setEmail('');
    setIsModalOpen(false);
  };

  const handleExportJSON = () => {
    // Generate functional file download of the team directory for extreme fidelity
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(members, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'romer_team_directory.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="team-view-root" className="animate-fade-in space-y-8">
      {/* Header Panel with Stats Counters */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <p className="font-mono text-primary uppercase text-[10px] tracking-widest font-bold mb-1">
              {userRole === 'labeler' ? '标定能效排行' : '成员概览'}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white leading-none">
              {userRole === 'labeler' ? '标注节点效能风云榜' : '团队成员控制台'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2.5 rounded-xl flex items-center gap-3 border border-outline-variant/30">
              <div className="flex flex-col text-right">
                <span className="font-mono text-outline text-[10px] uppercase font-bold tracking-wider">活跃人员</span>
                <span className="text-xl font-bold text-primary font-mono leading-none mt-1">1,284</span>
              </div>
            </div>

            {userRole === 'labeler' ? (
              <div className="glass-card px-5 py-2.5 rounded-xl flex items-center gap-3 border border-secondary/35 bg-secondary/5 font-sans">
                <Network size={16} className="text-secondary animate-pulse shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="font-mono text-outline text-[9px] uppercase tracking-wider font-semibold">我的当前能效段位</span>
                  <span className="text-xs font-bold text-secondary leading-none mt-1">LV.3 黄金标定师 (Top 8.2%)</span>
                </div>
              </div>
            ) : (
              <button 
                id="team-open-add-modal-btn"
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(194,193,255,0.2)] cursor-pointer text-sm"
              >
                <Plus size={16} />
                <span>添加成员</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Glass Table Container */}
      <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant/40">
        {/* Search & Tool Buttons */}
        <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/40 flex-wrap gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input
              type="text"
              id="team-search-member-input"
              value={search ? search : searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface"
              placeholder="搜索昵称、账号或角色..."
              disabled={!!search}
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-on-surface-variant font-medium relative">
            <div className="relative">
              <button 
                onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer border ${roleFilter !== 'all' ? 'bg-primary/25 border-primary/35 text-primary font-bold' : 'hover:text-on-surface hover:bg-surface-container-high border-transparent'}`}
              >
                <Filter size={16} />
                <span>{roleFilter === 'all' ? '筛选身份' : roleFilter}</span>
              </button>

              {isRoleFilterOpen && (
                <>
                  <div onClick={() => setIsRoleFilterOpen(false)} className="fixed inset-0 z-40 bg-transparent"></div>
                  <div className="absolute right-0 mt-2 w-40 bg-[#0e0f14] border border-white/10 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 font-sans text-xs text-left">
                    <p className="text-[10px] font-mono text-outline uppercase px-2 py-1.5 font-bold border-b border-white/5">按职能身份筛选</p>
                    <button 
                      onClick={() => { setRoleFilter('all'); setIsRoleFilterOpen(false); }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg cursor-pointer ${roleFilter === 'all' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                    >
                      全部身份
                    </button>
                    <button 
                      onClick={() => { setRoleFilter('管理员'); setIsRoleFilterOpen(false); }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg cursor-pointer ${roleFilter === '管理员' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                    >
                      管理员
                    </button>
                    <button 
                      onClick={() => { setRoleFilter('标注员'); setIsRoleFilterOpen(false); }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg cursor-pointer ${roleFilter === '标注员' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                    >
                      标注员
                    </button>
                    <button 
                      onClick={() => { setRoleFilter('审核员'); setIsRoleFilterOpen(false); }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg cursor-pointer ${roleFilter === '审核员' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                    >
                      审核员
                    </button>
                  </div>
                </>
              )}
            </div>

            <button 
              id="team-export-btn"
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
              title="导出JSON清单"
            >
              <Download size={16} />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* Data list table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-container-lowest/50 border-b border-outline-variant">
                <th className="px-6 py-4 font-mono text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">昵称</th>
                <th className="px-6 py-4 font-mono text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">账号 / 身份</th>
                <th className="px-6 py-4 font-mono text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">系统访问权限</th>
                <th className="px-6 py-4 font-mono text-on-surface-variant text-[10px] uppercase font-bold tracking-wider text-center">节点吞吐量</th>
                <th className="px-6 py-4 font-mono text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">同步状态</th>
                <th className="px-6 py-4 font-mono text-on-surface-variant text-[10px] uppercase font-bold tracking-wider text-right">操作</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant font-mono text-xs">
                    没有找到该管道节点的注册人员数据。
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const nodeColor = 
                    member.node.includes('SOUTH') ? 'text-primary/70' : 
                    member.node.includes('WEST') ? 'text-secondary/70' : 'text-neutral-400';

                  const isErrorState = member.status === 'error';

                  return (
                    <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                      {/* Grid 1 Avatar nickname */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center font-bold border border-outline-variant font-mono ${isErrorState ? 'text-error border-error/20' : 'text-primary'}`}>
                            {member.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-[14px] leading-tight">{member.name}</span>
                            <span className="font-mono text-outline text-[10px] uppercase tracking-wider mt-1">{member.groupSlug}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email credentials */}
                      <td className="px-6 py-5 text-[14px]">
                        <div className="flex flex-col">
                          <span className="text-slate-200 font-medium">{member.email}</span>
                          <span className={`font-mono text-[10px] mt-0.5 font-bold flex items-center gap-1 uppercase ${nodeColor}`}>
                            <Network size={10} />
                            <span>Node: {member.node}</span>
                          </span>
                        </div>
                      </td>

                      {/* Authorization Badge */}
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 border rounded-lg font-mono text-[11px] font-bold ${
                          member.role === '管理员' 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : 'bg-surface-container-highest text-on-surface-variant border-outline-variant'
                        }`}>
                          {member.role}
                        </span>
                      </td>

                      {/* Operational Throughput Progress bar */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-center gap-1 justify-center max-w-[124px] mx-auto text-center">
                          <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${isErrorState ? 'bg-error' : 'bg-primary'}`} 
                              style={{ width: `${member.throughput > 0 ? (member.throughput / 120) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className={`font-mono text-[11px] leading-none mt-1 ${isErrorState ? 'text-error font-semibold' : 'text-slate-300'}`}>
                            {isErrorState ? '延迟异常' : `${member.throughput.toFixed(1)} ops/s`}
                          </span>
                        </div>
                      </td>

                      {/* Status Glow Indicators */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {member.status === 'online' && (
                            <>
                              <div className="w-2.5 h-2.5 rounded-full bg-green-400 status-glow-online animate-pulse"></div>
                              <span className="text-sm text-green-400 font-semibold">在线</span>
                            </>
                          )}
                          {member.status === 'offline' && (
                            <>
                              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant status-glow-offline"></div>
                              <span className="text-sm text-on-surface-variant">离线</span>
                            </>
                          )}
                          {member.status === 'error' && (
                            <>
                              <div className="w-2.5 h-2.5 rounded-full bg-error status-glow-error animate-pulse"></div>
                              <span className="text-sm text-error font-semibold">异常登录</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Quick row properties */}
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sorter Form Modal Overlay */}
      {isModalOpen && (
        <div id="addTeamModal" className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-in text-sm">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>
          
          <div className="glass-panel w-full max-w-lg rounded-xl shadow-2xl relative overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-high/40">
              <div>
                <h3 className="font-headline text-lg font-bold text-primary">添加通道节点成员</h3>
                <p className="text-[10px] font-mono text-outline uppercase tracking-widest mt-1">PROVISION NODE ACCESS</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-white p-1 hover:bg-white/5 rounded duration-150 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-mono text-[11px] text-on-surface-variant block uppercase tracking-widest font-mono font-bold">
                  NAME / 成员姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/30 text-on-surface"
                  placeholder="请输入真实姓名 (e.g. John Doe, Li Na)"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-mono text-[11px] text-on-surface-variant block uppercase tracking-widest font-mono font-bold">
                  EMAIL ADDRESS / 邮箱账号
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/30 text-on-surface"
                  placeholder="e.g. johndoe@romer.io"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-mono text-[11px] text-on-surface-variant block uppercase tracking-widest font-mono font-bold">
                    NODE LINK / 托管节点
                  </label>
                  <select
                    value={node}
                    onChange={(e) => setNode(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-primary outline-none text-on-surface cursor-pointer"
                  >
                    <option value="CN-SOUTH-2">CN-SOUTH-2</option>
                    <option value="US-WEST-1">US-WEST-1</option>
                    <option value="EU-CENT-1">EU-CENT-1</option>
                    <option value="JP-TOKYO-3">JP-TOKYO-3</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-mono text-[11px] text-on-surface-variant block uppercase tracking-widest font-mono font-bold">
                    ROLE ACCESS / 权限角色
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-primary outline-none text-on-surface cursor-pointer"
                  >
                    <option value="标注员">标注员</option>
                    <option value="管理员">管理员</option>
                    <option value="审核员">审核员</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-mono text-[11px] text-on-surface-variant block uppercase tracking-widest font-mono font-bold">
                  THROUGHPUT RATIO / 期望吞吐量 (ops/s)
                </label>
                <input
                  type="number"
                  value={throughput}
                  onChange={(e) => setThroughput(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 focus:ring-1 focus:ring-primary outline-none text-on-surface"
                  placeholder="e.g. 85"
                  min="0"
                  max="120"
                />
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded border border-outline-variant font-medium hover:bg-surface-container-high transition-colors cursor-pointer text-on-surface"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded bg-primary text-on-primary font-bold hover:brightness-110 shadow-lg cursor-pointer"
                >
                  确认授权
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
