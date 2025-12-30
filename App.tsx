import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ImageGenerator } from './components/ImageGenerator';
import { ThumbnailCreator } from './components/ThumbnailCreator';
import { VoiceOver } from './components/VoiceOver';
import { AppMode, Theme } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.IMAGE);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('dope-theme') as Theme) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('dope-theme', theme);
  }, [theme]);

  const renderContent = () => {
    switch (mode) {
      case AppMode.IMAGE:
        return <ImageGenerator />;
      case AppMode.THUMBNAIL:
        return <ThumbnailCreator />;
      case AppMode.VOICEOVER:
        return <VoiceOver />;
      default:
        return <ImageGenerator />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Background blobs for appealing visuals */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/20 dark:bg-primary-600/10 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-blob"></div>
         <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/10 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Navigation 
        currentMode={mode} 
        onModeChange={setMode} 
        currentTheme={theme}
        onThemeChange={setTheme}
      />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;