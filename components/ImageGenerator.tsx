import React, { useState } from 'react';
import { AspectRatio, ImageSize } from '../types';
import { generateImageOptions, enhancePrompt } from '../services/geminiService';
import { Download, Sparkles, Loader2, Maximize2, Wand2, RefreshCcw, X } from 'lucide-react';
import { triggerPixieDust } from '../utils/animationUtils';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [size, setSize] = useState<ImageSize>(ImageSize.MID);
  
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setEnhancing(true);
    try {
      const refined = await enhancePrompt(prompt);
      setPrompt(refined);
    } catch (err) {
      console.error(err);
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async (e: React.MouseEvent) => {
    if (!prompt.trim()) return;
    
    // Magical Pixie Dust Effect
    triggerPixieDust(e.clientX, e.clientY);

    setLoading(true);
    setError(null);
    setGeneratedImages([]);
    try {
      const images = await generateImageOptions(prompt, aspectRatio, size);
      setGeneratedImages(images);
      setSelectedImageIndex(0);
    } catch (err) {
      setError("Failed to generate images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentImage = generatedImages[selectedImageIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Image Studio</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Dream it, type it, see it.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Prompt Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4 transition-all duration-300">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Prompt</label>
              <button
                onClick={handleEnhance}
                disabled={enhancing || !prompt}
                className="text-xs flex items-center gap-1.5 text-vibrant-blue dark:text-vibrant-blue hover:text-vibrant-green font-medium transition-colors disabled:opacity-50"
              >
                {enhancing ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12}/>}
                Magic Enhance
              </button>
            </div>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with flying cars, cyberpunk style..."
              className="w-full h-40 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-vibrant-blue focus:border-transparent outline-none resize-none transition-all text-base leading-relaxed"
            />
          </div>

          {/* Settings Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-6 transition-all duration-300">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aspect Ratio</label>
                  <div className="relative">
                    <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-vibrant-blue outline-none appearance-none font-medium"
                    >
                        {Object.entries(AspectRatio).map(([key, value]) => (
                        <option key={key} value={value}>{key} ({value})</option>
                        ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detail Level</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as ImageSize)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-vibrant-blue outline-none appearance-none font-medium"
                  >
                    {Object.entries(ImageSize).map(([key, value]) => (
                      <option key={key} value={value}>{key} ({value})</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-4 transform hover:-translate-y-1 ${
                  loading || !prompt
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed hover:translate-y-0'
                    : 'bg-gradient-to-r from-vibrant-green via-vibrant-blue to-vibrant-yellow hover:from-vibrant-green/80 hover:to-vibrant-yellow/80 text-gray-900 shadow-xl shadow-vibrant-blue/20'
                }`}
              >
                {loading ? (
                  <><Loader2 className="animate-spin" /> Cooking...</>
                ) : (
                  <><Sparkles className="animate-pulse" /> Generate Dope Art</>
                )}
              </button>
              
              {error && <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium animate-bounce">{error}</p>}
          </div>
        </div>

        {/* Right Column: Preview & Grid */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Preview */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center group shadow-2xl shadow-gray-200/50 dark:shadow-none transition-all duration-300">
            {currentImage ? (
              <>
                <img src={currentImage} alt="Generated Main" className="w-full h-full object-contain animate-fade-in-up" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                  <a
                    href={currentImage}
                    download={`dope-ai-${Date.now()}.png`}
                    className="p-4 bg-white rounded-full text-gray-900 hover:scale-110 transition-transform shadow-xl hover:bg-primary-50"
                    title="Download"
                  >
                    <Download size={28} />
                  </a>
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors shadow-xl border border-white/20 hover:scale-110"
                    title="View Full Size"
                  >
                    <Maximize2 size={28} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-600 space-y-4 px-6">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-vibrant-blue/30 border-t-vibrant-blue rounded-full animate-spin"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-vibrant-yellow" size={24}/>
                    </div>
                    <p className="animate-pulse font-medium text-gray-500 dark:text-gray-400">Creating magic...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800/50 rounded-full mx-auto flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                      <ImageIcon size={48} className="opacity-30" />
                    </div>
                    <p className="font-medium">Your dope art will appear here.</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Options Grid */}
          {generatedImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4 animate-fade-in-up">
              {generatedImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${
                    selectedImageIndex === idx
                      ? 'border-vibrant-blue ring-4 ring-vibrant-blue/20 scale-105 z-10'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Variant ${idx + 1}`} className="w-full h-full object-cover" />
                  {selectedImageIndex === idx && (
                     <div className="absolute inset-0 bg-vibrant-blue/10" />
                  )}
                </button>
              ))}
            </div>
          )}
          
          {generatedImages.length > 0 && (
             <div className="flex justify-center pt-2">
               <button 
                onClick={(e) => handleGenerate(e)}
                disabled={loading}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-vibrant-blue dark:hover:text-vibrant-blue transition-colors font-medium"
               >
                 <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                 Re-roll Images
               </button>
             </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isPreviewOpen && currentImage && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
            onClick={() => setIsPreviewOpen(false)}
        >
            <button 
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-6 right-6 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
                <X size={32} />
            </button>
            
            <img 
                src={currentImage} 
                alt="Full Preview" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
            />
            
            <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                 <a
                    href={currentImage}
                    download={`dope-ai-full-${Date.now()}.png`}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Download size={20} /> Download Original
                </a>
            </div>
        </div>
      )}

    </div>
  );
};

const ImageIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);