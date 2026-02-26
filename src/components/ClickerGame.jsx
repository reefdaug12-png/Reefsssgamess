import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer2, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

export const ClickerGame = () => {
  const [clicks, setClicks] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClicks, setAutoClicks] = useState(0);
  const [upgrades, setUpgrades] = useState([
    { id: 1, name: 'Better Mouse', cost: 10, power: 1, type: 'click', count: 0 },
    { id: 2, name: 'Auto Clicker', cost: 50, power: 1, type: 'auto', count: 0 },
    { id: 3, name: 'Super Processor', cost: 250, power: 5, type: 'auto', count: 0 },
    { id: 4, name: 'Quantum Mouse', cost: 1000, power: 25, type: 'click', count: 0 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (autoClicks > 0) {
        setClicks(c => c + autoClicks);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoClicks]);

  const handleClick = () => {
    setClicks(c => c + clickPower);
  };

  const buyUpgrade = (id) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (upgrade && clicks >= upgrade.cost) {
      setClicks(c => c - upgrade.cost);
      setUpgrades(prev => prev.map(u => {
        if (u.id === id) {
          return { ...u, cost: Math.floor(u.cost * 1.5), count: u.count + 1 };
        }
        return u;
      }));

      if (upgrade.type === 'click') {
        setClickPower(p => p + upgrade.power);
      } else {
        setAutoClicks(a => a + upgrade.power);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl max-w-4xl w-full">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">{Math.floor(clicks).toLocaleString()}</h2>
          <p className="text-zinc-500 font-mono uppercase text-sm tracking-widest">Total Energy</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_50px_rgba(52,211,153,0.3)] flex items-center justify-center border-8 border-zinc-800 relative group"
        >
          <Zap size={64} className="text-white group-hover:animate-pulse" />
          <div className="absolute -bottom-4 bg-zinc-800 px-4 py-1 rounded-full border border-zinc-700 text-zinc-300 text-xs font-bold">
            +{clickPower} / click
          </div>
        </motion.button>

        <div className="flex gap-4">
          <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-zinc-300 font-mono text-sm">{autoClicks}/sec</span>
          </div>
          <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 flex items-center gap-2">
            <MousePointer2 size={16} className="text-emerald-400" />
            <span className="text-zinc-300 font-mono text-sm">Power: {clickPower}</span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-72 space-y-4">
        <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-widest mb-4">Upgrades</h3>
        <div className="space-y-3">
          {upgrades.map((upgrade) => (
            <button
              key={upgrade.id}
              disabled={clicks < upgrade.cost}
              onClick={() => buyUpgrade(upgrade.id)}
              className={`w-full p-4 rounded-xl border transition-all flex flex-col items-start gap-1 text-left ${
                clicks >= upgrade.cost 
                  ? 'bg-zinc-800 border-zinc-700 hover:border-emerald-500/50 cursor-pointer' 
                  : 'bg-zinc-900/50 border-zinc-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between w-full">
                <span className="text-white font-bold text-sm">{upgrade.name}</span>
                <span className="text-zinc-500 text-[10px] font-mono">x{upgrade.count}</span>
              </div>
              <div className="flex justify-between w-full items-center">
                <span className="text-emerald-400 font-mono text-xs font-bold">{upgrade.cost} Energy</span>
                <span className="text-zinc-500 text-[10px] uppercase">+{upgrade.power} {upgrade.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
