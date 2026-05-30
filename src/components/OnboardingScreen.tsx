import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  UserCheck, 
  KeyRound, 
  Check, 
  Building2, 
  FileText, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (role: 'admin' | 'labeler', name: string, email: string) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  // Stepper state: 1 = Verification, 2 = Profile Configuration, 3 = Safety NDA Signature
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Phase 1: Verification Form
  const [email, setEmail] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [otpError, setOtpError] = useState('');

  // Phase 2: Profile Settings
  const [realName, setRealName] = useState('');
  const [department, setDepartment] = useState('自动驾驶感知事业部 (CV)');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'admin' | 'labeler'>('labeler');

  // Phase 3: NDA & Commitments
  const [ndaChecked, setNdaChecked] = useState(false);
  const [preshowConfirmMode, setPreshowConfirmMode] = useState(false);

  // Interactive Code countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Pass checks
  const hasLength = newPassword.length >= 8;
  const hasUpperCaseAndDigit = /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#\$%\^&\*]/.test(newPassword);
  const isPasswordMatch = newPassword && newPassword === confirmPassword;
  const isPasswordValidCount = hasLength && hasUpperCaseAndDigit && hasSpecialChar && isPasswordMatch;

  const triggerOtpSend = () => {
    if (!email.trim() || !email.includes('@')) {
      alert('请先输入有效的企业/标注员注册电子邮箱');
      return;
    }
    setTimer(60);
    setOtpError('');
    // Mock auto-generate dynamic OTP and preset activation code for user convenience/visibility
    setOtpCode('294821');
    setActivationCode('ROM-INV-9932');
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (otpCode !== '294821' && otpCode !== '123456') {
      setOtpError('验证码无效。输入 demo 验证码: 294821 即可绕过');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!realName.trim()) {
      alert('请输入您的合法真实姓名以进行实名证书发放');
      return;
    }
    if (!isPasswordValidCount) {
      alert('请确保密码复杂度达到极高等级安全标准');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ndaCheckEnabled) return;
    setPreshowConfirmMode(true);
    setTimeout(() => {
      onComplete(role, realName || '高通量标定员', email || 'annotator@romer.com');
    }, 2000);
  };

  // Skip wizard directly for quick admin demo bypass on demand
  const handleDirectDemoBypass = () => {
    // Fill mock data
    setEmail('admin@romer.io');
    setRealName('超级管理员');
    setNewPassword('Romer123!!');
    onComplete('admin', '超级管理员', 'admin@romer.io');
  };

  const handleLabelerDemoBypass = () => {
    setEmail('romer_annotator_03@romer.com');
    setRealName('张伟 (Roster 3#)');
    setNewPassword('Annotator996!');
    onComplete('labeler', '张伟 (标注员)', 'romer_annotator_03@romer.com');
  };

  const ndaCheckEnabled = ndaChecked;

  return (
    <div id="onboarding-root" className="relative inset-0 w-full min-h-screen bg-[#030305] flex items-center justify-center p-4 sm:p-10 select-none overflow-hidden font-sans">
      
      {/* Dynamic Iris/Prismatic floating light blobs backdrop mimicking ReactBits "pris" studio */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sweep-prism-one {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(60px, -90px) scale(1.2) rotate(120deg); }
          66% { transform: translate(-40px, 60px) scale(0.8) rotate(240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
        }
        @keyframes sweep-prism-two {
          0% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-80px, 70px) scale(1.35) rotate(-180deg); }
          100% { transform: translate(0px, 0px) scale(1.1); }
        }
        @keyframes sweep-prism-three {
          0% { transform: translate(0px, 0px) scale(1); }
          45% { transform: translate(90px, -50px) scale(0.9) rotate(90deg); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .pris-blob-fuchsia {
          animation: sweep-prism-one 22s ease-in-out infinite;
        }
        .pris-blob-cyan {
          animation: sweep-prism-two 26s ease-in-out infinite;
        }
        .pris-blob-violet {
          animation: sweep-prism-three 19s ease-in-out infinite;
        }
        .pris-grid-overlay-matrix {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(235, 235, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(235, 235, 255, 0.02) 1px, transparent 1px);
        }
      `}} />

      {/* Prismatic Fluid Background Layout */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {/* Blob A - Intense Pink / Fuchsia */}
        <div className="absolute top-[8%] left-[12%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/20 mix-blend-screen filter blur-[120px] pris-blob-fuchsia"></div>
        {/* Blob B - Ocean Cyan */}
        <div className="absolute bottom-[10%] right-[8%] w-[550px] h-[550px] rounded-full bg-cyan-500/15 mix-blend-screen filter blur-[130px] pris-blob-cyan"></div>
        {/* Blob C - Lavender Purple */}
        <div className="absolute top-[35%] right-[22%] w-[420px] h-[420px] rounded-full bg-indigo-500/20 mix-blend-screen filter blur-[110px] pris-blob-violet"></div>
        {/* Darkening Grid filter overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305]/60 opacity-95 z-1"></div>
        <div className="absolute inset-0 pris-grid-overlay-matrix opacity-40 z-2"></div>
        {/* Deep vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030305_95%)] z-3"></div>
      </div>

      {/* Left Bottom HUD Indicator (Aesthetic details) */}
      <div className="absolute bottom-8 left-10 opacity-15 pointer-events-none hidden xl:block select-none font-mono z-5 text-left">
        <span className="px-2 py-1 bg-primary/20 border border-primary/25 rounded text-[8px] text-primary uppercase font-bold tracking-widest">
          SYS_STATUS: READY FOR DEVIATION
        </span>
        <div className="text-[55px] leading-none font-bold text-outline tracking-wider mt-2">ROMER INTERACTION</div>
        <div className="text-[12px] tracking-[1.25em] text-primary/80 mt-2 uppercase">MULTI-MODAL DIRECTORY SYSTEM</div>
      </div>

      {/* Main Container Form */}
      <main className="relative z-10 w-full max-w-[500px] rounded-2xl p-6 sm:p-10 flex flex-col items-center shadow-[0_0_80px_rgba(3,3,5,0.9)] border border-white/10 bg-[#0a0c12]/70 backdrop-blur-3xl transition-all duration-300">
        
        {/* Floating sparkles logo element */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10px] right-[-10px] w-20 h-20 border-r border-t border-primary"></div>
        </div>

        {/* Branding header block */}
        <div className="text-center mb-8 w-full">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_24px_rgba(194,193,255,0.25)] select-none">
              <ShieldCheck size={28} className="animate-pulse" />
            </div>
          </div>
          <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">Romer 成员首次启用激活</h2>
          <p className="text-xs text-on-surface-variant max-w-[340px] mx-auto leading-relaxed opacity-75">
            管理员已为您分配临时系统席位凭证，通过首次绑定流程即可初始化您的企业级独立加解密信道及工作台。
          </p>
        </div>

        {/* Stepper Progress bar indicators */}
        <div className="flex items-center justify-between w-full mb-8 font-sans">
          
          <div className="flex flex-col items-center flex-1 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 z-10 ${
              step >= 1 ? 'bg-primary text-zinc-950 font-black shadow-[0_0_12px_rgba(194,193,255,0.5)]' : 'bg-surface-container-high border border-outline-variant text-on-surface-variant'
            }`}>
              {step > 1 ? <Check size={14} className="stroke-[3]" /> : '01'}
            </div>
            <span className={`text-xs mt-2 font-semibold transition-colors duration-200 ${step >= 1 ? 'text-primary' : 'text-outline-variant'}`}>身份绑定</span>
          </div>

          <div className="flex-1 h-[2px] bg-outline-variant/30 relative">
            <div className={`absolute left-0 top-0 h-full bg-primary transition-all duration-500`} style={{ width: step > 1 ? '100%' : '0%' }}></div>
          </div>

          <div className="flex flex-col items-center flex-1 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 z-10 ${
              step >= 2 ? 'bg-primary text-zinc-950 font-black shadow-[0_0_12px_rgba(194,193,255,0.5)]' : 'bg-surface-container-high border border-outline-variant text-on-surface-variant'
            }`}>
              {step > 2 ? <Check size={14} className="stroke-[3]" /> : '02'}
            </div>
            <span className={`text-xs mt-2 font-semibold transition-colors duration-200 ${step >= 2 ? 'text-primary' : 'text-outline-variant'}`}>账户配置</span>
          </div>

          <div className="flex-1 h-[2px] bg-outline-variant/30 relative">
            <div className={`absolute left-0 top-0 h-full bg-primary transition-all duration-500`} style={{ width: step > 2 ? '100%' : '0%' }}></div>
          </div>

          <div className="flex flex-col items-center flex-1 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 z-10 ${
              step >= 3 ? 'bg-primary text-zinc-950 font-black shadow-[0_0_12px_rgba(194,193,255,0.5)]' : 'bg-surface-container-high border border-outline-variant text-on-surface-variant'
            }`}>
              '03'
            </div>
            <span className={`text-xs mt-2 font-semibold transition-colors duration-200 ${step >= 3 ? 'text-primary' : 'text-outline-variant'}`}>条款签毕</span>
          </div>

        </div>

        {/* Core Wizard Form Sheets */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="w-full space-y-5 text-sm animate-fade-in text-left">
            
            {/* Email Bind input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant px-1">企业电子邮箱 (Email Address)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setOtpError(''); }}
                  required
                  className="w-full h-11 pl-12 pr-4 bg-surface-container-lowest/30 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline/40 text-sm text-white"
                  placeholder="请输入分发的企业内网邮箱 (例: text@inv.com)"
                />
              </div>
            </div>

            {/* Inner Activation Voucher */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant px-1">管理员专属激活码 (Activation Code)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                <input
                  type="text"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  className="w-full h-11 pl-12 pr-4 bg-surface-container-lowest/30 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant/50 text-sm font-mono text-white"
                  placeholder="管理员分发的临时激活码 (例: ROM-INV-XXXX)"
                />
              </div>
            </div>

            {/* Verification OTP Trigger with Timer */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant px-1">邮箱双重二次验证码 (Two-Factor OTP)</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => { setOtpCode(e.target.value); setOtpError(''); }}
                    required
                    maxLength={6}
                    className="w-full h-11 pl-12 pr-4 bg-surface-container-lowest/30 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-mono tracking-widest text-white fill-none"
                    placeholder="输入 6 位数验证码"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={triggerOtpSend}
                  disabled={timer > 0}
                  className={`px-4 h-11 text-xs font-bold rounded-lg transition-all flex items-center justify-center shrink-0 border ${
                    timer > 0 
                      ? 'bg-transparent border-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed' 
                      : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/25 cursor-pointer'
                  }`}
                >
                  {timer > 0 ? `${timer}s 重新拉取` : '获取验证码'}
                </button>
              </div>
              
              {timer > 0 && !otpError && (
                <p className="text-xs font-mono text-primary/80 mt-1 flex items-center gap-1">
                  <Sparkles size={11} /> 
                  提示：验证码已发送至模拟邮箱，请输入验证秘钥: <span className="underline font-black font-sans bg-primary/25 px-1 py-0.2 rounded text-white text-xs">294821</span>
                </p>
              )}

              {otpError && (
                <p className="text-xs font-mono text-error font-medium">{otpError}</p>
              )}
            </div>

            {/* Step Submit */}
            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 h-12 bg-primary text-zinc-950 font-bold rounded-xl hover:brightness-110 hover:shadow-[0_0_15px_rgba(194,193,255,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>验证身份并继续</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="w-full space-y-4 text-sm animate-fade-in text-left">
            
            {/* Real Name Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant px-1">真实姓名 (Romer Directory Name)</label>
              <div className="relative group">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  required
                  className="w-full h-11 pl-12 pr-4 bg-surface-container-lowest/30 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant text-sm text-white"
                  placeholder="用于生成团队绩效与薪酬扣划的姓名"
                />
              </div>
            </div>

            {/* Sorter Department choosing dropdown options */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant px-1">所属标定项目组 (Assigned Sorter Division)</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-11 pl-12 pr-4 bg-[#0a0c12]/95 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-white appearance-none cursor-pointer"
                >
                  <option value="自动驾驶视觉组 (CV)">自动驾驶感知事业部 (CV)</option>
                  <option value="智慧医疗微雕组 (3D CT)">智慧医疗微雕事业部 (3D CT)</option>
                  <option value="NLP 语义深度模型组">大语言模型语义标注事业部 (NLP)</option>
                  <option value="高精度点云雷达标定组 (LiDAR)">点云激光雷达标定组 (LiDAR)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant text-xs">▼</div>
              </div>
            </div>

            {/* System Role Option */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant px-1">配置工作站系统权限角色 (Station Access Role)</label>
              <div className="relative">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'labeler')}
                  className="w-full h-11 pl-12 pr-4 bg-[#0a0c12]/95 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-white appearance-none cursor-pointer font-bold"
                >
                  <option value="labeler">高通量算法标注员 (Annotator / Sorter)</option>
                  <option value="admin">系统超级管理员 (Console Admin)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant text-xs">▼</div>
              </div>
            </div>

            {/* Set Secure Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant px-1">设置唯一安全登陆密码 (Identity Password)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full h-11 pl-12 pr-12 bg-surface-container-lowest/30 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant/40 text-sm text-white"
                  placeholder="确保不与其它公共网络密码相同"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-white transition-colors cursor-pointer p-0.5 rounded"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm lock details */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant px-1">重复验证登陆密码 (Confirm Password)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-11 pl-12 pr-4 bg-surface-container-lowest/30 border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant/40 text-sm text-white"
                  placeholder="核对并输入相同的密码"
                />
              </div>
            </div>

            {/* Secure strength checker badges */}
            <div className="space-y-2 p-3 bg-[#0d0e14] border border-outline-variant/30 rounded-xl">
              <span className="block font-mono text-xs text-outline uppercase font-bold mb-1.5">安全信道校验指标 (SECURE PARAM SCANNER)</span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold">
                <div className={`flex items-center gap-1.5 ${hasLength ? 'text-green-400' : 'text-outline/50'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs font-black ${hasLength ? 'bg-green-500/10 text-green-400' : 'bg-white/5'}`}>✓</span>
                  <span>长度至少 8 位</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpperCaseAndDigit ? 'text-green-400' : 'text-outline/50'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs font-black ${hasUpperCaseAndDigit ? 'bg-green-500/10 text-green-400' : 'bg-white/5'}`}>✓</span>
                  <span>大写字母与数字</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecialChar ? 'text-green-400' : 'text-outline/50'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs font-black ${hasSpecialChar ? 'bg-green-500/10 text-green-400' : 'bg-white/5'}`}>✓</span>
                  <span>包含特殊标点</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isPasswordMatch ? 'text-green-400' : 'text-outline/50'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs font-black ${isPasswordMatch ? 'bg-green-500/10 text-green-400' : 'bg-white/5'}`}>✓</span>
                  <span>两次密码一致</span>
                </div>
              </div>
            </div>

            {/* Stepper Buttons Group */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-12 h-12 bg-surface-container-high text-on-surface border border-outline-variant/55 rounded-xl hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="submit"
                disabled={!isPasswordValidCount}
                className={`flex-1 h-12 font-bold rounded-xl transition-all flex items-center justify-center gap-1 text-sm cursor-pointer ${
                  isPasswordValidCount 
                    ? 'bg-primary text-zinc-950 font-black shadow-[0_0_15px_rgba(194,193,255,0.4)] hover:brightness-110' 
                    : 'bg-surface-container-high/40 border border-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed'
                }`}
              >
                <span>配置并继续</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="w-full space-y-4 text-sm animate-fade-in text-left">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant px-1 flex items-center gap-1.5">
                <FileText size={12} className="text-primary" />
                <span>Romer AI 系统数据标注安全与保密协议 (NDA)</span>
              </label>
              
              {/* NDA Text Scroller Block */}
              <div className="w-full h-44 p-3.5 bg-[#08090d] border border-outline-variant rounded-xl overflow-y-auto text-on-surface-variant text-xs leading-relaxed font-sans select-text select-text custom-scroller">
                <p className="font-bold text-white mb-2 text-xs">第一条 协议宗旨与机密定义</p>
                <p className="mb-3 opacity-80">Romer AI（简称“本系统”）中所展示、流转或提供的任何级别点云、图片、文本、病理切片等资产，均隶属于高空防御、自动驾驶和核心主权医疗等战略级保密数据。标注员或审核员对该等信息或素材负有绝对、非解密的无限责任保密义务。本保密自登录生效后无限期持续。</p>
                <p className="font-bold text-white mb-2 text-xs">第二条 用户作业权限及安全合规约束</p>
                <p className="mb-3 opacity-80">1. 禁止私自下载、拍照、截屏或使用外部感知工具（如个人智能终端相机）复制/保留任何数据集资产原型。<br/>
                2. 禁止任何公共或私人论坛/媒体渠道转存本平台分发密码或密钥数据。<br/>
                3. 本平台采用链上实时日志签名校验，对于所有越权操作都将进行精确归属，追踪至本地 IP 归属及 MAC 无线节点地址。</p>
                <p className="font-bold text-white mb-2 text-xs">第三条 法律管辖及权属赔偿</p>
                <p className="opacity-80">凡发生任何实质数据泄露行为，ROMER AI 所属科技集团有权无条件清退责任人员账户，不予清结剩余未付劳务费薪资。保留调拨司法追责和主张实质性商誉亏损赔偿的完备权利。</p>
              </div>
            </div>

            {/* Custom Checkbox */}
            <div className="pt-2">
              <label className={`w-full p-3.5 rounded-xl border flex items-start gap-3 transition-colors cursor-pointer select-none ${
                ndaChecked 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'bg-surface-container-low/40 border-outline-variant text-on-surface-variant hover:text-white'
              }`}>
                <input 
                  type="checkbox"
                  checked={ndaChecked}
                  onChange={(e) => setNdaChecked(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-0 focus:ring-offset-0 size-4 mt-0.5 cursor-pointer accent-primary shrink-0"
                />
                <div className="text-xs">
                  <span className="font-bold block text-white mb-0.5">我已阅读并完全同意上述NDA条款条款</span>
                  <span className="text-xs opacity-80 block leading-normal">我本人保证履行在 Romer Workstation 中的核心数据完全隔离不落地责任。</span>
                </div>
              </label>
            </div>

            {/* Stepper Buttons Group */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-12 h-12 bg-surface-container-high text-on-surface border border-outline-variant/55 rounded-xl hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              
              <button
                type="submit"
                disabled={!ndaCheckEnabled || preshowConfirmMode}
                className={`flex-1 h-12 font-bold rounded-xl transition-all flex items-center justify-center gap-1 text-sm cursor-pointer ${
                  ndaCheckEnabled && !preshowConfirmMode
                    ? 'bg-primary text-zinc-950 font-black shadow-[0_0_16px_rgba(194,193,255,0.4)] hover:brightness-110' 
                    : 'bg-surface-container-high/40 border border-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed'
                }`}
              >
                {preshowConfirmMode ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>校验上链注册中...</span>
                  </div>
                ) : (
                  <>
                    <span>正式激活并登入控制台</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Dynamic demo convenience trigger */}
        <div className="w-full text-center mt-6 pt-5 border-t border-white/5 flex flex-col gap-3">
          {step === 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <button 
                type="button"
                onClick={handleDirectDemoBypass}
                className="text-xs font-mono text-primary/70 hover:text-primary transition-all hover:underline cursor-pointer flex items-center gap-1 font-bold py-1 px-3 rounded-md bg-white/5 border border-white/5 hover:border-primary/20"
              >
                <Sparkles size={11} className="text-primary animate-pulse" />
                <span>以超级管理员身份直接登入 (Demo Admin Bypass)</span>
              </button>
              <button 
                type="button"
                onClick={handleLabelerDemoBypass}
                className="text-xs font-mono text-secondary/70 hover:text-secondary transition-all hover:underline cursor-pointer flex items-center gap-1 font-bold py-1 px-3 rounded-md bg-white/5 border border-white/5 hover:border-secondary/20"
              >
                <Sparkles size={11} className="text-secondary animate-pulse" />
                <span>以高通量标注员身份直接登入 (Demo Labeler Bypass)</span>
              </button>
            </div>
          )}

          {/* Core Authorization Label with Online Pulse */}
          <div className="flex justify-between items-center opacity-60 font-mono text-xs font-bold tracking-wider text-outline-variant mt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              <span>REG_STAGE: SECURED</span>
            </div>
            <div>VERIFIED SECURE AUTH CHANNEL</div>
          </div>
        </div>

      </main>

    </div>
  );
}
