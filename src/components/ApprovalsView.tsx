import { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  RotateCw,
  ChevronLeft, 
  ChevronRight, 
  X, 
  ShieldAlert, 
  History, 
  Calendar, 
  User, 
  Sparkles,
  Check,
  AlertOctagon,
  FileCheck
} from 'lucide-react';
import { ApprovalSubmission } from '../types';

interface ApprovalsViewProps {
  submissions: ApprovalSubmission[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  search?: string;
  userRole?: 'admin' | 'labeler';
  userName?: string;
}

const TAG_DEFINITIONS: Record<string, { title: string; desc: string; standard: string }> = {
  'POINT_CLOUD': {
    title: '激光雷达点云 (Point Cloud)',
    desc: '3D激光雷达多线扫描立体点云。需融合标注立体包围盒边界、精细朝向与分类。',
    standard: '精度误差控制 <= 5cm，刚体面长宽高契合率 > 98%。'
  },
  '3D_BOUNDING_BOX': {
    title: '3D 刚体边界框 (3D Bounding Box)',
    desc: '在多视角或3D像素坐标里构建物体包围体，常用于多模态融合车体预测算法。',
    standard: '朝向角误差严格 < 3° 且无漏标或穿模。'
  },
  'DYNAMIC_OBJECT': {
    title: '动态交通网络参与者 (Dynamic Object)',
    desc: '识别环境中正在运作或具有自主移动趋势的移动源，涵盖步行、骑行等特种目标。',
    standard: '动态轨迹跨帧匹配，连续ID锁定率 > 99.5%。'
  },
  'IMAGE_OCR': {
    title: '光学字符辨识 (Image OCR)',
    desc: '提取各类特定天气或极低能见度环境中的交通标志牌、商户招牌、指示文本信息。',
    standard: '保留完整空格与符号语义，拼写映射正确率 100%。'
  },
  'TEXT_EXTRACTION': {
    title: '语义流命名实体提取 (Text Extraction)',
    desc: '分析NLP采集数据集流，高亮高价值命名实体。包括地点、主体、地标代号。',
    standard: '断句边界位置零像素偏差，关系绑定指向无损。'
  },
  'CLASSIFICATION': {
    title: '多层级环境特征分类 (Classification)',
    desc: '根据数据类型对其归类，如路面干湿、日光照射角度、车标以及特种特例事件。',
    standard: '遵循单项选择或多项互斥标记逻辑约束。'
  },
  '2D_BOUNDING_BOX': {
    title: '2D 像素标定边界框 (2D Bounding Box)',
    desc: '在2D图像中标注障碍物真实像素外接矩形范围，支撑前向碰撞预警感知面构建。',
    standard: '包裹精细度紧贴物体物理边缘，冗余或漏包像素 < 2px。'
  },
  'PIXEL_MASK': {
    title: '高精像素级语义蒙版 (Pixel Mask)',
    desc: '执行图像级的像素涂色覆盖割裂，为自动驾驶路面类型、医疗病理边界生成特征图。',
    standard: '像素级金标准交并比指标 mIoU > 94.5%。'
  },
  'SEMANTIC_SEGMENTATION': {
    title: '语义全息精准分割 (Semantic Segmentation)',
    desc: '对场景里所有可视像素按类别（道路/植被/建筑物/护栏）施加细致涂覆划分。',
    standard: '图像覆盖率 100%，确保相邻图层绝不重叠且不漏割。'
  },
  'MEDICAL_CT': {
    title: '医疗影像密集切片 (Medical CT)',
    desc: '标定胸部X光摄影、CT或MRI高维体积内的骨裂、肿瘤小节点、器官界限。',
    standard: '高精像素微雕校正，双人高级主治医生级校验通过。'
  },
  'LINE_STRIP': {
    title: '多段折线矢量描边 (Line Strip)',
    desc: '用于高精物理标定路牙线、虚实车道边界线、隔离墩、作业区物理盲区带。',
    standard: '控制节点契合直线变道或平滑弯道，无偏航节点。'
  },
  'LANE_MARKED_CV': {
    title: '车道先验边缘特征标记 (Lane Marked CV)',
    desc: '针对高速路和城区复杂高驾桥的车道线特征标记，多点云视角反投射拟合。',
    standard: '车道级标识契合误差小于 10cm。'
  }
};

export default function ApprovalsView({ 
  submissions, 
  onApprove, 
  onReject, 
  search = '',
  userRole = 'labeler',
  userName = ''
}: ApprovalsViewProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ApprovalSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTagDetails, setActiveTagDetails] = useState<string | null>(null);

