import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'AI Horizon Pulse', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Synthetic Grid Overdrive', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Neon Cyberspace Loop', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setProgress(duration ? (currentTime / duration) * 100 : 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="bg-slate-900 border border-purple-500/30 p-6 rounded-xl shadow-[0_0_25px_theme(colors.purple.500/20)] flex flex-col items-center justify-between h-full relative overflow-hidden backdrop-blur-md">
      {/* Decorative neon gradient header */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_10px_theme(colors.purple.400)]" />

      {/* Title / Info */}
      <div className="flex flex-col items-center gap-2 mb-6 w-full mt-2">
        <div className={`text-cyan-400 mb-2 transition-transform duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
          <Disc3 size={48} className="drop-shadow-[0_0_10px_theme(colors.cyan.400)]" />
        </div>
        <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400">Now Playing</h2>
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-center drop-shadow-[0_0_8px_theme(colors.pink.500/50)]">
          {currentTrack.title}
        </h3>
      </div>

      {/* Fake UI Visualizer using standard layout */}
      <div className="w-full flex items-end justify-center gap-1 h-12 mb-6">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="w-2 bg-purple-500 rounded-t-sm shadow-[0_0_5px_theme(colors.purple.500)] transition-all duration-100 ease-linear"
            style={{ 
              height: isPlaying ? `${15 + Math.random() * 85}%` : '15%',
              opacity: isPlaying ? 0.8 + Math.random() * 0.2 : 0.3
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-pink-500 shadow-[0_0_10px_theme(colors.pink.500)] transition-all duration-300 relative"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button 
          onClick={prevTrack} 
          className="text-slate-400 hover:text-cyan-400 transition-colors drop-shadow-[0_0_5px_currentColor]"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay} 
          className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-full shadow-[0_0_15px_theme(colors.purple.600)] transition-all transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        
        <button 
          onClick={nextTrack} 
          className="text-slate-400 hover:text-cyan-400 transition-colors drop-shadow-[0_0_5px_currentColor]"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center w-full gap-3 px-4">
        <button onClick={toggleMute} className="text-slate-400 hover:text-cyan-400 transition-colors">
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-cyan-400 outline-none h-1 bg-slate-800 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_theme(colors.cyan.400)]"
        />
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
