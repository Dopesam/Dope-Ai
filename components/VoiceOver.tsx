import React, { useState, useRef, useEffect } from 'react';
import { VoiceName } from '../types';
import { generateSpeech } from '../services/geminiService';
import { 
  Play, Pause, Download, Volume2, User, Sparkles, Loader2, Square, 
  Baby, CheckCircle2, Briefcase, Smartphone, BookOpen, Ghost, Mic, Upload, X, FileAudio, ArrowRight
} from 'lucide-react';
import { triggerPixieDust } from '../utils/animationUtils';

interface VoiceOption {
  id: string;
  apiVoice: VoiceName;
  label: string;
  desc: string;
  category: string;
  gender: 'Male' | 'Female';
  instruction?: string;
}

// Expanded voice list mapping characters to API voices + Style Prompts
const voiceOptions: VoiceOption[] = [
  // --- Social Media & Content Creation ---
  { 
    id: 'social_hype', apiVoice: VoiceName.Puck, label: 'Kyle', desc: 'Hype YouTuber', 
    category: 'Social', gender: 'Male', instruction: 'Speak with high energy, fast pace, and excitement like a famous YouTuber intro' 
  },
  { 
    id: 'social_vlog', apiVoice: VoiceName.Zephyr, label: 'Chloe', desc: 'Lifestyle Vlog', 
    category: 'Social', gender: 'Female', instruction: 'Speak with a trendy, casual, and friendly influencer voice' 
  },
  { 
    id: 'social_asmr', apiVoice: VoiceName.Kore, label: 'Luna', desc: 'ASMR Whisper', 
    category: 'Social', gender: 'Female', instruction: 'Speak in a very soft, whispering, slow, and tingling ASMR style voice' 
  },
  { 
    id: 'social_podcast', apiVoice: VoiceName.Fenrir, label: 'Marcus', desc: 'Podcast Host', 
    category: 'Social', gender: 'Male', instruction: 'Speak with a conversational, inquisitive, and engaging podcast host voice' 
  },

  // --- Professional & Business ---
  { 
    id: 'pro_news_f', apiVoice: VoiceName.Kore, label: 'Elena', desc: 'News Anchor', 
    category: 'Professional', gender: 'Female', instruction: 'Speak with a formal, articulate, and authoritative news anchor voice' 
  },
  { 
    id: 'pro_news_m', apiVoice: VoiceName.Charon, label: 'James', desc: 'News Anchor', 
    category: 'Professional', gender: 'Male', instruction: 'Speak with a serious, deep, and trustworthy news anchor voice' 
  },
  { 
    id: 'pro_corp', apiVoice: VoiceName.Zephyr, label: 'Sophia', desc: 'Corporate Presenter', 
    category: 'Professional', gender: 'Female', instruction: 'Speak with a clear, professional, and confident corporate presentation voice' 
  },
  { 
    id: 'pro_sales', apiVoice: VoiceName.Puck, label: 'David', desc: 'Sales & Promo', 
    category: 'Professional', gender: 'Male', instruction: 'Speak with a persuasive, punchy, and upbeat commercial voice' 
  },

  // --- Narrative & Storytelling ---
  { 
    id: 'nar_fern', apiVoice: VoiceName.Charon, label: 'Fern', desc: 'Video Essayist', 
    category: 'Narrative', gender: 'Male', instruction: 'Speak with a calm, intellectual, deep, and well-paced video essay narration voice' 
  },
  { 
    id: 'nar_epic', apiVoice: VoiceName.Charon, label: 'The Voice', desc: 'Movie Trailer', 
    category: 'Narrative', gender: 'Male', instruction: 'Speak with an extremely deep, gravelly, epic movie trailer voice' 
  },
  { 
    id: 'nar_docu', apiVoice: VoiceName.Fenrir, label: 'Attenborough-ish', desc: 'Nature Documentary', 
    category: 'Narrative', gender: 'Male', instruction: 'Speak with a breathy, observant, and wondrous nature documentary narrator voice' 
  },
  { 
    id: 'nar_fantasy', apiVoice: VoiceName.Zephyr, label: 'Elara', desc: 'Fantasy Narrator', 
    category: 'Narrative', gender: 'Female', instruction: 'Speak with a mystical, ethereal, and storytelling fantasy voice' 
  },
  { 
    id: 'nar_audiobook', apiVoice: VoiceName.Charon, label: 'Sebastian', desc: 'Classic Audiobook', 
    category: 'Narrative', gender: 'Male', instruction: 'Speak with a soothing, well-paced, and warm audiobook narrator voice' 
  },

  // --- Children ---
  { 
    id: 'boy_child', apiVoice: VoiceName.Puck, label: 'Leo', desc: 'Little Boy (8y)', 
    category: 'Child', gender: 'Male', instruction: 'Speak with a high-pitched, enthusiastic voice like a young boy' 
  },
  { 
    id: 'girl_child', apiVoice: VoiceName.Zephyr, label: 'Mia', desc: 'Little Girl (6y)', 
    category: 'Child', gender: 'Female', instruction: 'Speak with a sweet, high-pitched voice like a little girl' 
  },

  // --- Teenagers ---
  { 
    id: 'teen_boy', apiVoice: VoiceName.Puck, label: 'Jax', desc: 'Teenager (16y)', 
    category: 'Teen', gender: 'Male', instruction: 'Speak with a cool, casual, slightly cracking voice like a teenage boy' 
  },
  { 
    id: 'teen_girl', apiVoice: VoiceName.Kore, label: 'Zoe', desc: 'Teenager (17y)', 
    category: 'Teen', gender: 'Female', instruction: 'Speak with a bright, energetic, fast-paced voice like a teenage girl' 
  },

  // --- Standard Adults ---
  { 
    id: 'adult_man_energetic', apiVoice: VoiceName.Puck, label: 'Puck', desc: 'Friendly Male', 
    category: 'Adult', gender: 'Male', instruction: 'Speak with an energetic, standard adult male voice' 
  },
  { 
    id: 'adult_woman_soft', apiVoice: VoiceName.Zephyr, label: 'Zephyr', desc: 'Gentle Female', 
    category: 'Adult', gender: 'Female', instruction: 'Speak with a soft, gentle adult female voice' 
  },
  { 
    id: 'adult_man_intense', apiVoice: VoiceName.Fenrir, label: 'Fenrir', desc: 'Confident Male', 
    category: 'Adult', gender: 'Male', instruction: 'Speak with an intense, strong adult male voice' 
  },
  { 
    id: 'adult_woman_calm', apiVoice: VoiceName.Kore, label: 'Kore', desc: 'Calm Female', 
    category: 'Adult', gender: 'Female', instruction: 'Speak with a calm, motherly adult female voice' 
  },
  
  // --- Character & Creative ---
  { 
    id: 'char_villain', apiVoice: VoiceName.Fenrir, label: 'Vaderis', desc: 'The Villain', 
    category: 'Character', gender: 'Male', instruction: 'Speak with a sinister, slow, and menacing villain voice' 
  },
  { 
    id: 'char_robot', apiVoice: VoiceName.Puck, label: 'Unit-734', desc: 'Robot / AI', 
    category: 'Character', gender: 'Male', instruction: 'Speak with a flat, monotone, staccato robotic voice' 
  },
  { 
    id: 'char_meditation', apiVoice: VoiceName.Kore, label: 'Serenity', desc: 'Meditation Guide', 
    category: 'Character', gender: 'Female', instruction: 'Speak with a very slow, breathing, and hypnotic meditation guide voice' 
  },

  // --- Elderly ---
  { 
    id: 'old_man', apiVoice: VoiceName.Charon, label: 'Arthur', desc: 'Elderly Man (80y)', 
    category: 'Elder', gender: 'Male', instruction: 'Speak with a raspy, slow, aged voice like an 80 year old man' 
  },
  { 
    id: 'old_woman', apiVoice: VoiceName.Kore, label: 'Martha', desc: 'Elderly Woman (75y)', 
    category: 'Elder', gender: 'Female', instruction: 'Speak with a shaky, wise, grandmotherly voice' 
  },
  { 
    id: 'wizard', apiVoice: VoiceName.Fenrir, label: 'The Ancient', desc: 'Wizard / Mystic', 
    category: 'Elder', gender: 'Male', instruction: 'Speak with a creaky, ancient, mystical voice like a 100 year old wizard' 
  },
];

