import React, { useState } from 'react';
import { User, Lock, Mail, Phone, CreditCard, X, Sparkles, Building2, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export default function ProfileModal({ isOpen, onClose, profile, onSave }: ProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [cardNo, setCardNo] = useState(profile.cardNo);
  const [cardBank, setCardBank] = useState(profile.cardBank);
  const [password, setPassword] = useState(profile.password || 'RomerAdmin2026!');
  const [role, setRole] = useState<'admin' | 'labeler'>(profile.role || 'labeler');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = '姓名或昵称不能为空';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) tempErrors.email = '请输入合法的邮箱地址';
    if (!phone.trim() || !/^\d{3,4}-?\d{3,4}-?\d{4}$|^\d{11}$/.test(phone)) tempErrors.phone = '请输入正确的11位手机号';
    if (!cardNo.trim() || cardNo.replace(/\s/g, '').length < 15) tempErrors.cardNo = '请输入合法的结算卡卡号 (至少 15 位数字)';
    if (!cardBank.trim()) tempErrors.cardBank = '开户行信息不能为空';
    if (!password || password.length < 6) tempErrors.password = '登录密码硬度不满足要求 (至少 6 位)';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setTimeout(() => {
      onSave({
        name,
        email,
        phone,
        cardNo,
        cardBank,
        password,
        role
      });
      setIsSaving(false);
      onClose();
    }, 800);
  };

  return (
    <div id="profile-edit-modal-wrapper" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-300"
      ></div>

      {/* Main Container */}
      <div 
        id="profile-edit-modal-container" 
        className="relative z-50 w-full max-w-2xl bg-[#0a0b0f] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(194,193,255,0.15)] overflow-hidden animate-[modal-scale_0.25s_ease-out] flex flex-col max-h-[90vh]"
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes modal-scale {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        ` }} />

        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/20">
          <div>
            <p className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-black">Account Settings / 用户中心</p>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <span>修改个人档案与结算属性</span>
              <Sparkles size={16} className="text-primary animate-pulse" />
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 px-2.5 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scroller">
          
          {/* Section 1: Base Profile */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-outline uppercase font-bold tracking-wider pb-1.5 border-b border-white/5">
              1. 核心个人信息 (Profile Details)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider px-1">真实姓名/昵称</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-[#0c0d12] border ${errors.name ? 'border-error/60' : 'border-outline-variant'} rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant/30 text-white`}
                    placeholder="请输入真实姓名或账号昵称"
                  />
                </div>
                {errors.name && <p className="text-xs text-error font-medium pl-1">{errors.name}</p>}
              </div>

              {/* Login Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider px-1">账户登录密码</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-[#0c0d12] border ${errors.password ? 'border-error/60' : 'border-outline-variant'} rounded-xl py-2.5 pl-11 pr-12 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-white`}
                    placeholder="包含大小写、数字与硬密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-error font-medium pl-1">{errors.password}</p>}
              </div>

              {/* Station Access Role Selection */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider px-1">工作站系统角色权限</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'labeler')}
                    className="w-full h-11 pl-12 pr-4 bg-[#0c0d12] border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-white appearance-none cursor-pointer font-bold"
                  >
                    <option value="labeler">高通量算法 标注员 / 标定员 (Annotator Mode)</option>
                    <option value="admin">平台系统 超级管理员 (Control Console Admin)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant text-xs">▼</div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-outline uppercase font-bold tracking-wider pb-1.5 border-b border-white/5">
              2. 联络安全通讯 (Contact & Secure Credentials)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider px-1">企业电子邮箱</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-[#0c0d12] border ${errors.email ? 'border-error/60' : 'border-outline-variant'} rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant/30 text-white`}
                    placeholder="name@romer.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-error font-medium pl-1">{errors.email}</p>}
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider px-1">安全手机联络号</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full bg-[#0c0d12] border ${errors.phone ? 'border-error/60' : 'border-outline-variant'} rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant/30 text-white`}
                    placeholder="11 位联系人手机号"
                  />
                </div>
                {errors.phone && <p className="text-xs text-error font-medium pl-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Billing & Card Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-outline uppercase font-bold tracking-wider pb-1.5 border-b border-white/5">
              3. 薪酬结算账户 (Settlement & Bank Details)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Settlement Bank Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider px-1">结算卡开户行</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text"
                    value={cardBank}
                    onChange={(e) => setCardBank(e.target.value)}
                    className={`w-full bg-[#0c0d12] border ${errors.cardBank ? 'border-error/60' : 'border-outline-variant'} rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant/30 text-white`}
                    placeholder="例如：中国工商银行北京分行"
                  />
                </div>
                {errors.cardBank && <p className="text-xs text-error font-medium pl-1">{errors.cardBank}</p>}
              </div>

              {/* Settlement Card Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-on-surface-variant font-bold uppercase tracking-wider px-1">结算账号卡号 (Bank Card/IBAN)</label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text"
                    value={cardNo}
                    onChange={(e) => {
                      // format card option or keep simple
                      setCardNo(e.target.value);
                    }}
                    className={`w-full bg-[#0c0d12] border ${errors.cardNo ? 'border-error/60' : 'border-outline-variant'} rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline-variant/30 text-white`}
                    placeholder="结算用专属借记/汇元银行卡号"
                  />
                </div>
                {errors.cardNo && <p className="text-xs text-error font-medium pl-1">{errors.cardNo}</p>}
              </div>
            </div>

            {/* Disclaimer Info */}
            <div className="p-3.5 bg-[#0f1118] border border-primary/10 rounded-xl text-xs font-sans text-on-surface-variant leading-relaxed">
              <span className="font-semibold text-primary block mb-0.5">※ 结算政策与安全声明</span>
              结算卡系接收 Romer AI 数据标注各品类薪金报酬及利润的分发核心节点。为了保障您的资金与所得税申报合规，任何结算卡和实名昵称的修改都将被永久计入系统底层区块链哈希签名日志，并自动同步给财务网关。
            </div>
          </div>

        </form>

        {/* Modal Footer */}
        <div className="px-8 py-4 border-t border-outline-variant bg-surface-container flex justify-between items-center gap-4">
          <span className="text-outline text-xs font-mono hidden sm:inline-block">
            REF_PORT: SECURE WALLET
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-on-surface-variant border border-outline-variant hover:text-white hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 bg-primary text-zinc-950 font-black rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                  正在同步...
                </>
              ) : (
                '保存修改'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
