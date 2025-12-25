import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Video, AlertCircle } from 'lucide-react';

// The exact prompt provided by the user
const VEO_PROMPT = "A sophisticated homepage UI hero section animation concept. A pristine, minimalist white matte ceramic jar slowly and smoothly glides from off-screen left into the dead center of the frame. As it centers, lush green moss begins to organically grow and erode the jar starting from its right side. The moss texture spreads gradually across the surface, eventually completely enveloping the object into a rich, textured green moss jar. Cinematic lighting, macro nature photography style background with soft bokeh, ample negative space for UI text elements, 4k resolution, high-end product design.";

export const VeoJarHero: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load cached video from local storage on mount
  useEffect(() => {
    // Note: In a real production app, we wouldn't store large blobs in localStorage/IndexedDB this simply,
    // but for this demo, we check if we have a valid object URL or similar state.
    // Since ObjectURLs expire on reload, we'll need to regenerate or fetch again.
    // For this implementation, we will require regeneration on refresh to keep it simple,
    // unless we persist the blob in IndexedDB. 
    // To be user friendly, we will just show the generate button if no video is active.
  }, []);

  const generateVideo = async () => {
    setError(null);
    setLoading(true);
    setStatus('Checking API Key...');

    try {
      // 1. Check/Get API Key
      if (!window.aistudio) {
        throw new Error("AI Studio environment not detected.");
      }
      
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }

      // 2. Initialize Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatus('Initializing generation (this takes ~1 min)...');

      // 3. Start Generation
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: VEO_PROMPT,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9' // Landscape to fit screen
        }
      });

      // 4. Poll for completion
      while (!operation.done) {
        setStatus('Rendering video frames...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) {
        throw new Error("No video URI returned from model.");
      }

      setStatus('Downloading video asset...');

      // 5. Download the video content
      const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
      if (!response.ok) throw new Error("Failed to download video bytes.");
      
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      
      setVideoUrl(localUrl);
      setLoading(false);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Video generation failed");
      setLoading(false);
    }
  };

  if (videoUrl) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-white">
        {/* The Generated Video */}
        <video 
          src={videoUrl}
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-90"
        />
        
        {/* Overlay to ensure text readability & simulate "transparency" blending */}
        {/* A white gradient from left to right allows text on left to pop, while video shows on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay pointer-events-none" />
        
        {/* Option to clear/regenerate */}
        <button 
          onClick={() => setVideoUrl(null)}
          className="absolute bottom-4 right-4 z-50 p-2 bg-white/50 backdrop-blur rounded-full text-stone-500 hover:text-red-500 text-xs"
          title="Remove Video"
        >
          <AlertCircle size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-stone-50 overflow-hidden">
        {/* Fallback Static Background while waiting */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-200 via-transparent to-transparent" />
        </div>

        {/* Generate Button / Loading State */}
        <div className="relative z-10 text-center">
            {loading ? (
                <div className="flex flex-col items-center gap-4 p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-stone-100 shadow-xl">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                    <div className="text-stone-600 font-medium animate-pulse">{status}</div>
                    <div className="text-xs text-stone-400 max-w-[200px]">
                        Generative AI is dreaming up your moss jar...
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-8 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-stone-300 max-w-md mx-4">
                      <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                          Click below to use <strong>Google Veo</strong> to generate the "Living Moss Jar" background based on your cinematic prompt.
                      </p>
                      <button 
                          onClick={generateVideo}
                          className="flex items-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200 mx-auto"
                      >
                          <Video size={18} />
                          <span>Generate Living Background</span>
                      </button>
                      {error && (
                          <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2">
                              <AlertCircle size={14} />
                              {error}
                          </div>
                      )}
                  </div>
                </div>
            )}
        </div>
    </div>
  );
};