export const VoiceOver: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(voiceOptions.find(v => v.id === 'social_hype') || voiceOptions[0]); 
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Preview State
  const [previewLoading, setPreviewLoading] = useState<string | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Audio too large. Please upload under 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedAudio(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedAudio = () => {
    setUploadedAudio(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async (e: React.MouseEvent) => {
    if (!text.trim()) return;
    
    // Magical Pixie Dust Effect
    triggerPixieDust(e.clientX, e.clientY);

    setLoading(true);
    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    try {
      const url = await generateSpeech(
        text, 
        selectedVoice.apiVoice, 
        selectedVoice.instruction,
        uploadedAudio
      );
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (e: React.MouseEvent, voice: VoiceOption) => {
    e.stopPropagation(); 

    if (previewPlaying === voice.id) {
        previewAudioRef.current?.pause();
        setPreviewPlaying(null);
        return;
    }

    if (previewAudioRef.current) {
        previewAudioRef.current.pause();
    }

    setPreviewLoading(voice.id);
    setPreviewPlaying(null);

    try {
        const previewText = `Hello, I am ${voice.label}.`;
        const url = await generateSpeech(previewText, voice.apiVoice, voice.instruction, null);
        
        const audio = new Audio(url);
        previewAudioRef.current = audio;
        
        audio.onended = () => {
            setPreviewPlaying(null);
        };
        
        audio.play();
        setPreviewPlaying(voice.id);
    } catch (err) {
        console.error("Preview failed", err);
    } finally {
        setPreviewLoading(null);
    }
  };

  const handleUseVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    textareaRef.current?.focus();
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  useEffect(() => {
    return () => {
        if (previewAudioRef.current) {
            previewAudioRef.current.pause();
        }
    };
  }, []);

  // Updated Category Rendering
  const categories = ['Social', 'Professional', 'Narrative', 'Character', 'Child', 'Teen', 'Adult', 'Elder'];
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Child': return <Baby size={16} className="text-gray-600 dark:text-gray-300"/>;
      case 'Teen': return <User size={16} className="text-gray-600 dark:text-gray-300"/>;
      case 'Professional': return <Briefcase size={16} className="text-gray-600 dark:text-gray-300"/>;
      case 'Social': return <Smartphone size={16} className="text-gray-600 dark:text-gray-300"/>;
      case 'Narrative': return <BookOpen size={16} className="text-gray-600 dark:text-gray-300"/>;
      case 'Character': return <Ghost size={16} className="text-gray-600 dark:text-gray-300"/>;
      case 'Elder': return <User size={16} className="text-gray-600 dark:text-gray-300"/>;
      case 'Adult': return <User size={16} className="text-gray-600 dark:text-gray-300"/>;
      default: return <Mic size={16} className="text-gray-600 dark:text-gray-300"/>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Voice Studio</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Bring your scripts to life with AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Voice Selection List */}
        <div className="lg:col-span-1 space-y-6 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {categories.map((cat) => (
            <div key={cat} className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50/95 dark:bg-gray-950/90 backdrop-blur py-2 z-10 flex items-center gap-2">
                {getCategoryIcon(cat)} {cat} Voices
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {voiceOptions.filter(v => v.category === cat).map((voice) => (
                  <div
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3 cursor-pointer group relative overflow-hidden ${
                      selectedVoice.id === voice.id
                        ? 'bg-white dark:bg-gray-800 border-vibrant-blue ring-2 ring-vibrant-blue shadow-md transform scale-[1.02]'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className={`p-2.5 rounded-full shrink-0 transition-colors ${
                        selectedVoice.id === voice.id ? 'bg-vibrant-blue text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}>
                       {getCategoryIcon(voice.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm truncate ${selectedVoice.id === voice.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{voice.label}</span>
                        {selectedVoice.id === voice.id && <CheckCircle2 size={12} className="text-vibrant-green"/>}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">{voice.desc}</div>
                    </div>
                    
                    {selectedVoice.id === voice.id && (
                        <button
                            onClick={handleUseVoice}
                            className="px-3 py-1.5 bg-vibrant-blue hover:bg-vibrant-blue/80 text-gray-900 text-xs font-bold rounded-lg shadow-lg shadow-vibrant-blue/20 transition-all animate-in fade-in zoom-in duration-200 whitespace-nowrap z-20 flex items-center gap-1"
                        >
                            Use Voice
                        </button>
                    )}

                    <button
                        onClick={(e) => handlePreview(e, voice)}
                        disabled={previewLoading === voice.id}
                        className={`p-2 rounded-full transition-all shrink-0 z-20 ${
                            previewPlaying === voice.id 
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        title="Preview Voice"
                    >
                        {previewLoading === voice.id ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : previewPlaying === voice.id ? (
                            <Square size={14} fill="currentColor" />
                        ) : (
                            <Play size={14} fill="currentColor" />
                        )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Input & Output Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl shadow-gray-200/50 dark:shadow-none space-y-6 flex flex-col h-full min-h-[400px] transition-all duration-300">
             <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                    Script 
                    <span className="text-vibrant-blue dark:text-vibrant-blue font-semibold px-2 py-0.5 bg-vibrant-blue/10 dark:bg-vibrant-blue/20 rounded-md text-xs border border-vibrant-blue/30 dark:border-vibrant-blue/40 normal-case tracking-normal">
                        {selectedVoice.category} • {selectedVoice.label}
                    </span>
                </label>
             </div>
             
             <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Enter text for ${selectedVoice.label} to speak...`}
              className="w-full flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-vibrant-blue outline-none resize-none text-xl leading-relaxed font-medium transition-colors"
             />

             {/* Audio Reference Upload */}
             <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                {uploadedAudio ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium shadow-sm">
                        <FileAudio size={14} className="text-vibrant-blue" />
                        <span className="truncate max-w-[200px]">Reference Audio</span>
                        <button onClick={clearUploadedAudio} className="text-gray-400 hover:text-red-500 ml-2 transition-colors"><X size={14}/></button>
                    </div>
                ) : null}
                
                <input 
                    type="file" 
                    accept="audio/*" 
                    ref={fileInputRef}
                    onChange={handleAudioUpload}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-all font-semibold ${
                        uploadedAudio 
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300' 
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm'
                    }`}
                >
                    <Upload size={14} />
                    {uploadedAudio ? 'Change Sample' : 'Upload Reference Voice (Optional)'}
                </button>
             </div>
             
             <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700/50">
               <button
                  onClick={handleGenerate}
                  disabled={loading || !text}
                  className="px-10 py-4 bg-gradient-to-r from-vibrant-green via-vibrant-blue to-vibrant-yellow hover:from-vibrant-green/80 hover:to-vibrant-yellow/80 text-gray-900 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 shadow-xl shadow-vibrant-blue/20"
               >
                 {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="animate-pulse" />}
                 Generate Voice Over
               </button>
             </div>
          </div>

          {/* Player Result */}
          {audioUrl && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 flex items-center gap-6 animate-fade-in-up shadow-2xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-vibrant-green/20 via-vibrant-blue/20 to-vibrant-yellow/20 pointer-events-none"></div>
               
               <button 
                 onClick={togglePlay}
                 className="w-16 h-16 bg-gradient-to-br from-vibrant-green to-vibrant-blue rounded-full flex items-center justify-center text-gray-900 shadow-xl shadow-vibrant-blue/30 transition-all hover:scale-110 z-10"
               >
                 {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" className="ml-1" size={24} />}
               </button>
               
               <div className="flex-1 space-y-3 z-10">
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                           {React.cloneElement(getCategoryIcon(selectedVoice.category) as React.ReactElement<any>, { className: "text-vibrant-blue dark:text-vibrant-blue" })}
                        </div>
                        <div>
                            <span className="text-gray-900 dark:text-white font-bold block text-lg">{selectedVoice.label}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{selectedVoice.desc}</span>
                        </div>
                   </div>
                 </div>
                 {/* Visualizer Bar Stub */}
                 <div className="h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-vibrant-green via-vibrant-blue to-vibrant-yellow rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse w-3/4' : 'w-full'}`}></div>
                 </div>
               </div>

               <a 
                 href={audioUrl} 
                 download={`dope-voiceover-${selectedVoice.label.toLowerCase()}.wav`}
                 className="p-4 text-gray-400 hover:text-vibrant-blue dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-2xl transition-colors z-10"
                 title="Download Audio"
               >
                 <Download size={24} />
               </a>
               <audio ref={audioRef} src={audioUrl} className="hidden" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};