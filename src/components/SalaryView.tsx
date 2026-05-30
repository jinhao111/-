import { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
  Filter, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  ArrowRight,
  CircleDot
} from 'lucide-react';

interface SalaryViewProps {
  search?: string;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  userRole?: 'admin' | 'labeler';
  userName?: string;
}

export default function SalaryView({ 
  search = '', 
  onShowToast,
  userRole = 'labeler',
  userName = ''
}: SalaryViewProps) {
  const [filterSlug, setFilterSlug] = useState<'all' | 'label' | 'audit'>('all');
  const [isPayingOut, setIsPayingOut] = useState(false);
  const [payProgress, setPayProgress] = useState(0);

  // Billing ledger matching mockup
  const initialLedger = [
    {
      id: 'CH',
      initials: 'CH',
      name: 'Chen Hao (陈昊)',
      hexId: '0x9421_ROM',
      items: 12450,
      priceLabel: 0.18,
      priceAdmin: 0.25,
      payout: 2241.00,
      profit: 871.50,
      status: 'pending',
      percentage: 40,
    },
    {
      id: 'LX',
      initials: 'LX',
      name: 'Li Xiao (李晓)',
      hexId: '0x8832_ROM',
      items: 28900,
      priceLabel: 0.15,
      priceAdmin: 0.22,
      payout: 4335.00,
      profit: 2023.00,
      status: 'paid',
      percentage: 85,
    },
    {
      id: 'ZW',
      initials: 'ZW',
      name: 'Zhang Wei (张伟)',
      hexId: '0x1029_ROM',
      items: 45120,
      priceLabel: 0.12,
      priceAdmin: 0.20,
      payout: 5414.40,
      profit: 3609.60,
      status: 'error',
      percentage: 100,
    }
  ];

  const activeSearch = search.trim().toLowerCase();
  const filteredLedger = initialLedger.filter((row) => {
    // 1. Role Sorter
    if (filterSlug === 'label' && row.id === 'LX') return false;
    if (filterSlug === 'audit' && row.id !== 'LX') return false;

    // 2. Search Text
    if (activeSearch) {
      return (
        row.name.toLowerCase().includes(activeSearch) ||
        row.id.toLowerCase().includes(activeSearch) ||
        row.hexId.toLowerCase().includes(activeSearch) ||
        row.status.toLowerCase().includes(activeSearch)
      );
    }
    return true;
  });

  const personalLedgerRow = {
    id: 'ME',
    initials: userName ? userName.substring(0, 2).toUpperCase() : 'ME',
    name: `${userName || '我的标注席位'}`,
    hexId: '0x3910_ROM',
    items: 45120,
    priceLabel: 0.145,
    priceAdmin: 0.220,
    payout: 6542.40,
    profit: 3384.00,
    status: 'pending',
    percentage: 100,
  };

  const displayedLedger = userRole === 'labeler'
    ? [personalLedgerRow]
    : filteredLedger;

  const handlePayTrigger = () => {
    if (isPayingOut) return;
    setIsPayingOut(true);
    setPayProgress(5);
    
    const interval = setInterval(() => {
      setPayProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsPayingOut(false);
            setPayProgress(0);
            if (onShowToast) {
              if (userRole === 'labeler') {
                onShowToast('财产提现成功! 已转账 ¥6,542.40 至您绑定的招商银行结算卡 (*4920)。资金到账预计需要 2 小时。', 'success');
              } else {
                onShowToast('一键结算流触发成功: 45名标定人员应计薪资已向区块链及本地银行划拨！(Block ID: Tx9312)', 'success');
              }
            }
          }, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
  };

  return (
    <div id="salary-view-root" className="animate-fade-in space-y-8">
      {/* Analytics Page Title Header */}
      <section className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1 font-mono">
            <CircleDot size={14} className="text-primary animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] font-black">
              {userRole === 'labeler' ? '我的财务看板 V2.0' : '结算引擎 V2.0'}
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white leading-none font-headline">
            {userRole === 'labeler' ? '资产与结算明细' : '薪资统计分析'}
          </h2>

          <div className="flex items-center gap-4 text-outline font-mono text-xs mt-3">
            <span className="flex items-center gap-1.5 font-bold text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(194,193,255,0.6)] animate-pulse"></span>
              实时结算就绪
            </span>
            <span className="w-[1px] h-3 bg-outline-variant"></span>
            <span>核数一致性: 100%</span>
            <span className="w-[1px] h-3 bg-outline-variant"></span>
            <span>2026.05.30 11:42:00</span>
          </div>
        </div>

        {/* Utilities CTAs */}
        <div className="flex gap-3 text-sm">
          <button className="px-5 py-2 hover:bg-surface-container-high transition-colors flex items-center gap-2 font-semibold border border-outline-variant/35 rounded-lg text-slate-200 cursor-pointer">
            <Filter size={16} /> 
            <span>筛选</span>
          </button>
          <button className="px-5 py-2 bg-primary text-on-primary rounded hover:brightness-110 transition-all flex items-center gap-2 font-bold cursor-pointer">
            <Download size={16} /> 
            <span>导出报表</span>
          </button>
        </div>
      </section>

      {/* Analytics KPI Metric Board Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI Card 1 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-on-surface-variant font-mono text-xs uppercase tracking-wider font-bold">
              {userRole === 'labeler' ? '我的应得收益总额' : '支出与利润对比'}
            </p>
            <div className="flex items-center gap-1 text-primary text-xs font-mono font-bold">
              <TrendingUp size={12} />
              <span>{userRole === 'labeler' ? '极速结算' : '+12.4% 周同比'}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-primary font-mono text-2xl font-bold">
              {userRole === 'labeler' ? '¥6,542.40' : '¥284,540.25'}
            </span>
          </div>
          {/* Sparkline miniature path mapping */}
          <div className="mt-6 h-8 flex items-end opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,15 L10,12 L20,18 L30,5 L40,14 L50,8 L60,15 L70,10 L80,18 L90,8 L100,12" fill="none" stroke="#c2c1ff" strokeWidth="1.5"></path>
            </svg>
          </div>
        </div>

        {/* KPI Card 2 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-on-surface-variant font-mono text-xs uppercase tracking-wider font-bold">
              {userRole === 'labeler' ? '已收/已发薪酬' : '利润率指标'}
            </p>
            <div className="flex items-center gap-1 text-tertiary text-xs font-mono font-bold">
              <TrendingUp size={12} />
              <span>{userRole === 'labeler' ? '92% 划拨率' : '32.4% 利润率'}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-white font-mono text-2xl font-bold">
              {userRole === 'labeler' ? '¥5,300.00' : '¥92,120.80'}
            </span>
          </div>
          <div className="mt-6 h-8 flex items-end opacity-40">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,10 L20,12 L40,10 L60,8 L80,12 L100,10" fill="none" stroke="#ffffff" strokeWidth="1.5"></path>
            </svg>
          </div>
        </div>

        {/* KPI Card 3 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-on-surface-variant font-mono text-xs uppercase tracking-wider font-bold">
              {userRole === 'labeler' ? '我已提报的数据包' : '累积结算条数'}
            </p>
            <div className="flex items-center gap-1 text-green-400 text-xs font-mono font-bold">
              <span>99.9% 质量</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-white font-mono text-2xl font-bold">
              {userRole === 'labeler' ? '45,120' : '1,245,600'}
            </span>
            <span className="text-xs text-on-surface-variant font-mono uppercase ml-1.5 font-bold">
              {userRole === 'labeler' ? '条/帧' : '条目'}
            </span>
          </div>
          <div className="mt-6">
            <div className="h-1 bg-green-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 w-[98%] shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* KPI Card 4 */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-on-surface-variant font-mono text-xs uppercase tracking-wider font-bold">
              {userRole === 'labeler' ? '能效排名/评级' : '托管标注员'}
            </p>
            <div className="flex items-center gap-1 text-primary text-xs font-mono font-bold">
              <span>{userRole === 'labeler' ? '能效黑带' : '已同步'}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-white font-mono text-2xl font-bold">
              {userRole === 'labeler' ? 'NO.16' : '142'}
            </span>
            <span className="text-xs text-on-surface-variant font-mono uppercase ml-1.5 font-bold">
              {userRole === 'labeler' ? '席位' : '标注员'}
            </span>
          </div>
          <div className="mt-6">
            {userRole === 'labeler' ? (
              <span className="text-[11px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded font-mono font-bold">
                等级: S+ 超高精标定全能手
              </span>
            ) : (
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full border border-background bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">A</div>
                <div className="w-5 h-5 rounded-full border border-background bg-secondary/20 flex items-center justify-center text-[8px] font-bold text-white">B</div>
                <div className="w-5 h-5 rounded-full border border-background bg-tertiary/20 flex items-center justify-center text-[8px] font-bold text-white">C</div>
                <div className="w-5 h-5 rounded-full border border-background bg-surface-container-highest flex items-center justify-center text-[8px] font-bold text-outline">+139</div>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* Terminal Ledger high density listing */}
      <section className="glass-card rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl">
        <div className="px-8 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high/20 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-4.5 bg-primary rounded-full"></div>
            <h3 className="font-headline text-base font-bold text-white">
              详细结算清单
              <span className="text-on-surface-variant font-mono text-xs font-normal ml-3">终端查询输出_5</span>
            </h3>
          </div>

          <div className="flex bg-surface-container-lowest/50 rounded p-1 border border-outline-variant/35 backdrop-blur-sm">
            <button 
              onClick={() => setFilterSlug('all')}
              className={`px-4 py-1.5 text-xs font-bold rounded uppercase tracking-wider cursor-pointer ${
                filterSlug === 'all' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              全部
            </button>
            <button 
              onClick={() => setFilterSlug('label')}
              className={`px-4 py-1.5 text-xs font-bold rounded uppercase tracking-wider cursor-pointer ${
                filterSlug === 'label' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              标注组
            </button>
            <button 
              onClick={() => setFilterSlug('audit')}
              className={`px-4 py-1.5 text-xs font-bold rounded uppercase tracking-wider cursor-pointer ${
                filterSlug === 'audit' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              审核组
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-on-surface-variant font-mono border-b border-outline-variant/20 bg-surface-container-low/30">
                <th className="px-8 py-4 font-semibold uppercase tracking-wider text-xs">用户标识</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">已结算条目</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">
                  {userRole === 'labeler' ? '我的结算单价' : '标注单价'}
                </th>
                {userRole !== 'labeler' && <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">业务单价</th>}
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right text-primary">
                  {userRole === 'labeler' ? '完成合计金额' : '结算金额'}
                </th>
                {userRole !== 'labeler' && <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">利润</th>}
                <th className="px-8 py-4 font-semibold uppercase tracking-wider text-xs text-center">状态</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/10 text-on-surface font-semibold">
              {displayedLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-10 text-center font-mono text-xs text-on-surface-variant italic">
                    没有找到匹配的结算清单记录。
                  </td>
                </tr>
              ) : (
                displayedLedger.map((row) => (
                  <tr key={row.id} className="transition-all hover:bg-primary/5">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant font-mono text-xs shadow-inner font-bold">
                        {row.initials}
                      </div>
                      <div>
                        <p className="text-on-surface text-sm font-semibold">{row.name}</p>
                        <p className="text-xs text-on-surface-variant font-mono mt-0.5 tracking-wider font-semibold">ID: {row.hexId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="inline-block text-right">
                      <p className="font-mono text-[13px] text-on-surface">{row.items.toLocaleString()}</p>
                      <div className="w-16 h-1 bg-surface-container-lowest rounded-full mt-1.5 ml-auto overflow-hidden">
                        <div className="h-full bg-primary/40 rounded-full" style={{ width: `${row.percentage}%` }}></div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-mono text-[13px] text-on-surface-variant">¥ {row.priceLabel.toFixed(3)}</td>
                  {userRole !== 'labeler' && <td className="px-6 py-4 text-right font-mono text-[13px] text-on-surface-variant">¥ {row.priceAdmin.toFixed(3)}</td>}
                  <td className="px-6 py-4 text-right font-mono font-bold text-primary text-[14px]">¥ {row.payout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  {userRole !== 'labeler' && <td className="px-6 py-4 text-right font-mono text-on-surface-variant text-[13px]">¥ {row.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>}
                  
                  <td className="px-8 py-4 text-center">
                    {row.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-primary/20 bg-primary/5 text-primary text-xs font-bold font-mono">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span> 待审核支付
                      </span>
                    )}
                    {row.status === 'paid' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-bold font-mono">
                        <span className="w-1 h-1 rounded-full bg-green-400"></span> 已发放
                      </span>
                    )}
                    {row.status === 'error' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-error/30 bg-error/5 text-error text-xs font-bold font-mono">
                        <span className="w-1 h-1 rounded-full bg-error"></span> 异常核算
                      </span>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Footer Paginate */}
        <div className="px-6 py-4 border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-low/20 text-xs font-mono text-on-surface-variant">
          <p>支出与利润对比</p>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-surface-container-high transition-colors cursor-pointer text-on-surface-variant">
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-primary bg-primary text-on-primary text-xs font-bold">1</button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-surface-container-high transition-colors cursor-pointer text-on-surface-variant">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Settlement detailed line chart plot & quick buttons */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Layered dual line/area charts */}
        <div className="lg:col-span-2 glass-card p-8 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h4 className="font-headline text-lg font-bold text-white">结算趋势分析</h4>
              <p className="text-on-surface-variant font-mono text-xs tracking-wider uppercase font-bold">支出与利润对比</p>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(194,193,255,0.6)]"></span>
                <span>支出</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
                <span>利润</span>
              </div>
            </div>
          </div>

          <div className="relative h-64 w-full">
            <div className="absolute inset-0 flex flex-col justify-between opacity-5">
              <div className="border-t border-white w-full"></div>
              <div className="border-t border-white w-full"></div>
              <div className="border-t border-white w-full"></div>
              <div className="border-t border-white w-full"></div>
              <div className="border-t border-white w-full"></div>
            </div>

            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="payoutGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#c2c1ff" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#c2c1ff" stopOpacity="0"></stop>
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#918f9f" stopOpacity="0.15"></stop>
                  <stop offset="100%" stopColor="#918f9f" stopOpacity="0"></stop>
                </linearGradient>
              </defs>

              {/* Profit Area */}
              <path 
                d="M 0 180 Q 100 170 200 175 T 400 165 T 600 170 T 800 155 T 1000 160 L 1000 200 L 0 200 Z" 
                fill="url(#profitGrad)"
              />

              {/* Payout Glowing Area Overlay */}
              <path 
                d="M 0 150 Q 100 130 200 140 T 400 110 T 600 120 T 800 80 T 1000 90 L 1000 200 L 0 200 Z" 
                fill="url(#payoutGrad)"
              />

              {/* Payout Glowing line stroke */}
              <path 
                d="M 0 150 Q 100 130 200 140 T 400 110 T 600 120 T 800 80 T 1000 90" 
                fill="none" 
                stroke="#c2c1ff" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5}
                className="glow-stroke"
              />

              {/* Glowing active pulse point */}
              <circle cx="100%" cy="45%" r="4" fill="#c2c1ff" className="glow-stroke animate-pulse" />
            </svg>
          </div>

          <div className="mt-6 flex justify-between text-on-surface-variant font-mono text-xs uppercase tracking-wider border-t border-outline-variant/10 pt-4">
            <span>W14</span><span>W15</span><span>W16</span><span>W17</span><span>W18</span><span>W19</span><span>W20</span><span>W21</span><span>W22</span><span>W23</span>
          </div>
        </div>

        {/* Quick billing parameters & interactive simulator */}
        <div className="glass-card p-8 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <h4 className="font-headline text-lg font-bold text-white mb-6">
              {userRole === 'labeler' ? '我的资产提现控制' : '快速结算指令'}
            </h4>
            
            <div className="space-y-4">
              
              {/* Simulator Action Button */}
              <button 
                id="salary-trigger-pay-btn"
                onClick={handlePayTrigger}
                disabled={isPayingOut}
                className={`w-full p-5 bg-surface-container-highest/30 border border-outline-variant/35 rounded-xl hover:border-primary/50 transition-all flex justify-between items-center group cursor-pointer relative overflow-hidden`}
              >
                {/* Simulated Loading bar layout */}
                {isPayingOut && (
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-300"
                    style={{ width: `${payProgress}%` }}
                  ></div>
                )}

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Send size={16} className={isPayingOut ? 'animate-bounce' : ''} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">
                      {isPayingOut ? (userRole === 'labeler' ? `快速转账中 ${payProgress}%...` : `一键结算中 ${payProgress}%...`) : (userRole === 'labeler' ? '提现至我的结算卡' : '一键发放薪资')}
                    </p>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                      {userRole === 'labeler' ? '卡片: 招商银行储蓄卡 (*4920)' : 'Pending: 45 Users / ¥120,450'}
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-primary/40 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button className="w-full p-5 bg-surface-container-highest/30 border border-outline-variant/35 rounded-xl hover:border-secondary/50 transition-all flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">
                      {userRole === 'labeler' ? '反馈计薪账目争议' : '处理核算异常'}
                    </p>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                      {userRole === 'labeler' ? 'Active_Tickets: 0 件' : 'Active_Alerts: 03 Items'}
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-secondary/40 group-hover:translate-x-1.5 transition-transform" />
              </button>

            </div>
          </div>

          <div className="pt-8 border-t border-outline-variant/20 mt-6 font-mono">
            <div className="flex justify-between items-center text-xs mb-3 uppercase tracking-wider text-on-surface-variant font-bold">
              <span>{userRole === 'labeler' ? '安全薪福保障积分' : '集群负载 METER'}</span>
              <span className="text-primary">{userRole === 'labeler' ? '98.5分 / 信誉极佳' : '12% / NORMAL'}</span>
            </div>
            <div className="w-full h-1 bg-surface-container-lowest rounded-full overflow-hidden flex gap-0.5">
              <div className="w-[98%] h-full bg-primary shadow-[0_0_8px_rgba(194,193,255,0.4)]"></div>
              <div className="flex-1 h-full bg-surface-container-high"></div>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
