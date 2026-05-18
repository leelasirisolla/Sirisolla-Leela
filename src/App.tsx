import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Animated synthwave grid background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent z-0"></div>
        <div 
          className="absolute left-0 right-0 bottom-1/4 h-[1px] bg-cyan-500/20 shadow-[0_0_20px_theme(colors.cyan.400)] z-0 mix-blend-screen"
        ></div>
         <div 
          className="absolute left-1/2 bottom-0 w-px h-1/4 bg-pink-500/20 shadow-[0_0_20px_theme(colors.pink.400)] z-0 mix-blend-screen transform -translate-x-1/2"
        ></div>
      </div>

      {/* Main UI Container */}
      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-8">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center text-center gap-2 mb-4">
          <div className="flex items-center gap-4 text-pink-500 drop-shadow-[0_0_15px_theme(colors.pink.500)]">
            <Terminal size={36} />
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
              Cyber Snake // Audio
            </h1>
            <Terminal size={36} className="transform rotate-180" />
          </div>
          <p className="text-cyan-400/80 tracking-[0.3em] uppercase text-sm drop-shadow-[0_0_5px_theme(colors.cyan.400)]">
            Interactive Synthwave Experience
          </p>
        </header>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center w-full gap-8">
          {/* Game Section */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <SnakeGame />
          </div>
          
          {/* Music Section */}
          <div className="w-full lg:w-80 flex-shrink-0 flex self-stretch justify-center lg:justify-start lg:min-h-full">
            <div className="w-full max-w-md h-full"> 
               <MusicPlayer />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
