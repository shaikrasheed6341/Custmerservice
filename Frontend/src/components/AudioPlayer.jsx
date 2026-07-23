import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { Play, Pause, Volume2, VolumeX, X, SkipForward, SkipBack } from "lucide-react";

export default function AudioPlayer() {
  const { playingAudio, setPlayingAudio } = useContext(AppContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (playingAudio) {
      setIsPlaying(true);
      setProgress(0);
    } else {
      setIsPlaying(false);
    }
  }, [playingAudio]);

  useEffect(() => {
    if (isPlaying && playingAudio) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return 100;
          }
          return prev + 1; // Increment progress
        });
      }, 300);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playingAudio]);

  if (!playingAudio) return null;

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleProgressChange = (e) => {
    setProgress(parseInt(e.target.value));
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
    if (isMuted) setIsMuted(false);
  };

  // Simulated visual waveform nodes
  const waveNodes = [8, 14, 28, 16, 22, 10, 18, 26, 32, 14, 20, 8, 12, 28, 22, 14, 6, 12, 18, 30, 24, 16, 8, 14, 20, 26, 12, 8, 16, 10];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 z-50 animate-in slide-in-from-bottom duration-300">
      
      {/* Recording Info */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center animate-pulse">
          <Volume2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Now Playing</h4>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            Call Recording: {playingAudio.customer}
          </p>
          <span className="text-[10px] text-slate-400">Agent: {playingAudio.agent} • Duration: {playingAudio.duration}</span>
        </div>
      </div>

      {/* Center Controls & Waveform */}
      <div className="flex-1 flex flex-col items-center gap-1.5 w-full">
        {/* Waveform visualizer */}
        <div className="flex items-end justify-center gap-0.5 h-8 w-full overflow-hidden px-4">
          {waveNodes.map((h, i) => {
            // Apply scale multiplier when audio is playing, else flatten slightly
            const currentHeight = isPlaying 
              ? Math.max(4, h * (0.3 + Math.sin((progress + i) * 0.15) * 0.7)) 
              : 4;
            return (
              <div 
                key={i} 
                className="w-1 rounded-t-full bg-indigo-500/80 dark:bg-indigo-400/80 transition-all duration-150"
                style={{ height: `${currentHeight}px` }}
              />
            );
          })}
        </div>

        {/* Playback Controls & Slider */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">0:00</span>
          
          <div className="flex-1 relative flex items-center">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
            />
          </div>

          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{playingAudio.duration}</span>
        </div>
      </div>

      {/* Right Controls & Close */}
      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-900">
        {/* Playback actions */}
        <div className="flex items-center gap-3">
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
          <button 
            onClick={toggleMute}
            className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
          />
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setPlayingAudio(null)}
          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
