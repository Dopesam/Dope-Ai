import React, { useState, useRef } from 'react';
import { AspectRatio, ImageSize, SocialPreset } from '../types';
import { generateImageOptions } from '../services/geminiService';
import { Youtube, Instagram, Music2, Linkedin, Sparkles, Loader2, Download, Wand2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { enhancePrompt } from '../services/geminiService';
import { triggerPixieDust } from '../utils/animationUtils';

const presets: SocialPreset[] = [
  { name: 'YouTube Thumbnail', icon: 'youtube', ratio: AspectRatio.WIDE, description: '16:9 • High Impact' },
  { name: 'Instagram Post', icon: 'instagram', ratio: AspectRatio.SQUARE, description: '1:1 • Square Feed' },
  { name: 'TikTok / Story', icon: 'tiktok', ratio: AspectRatio.TALL, description: '9:16 • Full Screen' },
  { name: 'LinkedIn / Post', icon: 'linkedin', ratio: AspectRatio.LANDSCAPE, description: '4:3 • Professional' },
];

export const ThumbnailCreator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<SocialPreset>(presets[0]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEnhance = async () => {
     if (!prompt.trim()) return;
     setEnhancing(true);
     try {
        const refined = await enhancePrompt(prompt);
        setPrompt(refined);
     } catch (e) {
        console.error(e);
     } finally {
        setEnhancing(false);
     }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large. Please upload an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async (e: React.MouseEvent) => {
    if (!prompt.trim() && !uploadedImage) return;
    
    // Magical Pixie Dust Effect
    triggerPixieDust(e.clientX, e.clientY);

    setLoading(true);
    try {
      let fullPrompt = `High quality social media thumbnail for ${selectedPreset.name}. ${prompt}. Make it engaging, high contrast, catchy.`;
      if (uploadedImage) {
        fullPrompt = `Edit this image to create a ${selectedPreset.name} thumbnail. ${prompt}. Keep the main subject but enhance the style for social media.`;
      }
      
      const images = await generateImageOptions(fullPrompt, selectedPreset.ratio, ImageSize.MID, uploadedImage);
      if (images.length > 0) {
        setResultUrl(images[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'youtube': return <Youtube className="text-red-600 dark:text-red-500" />;
      case 'instagram': return <Instagram className="text-pink-600 dark:text-pink-500" />;
      case 'tiktok': return <Music2 className="text-cyan-600 dark:text-cyan-400" />;
      case 'linkedin': return <Linkedin className="text-blue-600 dark:text-blue-500" />;
      default: return <Sparkles />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Thumbnails</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Viral-ready assets for every platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Presets */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-3">
          <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Select Platform</label>
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setSelectedPreset(preset)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group ${
                selectedPreset.name === preset.name
                  ? 'bg-white dark:bg-gray-800 border-vibrant-blue ring-2 ring-vibrant-blue shadow-lg scale-105 z-10'
                  : 'bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              <div className={`p-3 rounded-xl transition-colors ${selectedPreset.name === preset.name ? 'bg-vibrant-blue/10 dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-950'}`}>
                {renderIcon(preset.icon)}
              </div>
              <div>
                <h3 className={`font-bold transition-colors ${selectedPreset.name === preset.name ? 'text-vibrant-blue' : 'text-gray-800 dark:text-gray-200'}`}>{preset.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{preset.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Main Generator Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 flex flex-col h-full shadow-2xl shadow-gray-200/50 dark:shadow-none transition-all duration-300 overflow-hidden">
             <div className="p-6 space-y-6 border-b border-gray-100 dark:border-gray-700">
                <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={uploadedImage ? `Describe how to edit your image for ${selectedPreset.name}...` : `Describe your ${selectedPreset.name}...`}
                      className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none text-xl leading-relaxed h-28 font-medium"
                    />
                    <button 
                      onClick={handleEnhance}
                      disabled={enhancing || !prompt}
                      className="absolute bottom-0 right-0 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full flex items-center gap-2 transition-colors font-semibold"
                      title="Auto-enhance prompt"
                    >
                       {enhancing ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12}/>}
                       Enhance
                    </button>
                </div>
                
                {/* Image Upload Preview */}
                {uploadedImage && (
                  <div className="relative inline-block group animate-fade-in-up">
                    <img src={uploadedImage} alt="Upload" className="h-24 w-auto rounded-xl border-2 border-vibrant-blue shadow-md object-cover" />
                    <button 
                      onClick={clearUploadedImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors transform hover:scale-110"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-xs text-white font-bold">Reference</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 justify-between items-center pt-2">
                   <div className="flex items-center gap-3">
                     <span className="text-xs font-bold text-vibrant-blue bg-vibrant-blue/10 px-3 py-1.5 rounded-lg border border-vibrant-blue/20">
                       {selectedPreset.ratio}
                     </span>
                     
                     <input 
                       type="file" 
                       accept="image/*" 
                       ref={fileInputRef}
                       onChange={handleImageUpload}
                       className="hidden"
                     />
                     <button
                       onClick={() => fileInputRef.current?.click()}
                       className="text-xs font-semibold bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full flex items-center gap-2 transition-colors border border-gray-200 dark:border-gray-600 shadow-sm"
                     >
                       <Upload size={14} />
                       {uploadedImage ? 'Change Image' : 'Upload Reference'}
                     </button>
                   </div>

                   <button
                    onClick={handleGenerate}
                    disabled={loading || (!prompt && !uploadedImage)}
                    className="px-8 py-3 bg-gradient-to-r from-vibrant-green via-vibrant-blue to-vibrant-yellow hover:from-vibrant-green/80 hover:to-vibrant-yellow/80 text-gray-900 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-vibrant-blue/20 transform hover:-translate-y-0.5"
                   >
                     {loading ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                     Generate Thumbnail
                   </button>
                </div>
             </div>

             <div className="flex-1 min-h-[400px] p-8 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 relative">
                {resultUrl ? (
                   <div className="relative group w-full h-full flex items-center justify-center animate-fade-in-up">
                      <img 
                        src={resultUrl} 
                        alt="Generated Thumbnail" 
                        className="max-h-[500px] w-auto max-w-full rounded-xl shadow-2xl object-contain"
                      />
                       <a
                        href={resultUrl}
                        download={`dope-thumbnail-${selectedPreset.name}.png`}
                        className="absolute bottom-6 right-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 font-bold"
                      >
                        <Download size={20} /> Download
                      </a>
                   </div>
                ) : (
                  <div className="text-center text-gray-400 dark:text-gray-600 flex flex-col items-center">
                    <div className="inline-block p-6 rounded-full bg-white dark:bg-gray-800 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                      {uploadedImage ? <ImageIcon className="text-vibrant-blue" size={32} /> : React.cloneElement(renderIcon(selectedPreset.icon) as React.ReactElement<any>, { size: 32 })}
                    </div>
                    <p className="text-lg font-medium">
                      {uploadedImage 
                        ? 'Ready to remix your image' 
                        : `Create a dope ${selectedPreset.name}`
                      }
                    </p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};