  // Active query combines passed global search with local query
  const activeSearch = (search || localSearchTerm).toLowerCase();

  // Root isolation based on role
  const baseSubmissions = userRole === 'labeler'
    ? submissions.filter(s => s.userName === userName)
    : submissions;

  // Filter based on search query matching ID or Sorter Name
  const filteredSubmissions = baseSubmissions.filter(
    (sub) => {
      // Status filter check
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false;

      if (!activeSearch) return true;
      return (
        sub.id.toLowerCase().includes(activeSearch) ||
        sub.userName.toLowerCase().includes(activeSearch) ||
        sub.taskName.toLowerCase().includes(activeSearch)
      );
    }
  );

  const pendingSubmissions = filteredSubmissions.filter(s => s.status === 'pending');

  const handleApproveAction = (id: string) => {
    onApprove(id);
    setSelectedSubmission(null);
    setActiveTagDetails(null);
  };

  const handleRejectAction = (id: string) => {
    onReject(id);
    setSelectedSubmission(null);
    setActiveTagDetails(null);
  };

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div id="approvals-view-root" className="animate-fade-in space-y-8">
      {/* Title Header with Queue Analytics */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="font-headline text-2xl font-semibold text-on-surface">
            {userRole === 'labeler' ? '成果提报记录与审计' : '提报审批'}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(194,193,255,0.6)]"></span>
            <span className="text-mono font-mono text-primary text-xs uppercase tracking-widest font-bold">
              {userRole === 'labeler' 
                ? `MY_COMMITED_QUEUE: ${filteredSubmissions.length} 已记录的标定成果` 
                : `Queue Active: ${submissions.filter(s => s.status === 'pending').length} Pending Submissions`}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
            <input
              type="text"
              placeholder="搜索ID、角色或任务..."
              value={search ? search : localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded-lg pl-9 pr-4 py-2 text-sm w-64 focus:border-primary focus:ring-0 outline-none text-on-surface"
              disabled={!!search}
            />
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer border ${statusFilter !== 'all' ? 'bg-primary/20 border-primary/40 text-primary font-bold' : 'bg-surface-container-high border-outline-variant text-on-surface hover:bg-surface-container-highest'}`}
            >
              <Filter size={16} />
              <span>{statusFilter === 'all' ? '全部状态' : statusFilter === 'pending' ? '审核中' : statusFilter === 'approved' ? '已批准' : '已驳回'}</span>
            </button>

            {isFilterDropdownOpen && (
              <>
                <div onClick={() => setIsFilterDropdownOpen(false)} className="fixed inset-0 z-40 bg-transparent"></div>
                <div className="absolute right-0 mt-2 w-44 bg-[#0e0f14] border border-white/10 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 font-sans text-xs">
                  <p className="text-xs font-mono text-outline uppercase px-2 py-1.5 font-bold border-b border-white/5">按审核状态筛选</p>
                  <button 
                    onClick={() => { setStatusFilter('all'); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${statusFilter === 'all' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                  >
                    全部 (ALL)
                  </button>
                  <button 
                    onClick={() => { setStatusFilter('pending'); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${statusFilter === 'pending' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                  >
                    审核中
                  </button>
                  <button 
                    onClick={() => { setStatusFilter('approved'); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${statusFilter === 'approved' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                  >
                    已批准
                  </button>
                  <button 
                    onClick={() => { setStatusFilter('rejected'); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${statusFilter === 'rejected' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
                  >
                    已驳回
                  </button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={handleSyncClick}
            className={`px-4 py-2 bg-primary text-zinc-950 font-bold text-sm rounded-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer ${isSyncing ? 'opacity-85' : ''}`}
          >
            <RotateCw size={15} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? '同步中...' : '刷新数据'}</span>
          </button>
        </div>
      </section>

      {/* Main Submission List Board Table */}
      <section className="glass-panel rounded-2xl overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-surface-container-high/40 text-on-surface-variant font-mono uppercase tracking-wider text-xs border-b border-outline-variant">
              <tr>
                <th className="p-4 pl-6 text-left">Submission ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Task Name</th>
                <th className="p-4 text-right">标注量</th>
                <th className="p-4 text-right">Timestamp</th>
                <th className="p-4 text-center">状态</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-on-surface-variant font-mono">
                    没有找到符合检索条件的提报审批记录。
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr 
                    key={sub.id} 
                    onClick={() => setSelectedSubmission(sub)}
                    className="hover:bg-primary/5 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 pl-6 font-mono text-primary font-bold text-sm">{sub.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold">
                          {sub.userInitials}
                        </div>
                        <span className="font-semibold text-slate-100">{sub.userName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-200">{sub.taskName}</td>
                    <td className="p-4 text-right font-mono text-sm text-slate-300">
                      {sub.labelCount.toLocaleString()} 
                      <span className="text-xs text-outline ml-1">{sub.unit}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-outline text-sm">{sub.timestamp}</td>
                    <td className="p-4 text-center">
                      {sub.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                          审核中
                        </span>
                      )}
                      {sub.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold font-mono">
                          已批准
                        </span>
                      )}
                      {sub.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded bg-error/10 border border-error/50 text-error text-xs font-bold font-mono">
                          已驳回
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        id={`inspect-btn-${sub.id.replace('#', '')}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubmission(sub);
                        }}
                        className="px-3 py-1.5 bg-surface-container-highest/60 border border-outline-variant rounded-lg text-xs group-hover:bg-primary group-hover:text-on-primary transition-all cursor-pointer font-bold duration-150 text-slate-200"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Paginate */}
        <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-low font-mono text-xs text-on-surface-variant">
          <span>显示 {filteredSubmissions.length} 条数据记录</span>
          <div className="flex gap-2">
            <button className="p-1.5 border border-outline-variant/30 hover:bg-surface-container-highest rounded-lg cursor-pointer" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 bg-primary text-on-primary font-bold rounded-lg text-xs">1</button>
            <button className="p-1.5 border border-outline-variant/30 hover:bg-surface-container-highest rounded-lg cursor-pointer" disabled>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Extreme Detail Inspection Dialog Overlay */}
      {selectedSubmission && (
        <div 
          id="detailModal" 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={() => setSelectedSubmission(null)} 
            className="absolute inset-0"
          ></div>

          <div className="glass-panel w-full max-w-5xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/30">
              <div>
                <h3 className="text-mono font-mono text-outline uppercase tracking-widest text-xs font-bold">Detail Inspection</h3>
                <h2 className="text-xl font-bold flex items-center gap-3 text-white mt-1">
                  <span className="text-primary font-mono" id="modalId">{selectedSubmission.id}</span>
                  <span className="text-outline-variant">/</span>
                  <span id="modalTaskName" className="truncate text-base">{selectedSubmission.taskName}</span>
                </h2>
              </div>
              <button 
                id="modal-close-inspect-btn"
                onClick={() => setSelectedSubmission(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-pointer text-outline hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area Grid */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side: Layout Map Spark, Accuracy Metrics & Hotlinked Image Frame */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Visual Preview Road Reconstruction Simulator Block */}
                <div className="glass-panel rounded-2xl p-0 relative overflow-hidden h-80 border-primary/20 bg-[#07080c]">
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes romer-scanner {
                      0%, 100% { top: 8%; opacity: 0.1; }
                      50% { top: 92%; opacity: 0.95; }
                    }
                    .romer-scan-line {
                      animation: romer-scanner 5.5s ease-in-out infinite;
                    }
                    .pris-grid-overlay-matrix-local {
                      background-size: 40px 40px;
                      background-image: 
                        linear-gradient(to right, rgba(235, 235, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(235, 235, 255, 0.02) 1px, transparent 1px);
                    }
                  `}} />

                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none z-10"></div>
                  
                  {/* Perspective Vector Line Grid (实时高精车道立体投影与3D线状重构) */}
                  <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden select-none">
                    
                    {/* Matrix grid backdrop */}
                    <div className="absolute inset-0 pris-grid-overlay-matrix-local opacity-25"></div>

                    <svg className="w-full h-full" viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
                      {/* Horizon horizontal grids */}
                      <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(194,193,255,0.06)" strokeWidth="1" />
                      <line x1="0" y1="120" x2="800" y2="120" stroke="rgba(194,193,255,0.08)" strokeWidth="1.2" />
                      <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(194,193,255,0.1)" strokeWidth="1.5" />
                      <line x1="0" y1="280" x2="800" y2="280" stroke="rgba(194,193,255,0.12)" strokeWidth="2" />

                      {/* Perspective grid lines converging to center back */}
                      <line x1="400" y1="50" x2="-200" y2="320" stroke="rgba(194,193,255,0.08)" strokeWidth="1.2" />
                      <line x1="400" y1="50" x2="100" y2="320" stroke="rgba(194,193,255,0.08)" strokeWidth="1.2" />
                      <line x1="400" y1="50" x2="400" y2="320" stroke="rgba(194,193,255,0.1)" strokeWidth="1.5" />
                      <line x1="400" y1="50" x2="700" y2="320" stroke="rgba(194,193,255,0.08)" strokeWidth="1.2" />
                      <line x1="400" y1="50" x2="1000" y2="320" stroke="rgba(194,193,255,0.08)" strokeWidth="1.2" />

                      {/* Lane line 1 (Vibrant Neon Cyan - Left border) */}
                      <path 
                        d="M -50 320 Q 300 180 395 50" 
                        fill="none" 
                        stroke="#06b6d4" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        className="drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] opacity-90 animate-pulse"
                      />
                      {/* Lane line dot tracking */}
                      <path 
                        d="M -50 320 Q 300 180 395 50" 
                        fill="none" 
                        stroke="#0891b2" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeDasharray="1 40" 
                        className="animate-pulse"
                      />

                      {/* Lane line 2 (Vibrant Amber/Yellow - Center segment divider dashed) */}
                      <path 
                        d="M 400 320 Q 400 180 400 50" 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="3.5" 
                        strokeDasharray="25 30" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] opacity-85"
                      />

                      {/* Lane line 3 (Vibrant Emerald Green - Right border) */}
                      <path 
                        d="M 850 320 Q 500 180 405 50" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        className="drop-shadow-[0_0_10px_rgba(16,185,129,0.8)] opacity-90 animate-pulse"
                      />
                      <path 
                        d="M 850 320 Q 500 180 405 50" 
                        fill="none" 
                        stroke="#059669" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeDasharray="1 35" 
                        className="animate-pulse"
                        style={{ animationDelay: '0.7s' }}
                      />

                      {/* Dynamic obstacle tracks (pink vector line indicating target trajectory) */}
                      <path 
                        d="M 120 280 Q 280 200 380 90" 
                        fill="none" 
                        stroke="#ec4899" 
                        strokeWidth="2" 
                        strokeDasharray="6 6" 
                        className="opacity-75" 
                      />
                      
                      {/* Dynamic intersection scanning lines */}
                      <line x1="280" y1="120" x2="520" y2="120" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.8" className="drop-shadow-[0_0_5px_rgba(167,139,250,0.5)] animate-pulse" />
                      <line x1="180" y1="200" x2="620" y2="200" stroke="#a78bfa" strokeWidth="2" strokeOpacity="0.6" className="animate-pulse" style={{ animationDelay: '0.4s' }} />

                    </svg>
                  </div>

                  {/* Concentric Radar Grid Rings & Target Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-[100px] h-[100px] border border-dashed border-white rounded-full"></div>
                    <div className="w-[200px] h-[200px] border border-white rounded-full animate-pulse"></div>
                    <div className="w-[300px] h-[300px] border border-dashed border-white rounded-full"></div>
                    <div className="w-[1px] h-full bg-white/50 absolute"></div>
                    <div className="h-[1px] w-full bg-white/50 absolute"></div>
                  </div>

                  {/* Real-time laser scanning line sweep */}
                  <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,1)] z-15 pointer-events-none romer-scan-line"></div>

                  {/* Dynamic LiDAR Bounding Box Target 1 (Vehicle) */}
                  <div className="absolute left-[15%] top-[25%] w-[130px] h-[80px] border border-dashed border-emerald-400 bg-emerald-500/10 rounded-md flex flex-col justify-between p-1.5 pointer-events-none z-10 backdrop-blur-[0.5px] animate-pulse">
                    <div className="flex justify-between items-center text-xs font-mono font-black text-emerald-400 tracking-tight leading-none">
                      <span>CAR #102</span>
                      <span className="bg-emerald-400 text-black px-1 rounded-[2px] scale-95 font-bold">98.7%</span>
                    </div>
                    {/* Bounding box geometric corner indicators */}
                    <div className="flex-1 flex items-center justify-center font-mono text-xs text-emerald-400/70 scale-95 uppercase tracking-tighter">
                      <span>D: 12.4m</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono text-emerald-300 opacity-80 leading-none">
                      <span>W:1.85m</span>
                      <span>H:1.48m</span>
                    </div>
                  </div>

                  {/* Dynamic LiDAR Bounding Box Target 2 (Pedestrian) */}
                  <div className="absolute right-[22%] top-[38%] w-[80px] h-[110px] border border-dashed border-cyan-400 bg-cyan-500/10 rounded-md flex flex-col justify-between p-1.5 pointer-events-none z-10 backdrop-blur-[0.5px] animate-pulse" style={{ animationDelay: '1.5s' }}>
                    <div className="flex justify-between items-center text-xs font-mono font-black text-cyan-400 tracking-tight leading-none">
                      <span>PED #254</span>
                      <span className="bg-cyan-400 text-black px-1 rounded-[2px] scale-95 font-bold">95.3%</span>
                    </div>
                    {/* Size and distance coordinates */}
                    <div className="flex-1 flex items-center justify-center font-mono text-xs text-cyan-400/70 scale-95 uppercase tracking-tighter">
                      <span>D: 8.1m</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono text-cyan-300 opacity-80 leading-none">
                      <span>W:0.62m</span>
                      <span>H:1.76m</span>
                    </div>
                  </div>

                  {/* Telemetry labels overlay */}
                  <div className="relative z-20 p-6 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 rounded text-mono text-xs font-bold uppercase tracking-widest shadow flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                          STATUS: LIVE SCANNING
                        </span>
                        <h4 className="font-headline text-lg mt-2 text-white font-bold leading-normal">实时线状图</h4>
                      </div>
                      <div className="flex gap-2 font-mono text-xs">
                        <span className="px-2 py-1 bg-surface-container-highest/80 backdrop-blur rounded text-outline font-bold">REAL-TIME STATUS</span>
                        <span className="px-2 py-1 bg-primary-container text-on-primary-container rounded font-bold">V.4.2</span>
                      </div>
                    </div>

                    <div className="flex items-end gap-12">
                      <div>
                        <p className="text-outline font-mono text-xs font-bold leading-none mb-2 uppercase">AUTOMATION ACCURACY</p>
                        <p className="font-headline text-4xl leading-none font-bold text-primary font-mono">
                          98.4<span className="text-sm font-normal text-on-surface-variant ml-0.5">%</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-outline font-mono text-xs font-bold leading-none mb-2 uppercase">POINT DENSITY</p>
                        <p className="font-headline text-4xl leading-none font-bold text-white font-mono">
                          {(selectedSubmission.labelCount / 100).toFixed(1)}k
                        </p>
                      </div>

                      {/* Micro visual audio/laser lines indicator */}
                      <div className="flex-1 flex justify-end">
                        <div className="flex gap-1 items-end h-10">
                          <div className="w-1.5 bg-primary h-4 rounded-t animate-pulse"></div>
                          <div className="w-1.5 bg-primary h-7 rounded-t animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1.5 bg-primary h-10 rounded-t shadow-[0_0_8px_rgba(194,193,255,0.6)]"></div>
                          <div className="w-1.5 bg-primary h-6 rounded-t animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          <div className="w-1.5 bg-primary h-8 rounded-t"></div>
                          <div className="w-1.5 bg-primary h-3 rounded-t"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Description Statement */}
                <div className="space-y-3">
                  <h5 className="font-mono text-outline uppercase tracking-wider text-xs font-bold">任务说明 (Task Description)</h5>
                  <p className="text-on-surface-variant text-sm leading-relaxed text-slate-300">
                    {selectedSubmission.description}
                  </p>
                </div>

                {/* Sub status blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant text-sm">
                    <div className="flex items-center gap-2 mb-2 text-outline">
                      <ShieldAlert size={16} />
                      <span className="font-mono uppercase text-xs font-bold">Automation Scan</span>
                    </div>
                    <p className="text-on-surface-variant text-xs leading-relaxed">
                      系统已验证该批次 94% 的拓扑连续性，未发现断层或边缘缺失。
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant text-sm">
                    <div className="flex items-center gap-2 mb-2 text-outline">
                      <History size={16} />
                      <span className="font-mono uppercase text-xs font-bold">Recent Changes</span>
                    </div>
                    <p className="text-on-surface-variant text-xs leading-relaxed">
                      用户于 2 小时前完成重提，成功修复了标注框可能存在的漂移缺陷。
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side Info Sidebar & Flow Commands */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Financial items indicator */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant">
                      <p className="font-mono text-outline uppercase text-xs font-bold mb-1">UNIT LABELING PRICE</p>
                      <p className="text-lg font-bold text-white font-mono">
                        ¥ {selectedSubmission.payoutPrice.toFixed(2)}{' '} 
                        <span className="text-xs font-normal text-outline">/ {selectedSubmission.unit}</span>
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-primary-container/10 border border-primary/25">
                      <p className="font-mono text-outline uppercase text-xs font-bold mb-1">ESTIMATED PAYOUT金额</p>
                      <p className="text-xl font-bold text-primary font-mono">
                        ¥ {selectedSubmission.estimatedPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-3 pt-4 border-t border-outline-variant/30 text-xs text-slate-300">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant flex items-center gap-2">
                        <Calendar size={14} className="text-outline" />
                        截止日期
                      </span>
                      <span className="font-mono text-on-surface font-semibold">{selectedSubmission.deadline}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant flex items-center gap-2">
                          <RotateCw size={14} className="text-outline" />
                          当前进度
                        </span>
                        <span className="font-mono text-primary font-bold">{selectedSubmission.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${selectedSubmission.progress}%` }}></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-low/50 p-2.5 rounded-lg border border-outline-variant/20">
                      <span className="text-on-surface-variant flex items-center gap-2">
                        <User size={14} className="text-outline" />
                        提交人员
                      </span>
                      <span className="font-semibold text-white">{selectedSubmission.userName}</span>
                    </div>
                  </div>

                  {/* Category badgification */}
                  <div className="pt-2">
                    <p className="font-mono text-outline uppercase text-xs font-bold mb-2">数据标签规范与技术品类 (点击查看规范详情/指标)</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {selectedSubmission.annotationTypes.map((type, id) => {
                        const isSelected = activeTagDetails === type;
                        return (
                          <button 
                            key={id} 
                            onClick={() => setActiveTagDetails(activeTagDetails === type ? null : type)}
                            className={`px-2 py-1 rounded font-mono text-xs text-left transition-all duration-150 cursor-pointer border outline-none ${isSelected ? 'bg-primary/20 border-primary text-primary font-bold shadow-[0_0_8px_rgba(194,193,255,0.3)]' : 'bg-surface-container-highest border-outline-variant text-on-surface-variant hover:border-primary/50 hover:text-white'}`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>

                    {/* Interactive Tag Details Panel with gorgeous layouts */}
                    {activeTagDetails && TAG_DEFINITIONS[activeTagDetails] ? (
                      <div className="p-3 bg-[#0c0d12] border border-primary/20 rounded-xl text-xs space-y-2 font-sans animate-fade-in">
                        <div className="flex justify-between items-center text-primary font-bold">
                          <span className="font-mono text-xs tracking-wide">{TAG_DEFINITIONS[activeTagDetails].title}</span>
                          <span className="text-xs bg-primary/10 px-1.5 py-0.5 rounded font-mono font-black uppercase shrink-0">ACTIVE STANDARD</span>
                        </div>
                        <p className="text-on-surface-variant text-xs leading-relaxed select-text">{TAG_DEFINITIONS[activeTagDetails].desc}</p>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5 font-mono text-xs">
                          <span className="text-outline uppercase block font-bold text-xs mb-0.5">验收指标 (VALIDATION BENCHMARK)</span>
                          <span className="text-green-400 font-semibold">{TAG_DEFINITIONS[activeTagDetails].standard}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-outline italic">提示：点击上方任意技术标签，即可调阅 Romer AI 数据中心验收规范与质量金标准。</p>
                    )}
                  </div>
                </div>

                {/* Audit Workflow Action Cluster */}
                <div className="space-y-2.5 pt-4 border-t border-outline-variant">
                  {userRole === 'labeler' ? (
                    <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 text-center space-y-1.5">
                      <p className="text-secondary font-mono text-[10px] tracking-widest font-black uppercase flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
                        SORTER_READONLY_PREVIEW / 标定成果核验
                      </p>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        您的成果包已存证签名。对该批次的数据审核、量能评定以及薪酬结算权限归属系统管理员。
                      </p>
                    </div>
                  ) : selectedSubmission.status === 'pending' ? (
                    <>
                      <button 
                        id="audit-approve-submission-btn"
                        onClick={() => handleApproveAction(selectedSubmission.id)}
                        className="w-full py-3.5 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 cursor-pointer"
                      >
                        <Check size={16} />
                        <span>通过审批 (Approve)</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          id="audit-reject-submission-btn"
                          onClick={() => handleRejectAction(selectedSubmission.id)}
                          className="py-3 border border-error/50 text-error font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-error/5 active:scale-[0.97] transition-all cursor-pointer text-xs"
                        >
                          <AlertOctagon size={14} />
                          <span>驳回 (Reject)</span>
                        </button>

                        <button 
                          id="audit-revise-submission-btn"
                          onClick={() => setSelectedSubmission(null)}
                          className="py-3 border border-outline-variant text-on-surface hover:text-white rounded-xl flex items-center justify-center gap-1.5 hover:bg-surface-container-highest active:scale-[0.97] transition-all cursor-pointer text-xs"
                        >
                          <History size={14} />
                          <span>修正 (Revision)</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-3 rounded-lg border border-outline-variant bg-surface-container-low text-xs font-mono font-bold uppercase text-on-surface-variant">
                      {selectedSubmission.status === 'approved' ? '✓ APPROVED BY SUPERADMIN' : '✖ REJECTED PILE'}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
