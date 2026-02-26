import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy } from 'lucide-react';

export const Game2048 = () => {
  const [tiles, setTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [nextId, setNextId] = useState(0);

  const initGame = () => {
    setScore(0);
    const t1 = createTile(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4), 2, 0);
    let x2, y2;
    do {
      x2 = Math.floor(Math.random() * 4);
      y2 = Math.floor(Math.random() * 4);
    } while (x2 === t1.x && y2 === t1.y);
    const t2 = createTile(x2, y2, 2, 1);
    setTiles([t1, t2]);
    setNextId(2);
  };

  const createTile = (x, y, value, id) => ({
    id,
    value,
    x,
    y,
  });

  useEffect(() => {
    initGame();
  }, []);

  const move = (direction) => {
    setTiles((prevTiles) => {
      const newTiles = [...prevTiles];
      let moved = false;
      let currentScore = score;

      const sortFn = {
        up: (a, b) => a.y - b.y,
        down: (a, b) => b.y - a.y,
        left: (a, b) => a.x - b.x,
        right: (a, b) => b.x - a.x,
      }[direction];

      newTiles.sort(sortFn);

      const mergedIds = new Set();

      newTiles.forEach((tile) => {
        let { x, y } = tile;
        while (true) {
          let nextX = x;
          let nextY = y;
          if (direction === 'up') nextY--;
          if (direction === 'down') nextY++;
          if (direction === 'left') nextX--;
          if (direction === 'right') nextX++;

          if (nextX < 0 || nextX > 3 || nextY < 0 || nextY > 3) break;

          const occupant = newTiles.find((t) => t.x === nextX && t.y === nextY);
          if (occupant) {
            if (occupant.value === tile.value && !mergedIds.has(occupant.id) && !mergedIds.has(tile.id)) {
              occupant.value *= 2;
              currentScore += occupant.value;
              mergedIds.add(occupant.id);
              // Mark current tile for removal
              tile.x = nextX;
              tile.y = nextY;
              tile.value = 0; 
              moved = true;
            }
            break;
          } else {
            x = nextX;
            y = nextY;
            tile.x = x;
            tile.y = y;
            moved = true;
          }
        }
      });

      const finalTiles = newTiles.filter(t => t.value > 0);
      
      if (moved) {
        setScore(currentScore);
        if (currentScore > bestScore) setBestScore(currentScore);
        
        // Add new tile
        const emptySpots = [];
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (!finalTiles.find(t => t.x === i && t.y === j)) {
              emptySpots.push({x: i, y: j});
            }
          }
        }
        
        if (emptySpots.length > 0) {
          const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
          finalTiles.push(createTile(spot.x, spot.y, Math.random() > 0.9 ? 4 : 2, nextId));
          setNextId(nextId + 1);
        }
      }

      return finalTiles;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tiles, score]);

  const getTileColor = (value) => {
    const colors = {
      2: 'bg-zinc-200 text-zinc-800',
      4: 'bg-zinc-300 text-zinc-800',
      8: 'bg-orange-200 text-orange-900',
      16: 'bg-orange-300 text-orange-900',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-yellow-200 text-yellow-900',
      256: 'bg-yellow-300 text-yellow-900',
      512: 'bg-yellow-400 text-white',
      1024: 'bg-yellow-500 text-white',
      2048: 'bg-yellow-600 text-white',
    };
    return colors[value] || 'bg-zinc-800 text-white';
  };

  return (
    <div className="flex flex-col items-center bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl w-[400px]">
      <div className="flex justify-between w-full mb-6 items-start">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">2048</h2>
          <p className="text-zinc-500 text-xs font-mono uppercase">Join the numbers</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="bg-zinc-800 px-3 py-1 rounded-lg text-center">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Score</div>
              <div className="text-white font-bold">{score}</div>
            </div>
            <div className="bg-zinc-800 px-3 py-1 rounded-lg text-center">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Best</div>
              <div className="text-white font-bold">{bestScore}</div>
            </div>
          </div>
          <button 
            onClick={initGame}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition-colors font-bold text-sm"
          >
            <RotateCcw size={16} /> New Game
          </button>
        </div>
      </div>

      <div className="relative bg-zinc-950 p-2 rounded-xl grid grid-cols-4 grid-rows-4 gap-2 w-full aspect-square">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="bg-zinc-900/50 rounded-lg" />
        ))}
        
        <AnimatePresence>
          {tiles.map((tile) => (
            <motion.div
              key={tile.id}
              layoutId={`tile-${tile.id}`}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                x: tile.x * (320 / 4 + 8),
                y: tile.y * (320 / 4 + 8),
              }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`absolute w-[72px] h-[72px] flex items-center justify-center rounded-lg font-black text-2xl shadow-lg ${getTileColor(tile.value)}`}
              style={{ left: 8, top: 8 }}
            >
              {tile.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 text-zinc-500 text-xs font-mono uppercase tracking-widest text-center">
        Use Arrow Keys to Merge Tiles
      </div>
    </div>
  );
};
