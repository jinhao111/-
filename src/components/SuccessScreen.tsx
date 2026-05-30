import { useEffect, useState } from 'react';
import { Terminal, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

interface SuccessScreenProps {
  onBypass: () => void;
}

export default function SuccessScreen({ onBypass }: SuccessScreenProps) {
  const [countdown, setCountdown] = useState(3);

  // Automatic countdown transition mapping matching standard mockup timing (3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onBypass();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onBypass]);

  return (
    <div id="success-screen-root" className="min-h-screen w-full bg-[#070708] flex items-center justify-center relative overflow-hidden flex-col font-sans select-none">
      
      {/* Telemetry Dots Grid Overlay */}
      <div className="absolute inset-0 telemetry-grid opacity-30 pointer-events-none z-0"></div>

      {/* Main success dialog card */}
      <main className="relative z-10 w-full max-w-[460px] px-6 py-10 flex-grow flex items-center justify-center">
        <div className="glass-panel rounded-xl p-10 flex flex-col items-center text-center w-full shadow-2xl relative overflow-hidden">
          
          {/* Brand Identity */}
          <div className="mb-10 flex items-center gap-2 select-none">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary shadow-[0_0_10px_rgba(194,193,255,0.4)]">
              <Terminal size={16} />
            </div>
            <span className="font-headline text-lg font-bold tracking-tighter text-primary uppercase">Romer</span>
          </div>

          {/* Glowing check animations */}
          <div className="mb-8 relative select-none">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative w-20 h-20 bg-primary-container/20 border border-primary/20 rounded-full flex items-center justify-center scale-95 shadow-inner">
              <CheckCircle2 size={48} className="text-primary glow-stroke animate-pulse" />
            </div>
          </div>

          {/* Feedback Heading Header */}
          <div className="space-y-2 mb-10">
            <h1 className="font-headline text-xl font-bold text-white tracking-tight">身份验证通过</h1>
            <p className="text-xs font-mono text-outline uppercase tracking-wider">Authentication Successful</p>
          </div>

          {/* Thin progress loaders indicator bar matching CSS animation */}
          <div className="w-full space-y-4">
            <div className="flex justify-between items-end text-xs font-mono font-bold">
              <span className="text-primary uppercase tracking-widest">System Access</span>
              <span className="text-on-surface-variant italic">正在进入系统控制台... ({countdown}s)</span>
            </div>

            {/* Custom loaded bar */}
            <div className="h-[2px] w-full bg-outline-variant/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary shadow-[0_0_8px_rgba(194,193,255,0.6)] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between pt-2 text-xs font-mono font-bold text-on-surface-variant/80 uppercase tracking-widest">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>Session Secure</span>
              </div>
              <span>Romer OS v4.2.0</span>
            </div>
          </div>

          {/* Instant Bypass command button */}
          <button 
            id="success-instant-bypass"
            onClick={onBypass}
            className="mt-10 font-mono text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer select-none group uppercase tracking-widest leading-none"
          >
            <span>立即进入 Workspace</span>
            <ChevronRight size={12} className="group-hover:translate-x-1 duration-150" />
          </button>

        </div>
      </main>

      {/* Footer Meta */}
      <footer className="relative z-10 w-full px-8 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-outline font-bold">
        <div className="flex items-center gap-6">
          <span className="uppercase tracking-wider">© 2024 ROMER INSTRUMENTS INC.</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-slow"></span>
            <span className="uppercase tracking-wider">SYS_STATUS: OPTIMAL</span>
          </div>
        </div>
        <div className="flex gap-6 uppercase tracking-wider text-on-surface-variant">
          <a href="#pro" className="hover:text-primary transition-colors">Security Protocol</a>
          <a href="#agr" className="hover:text-primary transition-colors">User Agreement</a>
          <a href="#sup" className="hover:text-primary transition-colors">Terminal Support</a>
        </div>
      </footer>

    </div>
  );
}
