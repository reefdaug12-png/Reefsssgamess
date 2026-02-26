import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Search, 
  Grid3X3, 
  Trophy, 
  Zap, 
  Puzzle, 
  X, 
  ChevronRight,
  Monitor,
  Smartphone,
  Cpu,
  Circle,
  TrendingUp
} from 'lucide-react';
import { SnakeGame } from './components/SnakeGame';
import { Game2048 } from './components/Game2048';
import { ClickerGame } from './components/ClickerGame';
import gamesData from './data/games.json';

const ICON_MAP = {
  Zap: <Zap />,
  Puzzle: <Puzzle />,
  Cpu: <Cpu />,
  Grid3X3: <Grid3X3 />,
  Circle: <Circle />,
  TrendingUp: <TrendingUp />
};

const INTERNAL_COMPONENTS = {
  snake: <SnakeGame />,
  '2048': <Game2048 />,
  clicker: <ClickerGame />
};

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const renderGameContent = (game) => {
    if (game.type === 'internal') {
      return INTERNAL_COMPONENTS[game.id] || <div className="text-zinc-500">Game Component Not Found</div>;
    }
    return (
      <iframe 
        src={game.iframeUrl} 
        className="w-full h-full border-0 rounded-xl bg-white"
        title={game.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Gamepad2 className="text-black" size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Nexus Games</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-zinc-400">
            <a href="#" className="hover:text-emerald-400 transition-colors text-emerald-400">Home</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Popular</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">New</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Categories</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 w-64 transition-all"
              />
            </div>
            <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <Grid3X3 size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16 relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-12">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Zap size={12} /> New Release Available
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
              UNLEASH THE <span className="text-emerald-500">ARCADE</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Experience high-performance, unblocked browser games. No downloads, no lag, just pure gaming excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setSelectedGame(filteredGames[0])}
                className="px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center gap-2"
              >
                Play Now <ChevronRight size={20} />
              </button>
              <button className="px-8 py-4 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700">
                Browse All
              </button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/20 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
          </div>
        </section>

        {/* Categories */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeCategory === cat 
                  ? 'bg-emerald-500 border-emerald-500 text-black' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedGame(game)}
                className={`group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden transition-all hover:border-emerald-500/50 relative`}
              >
                <div className={`h-48 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="relative z-10 p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10"
                  >
                    {React.cloneElement((ICON_MAP[game.icon] || <Zap />), { size: 48, className: 'text-white' })}
                  </motion.div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter">{game.title}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                      {game.category}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Monitor size={14} className="text-zinc-600" />
                      <Smartphone size={14} className="text-zinc-600" />
                    </div>
                    <span className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Play Now <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-24 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
            <Search className="mx-auto text-zinc-700 mb-4" size={48} />
            <h3 className="text-xl font-bold text-zinc-500">No games found matching your search</h3>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-zinc-950 rounded-3xl border border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[90vh]"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    {React.cloneElement((ICON_MAP[selectedGame.icon] || <Zap />), { size: 20, className: 'text-emerald-400' })}
                  </div>
                  <h2 className="font-black uppercase tracking-tighter">{selectedGame.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden p-4 md:p-8 flex items-center justify-center bg-[#050505]">
                <div className="w-full h-full flex items-center justify-center">
                  {renderGameContent(selectedGame)}
                </div>
              </div>

              <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between text-xs font-mono text-zinc-500 uppercase tracking-widest">
                <div className="flex gap-6">
                  <span className="flex items-center gap-2"><Trophy size={14} className="text-yellow-500" /> High Score: 0</span>
                  <span className="flex items-center gap-2"><Zap size={14} className="text-emerald-500" /> 60 FPS Stable</span>
                </div>
                <div className="hidden sm:block">
                  Nexus Engine v1.0.5
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Gamepad2 className="text-black" size={18} />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">Nexus Games</span>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm mb-6 leading-relaxed">
              The ultimate destination for unblocked browser games. Built for performance, designed for gamers.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Zap size={18} className="text-zinc-400" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Trophy size={18} className="text-zinc-400" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-zinc-500 font-bold">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Browse Games</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Leaderboards</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Developer API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-zinc-500 font-bold">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-12 border-t border-zinc-800/50 text-center text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
          © 2026 Nexus Games Global • All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
