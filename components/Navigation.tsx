import React from 'react';
import { AppMode, Theme } from '../types';
import { Camera, Mic, Image as ImageIcon, Sun, Moon, Monitor } from 'lucide-react';

interface NavigationProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const DopeLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform group-hover:scale-110 duration-300">
    <defs>
      <linearGradient id="logo_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00ff9d" />
        <stop offset="50%" stopColor="#00ccff" />
        <stop offset="100%" stopColor="#ffeb3b" />
      </linearGradient>
    </defs>
    
    {/* Outer Glow Circle */}
    <circle cx="50" cy="50" r="45" stroke="url(#logo_grad)" strokeWidth="4" strokeDasharray="20 10" className="animate-[spin_10s_linear_infinite]" opacity="0.5" />
    
    {/* Main Abstract D Shape */}
    <path 
      d="M30 20H55C75 20 85 35 85 50C85 65 75 80 55 80H30V20Z" 
      fill="url(#logo_grad)" 
      className="drop-shadow-lg"
    />
    
    {/* Inner Play/Arrow Detail */}
    <path 
        d="M45 35L65 50L45 65" 
        stroke="white" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="animate-pulse"
    />
  </svg>
);

export const Navigation: React.FC<NavigationProps> = ({ 
  currentMode, 
  onModeChange, 
  currentTheme, 
  onThemeChange 
}) => {
  const navItems = [
    { mode: AppMode.IMAGE, label: 'Image Gen', icon: ImageIcon },
    { mode: AppMode.THUMBNAIL, label: 'Thumbnails', icon: Camera },
    { mode: AppMode.VOICEOVER, label: 'Voice Over', icon: Mic },
  ];

  return (
    <nav className="w-full md:w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 flex flex-col p-6 z-20 transition-colors duration-300 relative">
      <div className="mb-10 flex items-center gap-4 px-2">
        <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-to-r from-vibrant-green via-vibrant-blue to-vibrant-yellow rounded-full blur-lg opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse"></div>
            <DopeLogo />
        </div>
        <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-vibrant-green via-vibrant-blue to-vibrant-yellow tracking-tight">
            Dope Ai
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Creative Studio</p>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <div className="text-xs font-semibold text-gray-400 px-4 mb-2 uppercase tracking-wider">Apps</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => onModeChange(item.mode)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-vibrant-green/90 via-vibrant-blue/90 to-vibrant-blue/90 text-white shadow-lg shadow-vibrant-blue/30 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={22} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-semibold">{item.label}</span>
              {isActive && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse-fast pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto space-y-6">
        {/* Theme Toggles */}
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700">
            {[
                { t: 'light', Icon: Sun },
                { t: 'system', Icon: Monitor },
                { t: 'dark', Icon: Moon }
            ].map(({ t, Icon }) => (
                <button
                    key={t}
                    onClick={() => onThemeChange(t as Theme)}
                    className={`flex-1 p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        currentTheme === t 
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-vibrant-blue dark:text-white' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                >
                    <Icon size={16} />
                </button>
            ))}
        </div>

        <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-vibrant-green animate-pulse"></div>
                <span className="text-xs font-bold text-gray-500 uppercase">System Status</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Gemini 3.0 & 2.5 Active</p>
        </div>
      </div>
    </nav>
  );
};