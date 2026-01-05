// StaticElectricity.jsx - Balloons and Static Electricity
// Thiết kế 100% dựa trên PhET Colorado simulation
// https://phet.colorado.edu/sims/html/balloons-and-static-electricity/

import React, { useState, useEffect, useRef } from 'react';
import GameIntro from '../GameIntro/GameIntro';
import { GAME_INTRO_DATA } from '../../data/gameIntroData';
import "./StaticElectricity.css";

// Charge component - electron và proton
const Charge = ({ type, x, y, isMoving }) => {
  const size = 10;
  return (
    <div 
      className={`charge ${type} ${isMoving ? 'moving' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 20 20">
        <defs>
          <radialGradient id={`grad-${type}-${x}-${y}`}>
            <stop offset="0%" stopColor={type === 'negative' ? '#64B5F6' : '#E57373'} />
            <stop offset="100%" stopColor={type === 'negative' ? '#1976D2' : '#C62828'} />
          </radialGradient>
        </defs>
        <circle cx="10" cy="10" r="9" fill={`url(#grad-${type}-${x}-${y})`} />
        <text x="10" y="10" textAnchor="middle" dominantBaseline="central" 
              fill="white" fontSize="14" fontWeight="bold">
          {type === 'negative' ? '−' : '+'}
        </text>
      </svg>
    </div>
  );
};

// Yellow Balloon - Bóng vàng tròn
const YellowBalloon = ({ x, y, charges, isDragging, onMouseDown }) => {
  const width = 120;
  const height = 140;
  
  // Calculate net charge
  const negativeCount = charges.filter(c => c.type === 'negative').length;
  const positiveCount = charges.filter(c => c.type === 'positive').length;
  const netCharge = negativeCount - positiveCount;
  
  return (
    <div 
      className={`yellow-balloon ${isDragging ? 'dragging' : ''}`}
      style={{ left: `${x}px`, top: `${y}px` }}
      onMouseDown={onMouseDown}
    >
      {/* Balloon SVG */}
      <svg width={width} height={height} viewBox="0 0 120 140" className="balloon-svg">
        <defs>
          {/* Gradient cho bóng vàng */}
          <radialGradient id="balloonYellow" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="30%" stopColor="#FFEB3B" />
            <stop offset="70%" stopColor="#FDD835" />
            <stop offset="100%" stopColor="#F9A825" />
          </radialGradient>
          {/* Highlight */}
          <radialGradient id="balloonHighlight">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Main balloon body */}
        <ellipse cx="60" cy="55" rx="45" ry="50" 
                 fill="url(#balloonYellow)" 
                 stroke="#F9A825" 
                 strokeWidth="2" />
        
        {/* Highlight */}
        <ellipse cx="42" cy="35" rx="20" ry="25" 
                 fill="url(#balloonHighlight)" />
        
        {/* Specular highlight */}
        <circle cx="45" cy="28" r="5" fill="white" opacity="0.8" />
        
        {/* Balloon knot */}
        <ellipse cx="60" cy="102" rx="6" ry="4" 
                 fill="#E65100" stroke="#BF360C" strokeWidth="1" />
        
        {/* String */}
        <path d="M 60 105 Q 58 110 56 115 L 54 125" 
              stroke="#666" strokeWidth="2" fill="none" 
              strokeLinecap="round" />
        <line x1="54" y1="125" x2="54" y2="135" 
              stroke="#666" strokeWidth="1.5" />
      </svg>
      
      {/* Charges trên balloon */}
      <div className="balloon-charges">
        {charges.map((charge, idx) => (
          <Charge key={idx} type={charge.type} x={charge.x} y={charge.y} isMoving={charge.isMoving} />
        ))}
      </div>
      
      {/* Net charge indicator - show if charged */}
      {netCharge !== 0 && (
        <div className={`charge-display ${netCharge < 0 ? 'negative' : 'positive'}`}>
          {netCharge > 0 ? '+' : ''}{netCharge}
        </div>
      )}
      
      {/* Neutral indicator */}
      {netCharge === 0 && charges.length > 0 && (
        <div className="charge-display neutral">
          Trung hòa
        </div>
      )}
    </div>
  );
};

// Sweater - Áo len
const Sweater = ({ charges, isRubbing }) => {
  return (
    <div className={`sweater ${isRubbing ? 'rubbing' : ''}`}>
      <svg width="220" height="280" viewBox="0 0 220 280">
        <defs>
          {/* Knit texture pattern */}
          <pattern id="knitTexture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#8B4513" />
            <circle cx="5" cy="5" r="2" fill="#A0522D" opacity="0.5" />
            <circle cx="15" cy="5" r="2" fill="#A0522D" opacity="0.5" />
            <circle cx="5" cy="15" r="2" fill="#A0522D" opacity="0.5" />
            <circle cx="15" cy="15" r="2" fill="#A0522D" opacity="0.5" />
            <line x1="0" y1="0" x2="20" y2="0" stroke="#654321" strokeWidth="0.5" opacity="0.3" />
            <line x1="0" y1="10" x2="20" y2="10" stroke="#654321" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          
          {/* Ribbing pattern */}
          <pattern id="ribbing" x="0" y="0" width="6" height="10" patternUnits="userSpaceOnUse">
            <rect width="6" height="10" fill="#654321" />
            <line x1="0" y1="0" x2="0" y2="10" stroke="#8B4513" strokeWidth="1.5" />
            <line x1="3" y1="0" x2="3" y2="10" stroke="#8B4513" strokeWidth="1.5" />
          </pattern>
          
          {/* Gradient for depth */}
          <linearGradient id="sweaterDepth" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.2)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </linearGradient>
        </defs>
        
        {/* Shadow */}
        <ellipse cx="110" cy="265" rx="80" ry="10" fill="rgba(0,0,0,0.15)" />
        
        {/* Main sweater body */}
        <path d="M 50 40 
                 L 170 40 
                 Q 175 42 175 48 
                 L 185 70 
                 Q 187 75 187 80 
                 L 187 180 
                 Q 187 185 185 188 
                 L 175 195 
                 L 175 250 
                 Q 175 255 170 255 
                 L 50 255 
                 Q 45 255 45 250 
                 L 45 195 
                 L 35 188 
                 Q 33 185 33 180 
                 L 33 80 
                 Q 33 75 35 70 
                 L 45 48 
                 Q 45 42 50 40 Z"
              fill="url(#knitTexture)" 
              stroke="#654321" 
              strokeWidth="3" />
        
        {/* Depth overlay */}
        <path d="M 50 40 
                 L 170 40 
                 Q 175 42 175 48 
                 L 185 70 
                 Q 187 75 187 80 
                 L 187 180 
                 Q 187 185 185 188 
                 L 175 195 
                 L 175 250 
                 Q 175 255 170 255 
                 L 50 255 
                 Q 45 255 45 250 
                 L 45 195 
                 L 35 188 
                 Q 33 185 33 180 
                 L 33 80 
                 Q 33 75 35 70 
                 L 45 48 
                 Q 45 42 50 40 Z"
              fill="url(#sweaterDepth)" 
              opacity="0.4" />
        
        {/* Neck collar */}
        <ellipse cx="110" cy="40" rx="35" ry="12" 
                 fill="url(#ribbing)" stroke="#654321" strokeWidth="2" />
        <ellipse cx="110" cy="38" rx="32" ry="8" fill="#654321" />
        
        {/* Left sleeve */}
        <rect x="33" y="70" width="12" height="85" 
              fill="#654321" rx="2" opacity="0.6" />
        <rect x="33" y="153" width="12" height="10" fill="url(#ribbing)" />
        
        {/* Right sleeve */}
        <rect x="175" y="70" width="12" height="85" 
              fill="#654321" rx="2" opacity="0.6" />
        <rect x="175" y="153" width="12" height="10" fill="url(#ribbing)" />
        
        {/* Bottom ribbing */}
        <rect x="45" y="250" width="130" height="8" 
              fill="url(#ribbing)" rx="2" />
        
        {/* Center seam */}
        <line x1="110" y1="45" x2="110" y2="250" 
              stroke="#654321" strokeWidth="2" 
              opacity="0.3" strokeDasharray="5,5" />
        
        {/* Stitching details */}
        {[45, 175].map((x, i) => (
          <g key={i}>
            {[60, 90, 120, 150, 180, 210, 240].map((y, j) => (
              <circle key={j} cx={x} cy={y} r="1.5" 
                      fill="#654321" opacity="0.5" />
            ))}
          </g>
        ))}
        
        {/* Texture lines */}
        {Array.from({length: 21}, (_, i) => (
          <line key={i} 
                x1="50" y1={50 + i * 10} 
                x2="170" y2={50 + i * 10} 
                stroke="#654321" strokeWidth="0.5" 
                opacity="0.2" strokeDasharray="3,4" />
        ))}
        
        {/* Shoulder highlight */}
        <ellipse cx="75" cy="60" rx="25" ry="18" 
                 fill="white" opacity="0.08" />
      </svg>
      
      {/* Charges on sweater */}
      <div className="sweater-charges">
        {charges.map((charge, idx) => (
          <Charge key={idx} type={charge.type} x={charge.x} y={charge.y} />
        ))}
      </div>
      
      {/* Label */}
      <div className="item-label">Áo Len</div>
    </div>
  );
};

// Wall - Tường gạch
const Wall = ({ charges, visible }) => {
  if (!visible) return null;
  
  return (
    <div className="wall">
      <svg width="140" height="600" viewBox="0 0 140 600">
        <defs>
          {/* 3D Brick pattern */}
          <pattern id="bricks" x="0" y="0" width="120" height="60" patternUnits="userSpaceOnUse">
            {/* Row 1 - Full brick */}
            <rect x="3" y="3" width="114" height="25" 
                  fill="#CD853F" stroke="#8B4513" strokeWidth="1" />
            <rect x="3" y="3" width="114" height="25" 
                  fill="url(#brickShading)" />
            
            {/* Mortar */}
            <rect x="0" y="0" width="120" height="3" fill="#A9A9A9" />
            <rect x="0" y="28" width="120" height="3" fill="#808080" />
            
            {/* 3D edges */}
            <line x1="3" y1="3" x2="117" y2="3" stroke="#DEB887" strokeWidth="1.5" />
            <line x1="3" y1="3" x2="3" y2="28" stroke="#DEB887" strokeWidth="1.5" />
            <line x1="117" y1="3" x2="117" y2="28" stroke="#654321" strokeWidth="1" />
            <line x1="3" y1="28" x2="117" y2="28" stroke="#654321" strokeWidth="1" />
            
            {/* Row 2 - Offset bricks */}
            <rect x="3" y="33" width="54" height="25" 
                  fill="#CD853F" stroke="#8B4513" strokeWidth="1" />
            <rect x="3" y="33" width="54" height="25" 
                  fill="url(#brickShading)" />
            
            <rect x="63" y="33" width="54" height="25" 
                  fill="#CD853F" stroke="#8B4513" strokeWidth="1" />
            <rect x="63" y="33" width="54" height="25" 
                  fill="url(#brickShading)" />
            
            {/* Mortar vertical */}
            <rect x="57" y="31" width="6" height="29" fill="#A9A9A9" />
            
            {/* Mortar horizontal */}
            <rect x="0" y="31" width="120" height="2" fill="#A9A9A9" />
            <rect x="0" y="58" width="120" height="2" fill="#808080" />
            
            {/* 3D edges row 2 */}
            <line x1="3" y1="33" x2="57" y2="33" stroke="#DEB887" strokeWidth="1.5" />
            <line x1="3" y1="33" x2="3" y2="58" stroke="#DEB887" strokeWidth="1.5" />
            <line x1="63" y1="33" x2="117" y2="33" stroke="#DEB887" strokeWidth="1.5" />
            <line x1="63" y1="33" x2="63" y2="58" stroke="#DEB887" strokeWidth="1.5" />
          </pattern>
          
          {/* Brick shading */}
          <linearGradient id="brickShading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(222,184,135,0.3)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(101,67,33,0.2)" />
          </linearGradient>
          
          {/* Wall surface gradient */}
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>
        </defs>
        
        {/* Brick pattern fill */}
        <rect x="0" y="0" width="140" height="600" fill="url(#bricks)" />
        
        {/* Surface gradient overlay */}
        <rect x="0" y="0" width="140" height="600" fill="url(#wallGradient)" />
      </svg>
      
      {/* Charges in wall */}
      <div className="wall-charges">
        {charges.map((charge, idx) => (
          <Charge key={idx} type={charge.type} x={charge.x} y={charge.y} />
        ))}
      </div>
      
      {/* Label */}
      <div className="item-label wall-label">Tường</div>
    </div>
  );
};

// MAIN GAME COMPONENT
const StaticElectricity = ({ gameData }) => {
  // State
  const [showIntro, setShowIntro] = useState(true);
  const [balloonPos, setBalloonPos] = useState({ x: 400, y: 200 }); // Center position
  const [balloonCharges, setBalloonCharges] = useState([]);
  const [sweaterCharges, setSweaterCharges] = useState([]);
  const [wallCharges, setWallCharges] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [wallVisible, setWallVisible] = useState(true);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState([]);
  
  const gameRef = useRef(null);
  const rubInterval = useRef(null);
  
  // Constants
  const SWEATER_POS = { x: 50, y: 150 };
  const WALL_POS = { x: 850, y: 0 };
  const INITIAL_BALLOON_POS = { x: 400, y: 200 };
  
  // Initialize balloon with neutral charges (equal positive and negative)
  useEffect(() => {
    const initBalloonCharges = [];
    // Add 5 positive charges
    for (let i = 0; i < 5; i++) {
      initBalloonCharges.push({
        type: 'positive',
        x: 35 + Math.random() * 50,
        y: 35 + Math.random() * 60
      });
    }
    // Add 5 negative charges
    for (let i = 0; i < 5; i++) {
      initBalloonCharges.push({
        type: 'negative',
        x: 35 + Math.random() * 50,
        y: 35 + Math.random() * 60
      });
    }
    setBalloonCharges(initBalloonCharges);
  }, []);
  
  // Initialize wall with BOTH charges (neutral) - many pairs
  useEffect(() => {
    if (!wallVisible) return;
    
    const initWallCharges = [];
    // Add 40 pairs of charges distributed evenly
    for (let i = 0; i < 40; i++) {
      const y = 50 + (i * 12);
      // Positive charge on right side
      initWallCharges.push({
        type: 'positive',
        x: 70 + Math.random() * 40,
        y: y + Math.random() * 10,
        fixed: true // These are permanent
      });
      // Negative charge on left side (can be polarized)
      initWallCharges.push({
        type: 'negative',
        x: 20 + Math.random() * 40,
        y: y + Math.random() * 10,
        fixed: false
      });
    }
    setWallCharges(initWallCharges);
  }, [wallVisible]);
  
  // Initialize sweater with BOTH positive and negative charges (neutral)
  useEffect(() => {
    const initCharges = [];
    // Add 30 positive charges (protons)
    for (let i = 0; i < 30; i++) {
      initCharges.push({
        type: 'positive',
        x: 60 + Math.random() * 100,
        y: 60 + Math.random() * 180
      });
    }
    // Add 30 negative charges (electrons) - loosely bound
    for (let i = 0; i < 30; i++) {
      initCharges.push({
        type: 'negative',
        x: 60 + Math.random() * 100,
        y: 60 + Math.random() * 180
      });
    }
    setSweaterCharges(initCharges);
  }, []);
  
  // Check if balloon near sweater
  const isNearSweater = () => {
    const dist = Math.sqrt(
      Math.pow(balloonPos.x - SWEATER_POS.x, 2) + 
      Math.pow(balloonPos.y - SWEATER_POS.y, 2)
    );
    return dist < 150;
  };
  
  // Rubbing effect - transfer ELECTRONS from sweater to balloon
  useEffect(() => {
    if (isDragging && isNearSweater() && sweaterCharges.length > 0) {
      rubInterval.current = setInterval(() => {
        // Find and remove an ELECTRON from sweater
        setSweaterCharges(prev => {
          const electronIndex = prev.findIndex(c => c.type === 'negative');
          if (electronIndex === -1) return prev; // No more electrons
          
          const newCharges = [...prev];
          newCharges.splice(electronIndex, 1); // Remove electron
          return newCharges;
        });
        
        // Add electron to balloon
        setBalloonCharges(prev => {
          if (prev.length >= 45) return prev; // Max limit
          return [...prev, {
            type: 'negative',
            x: 30 + Math.random() * 60,
            y: 30 + Math.random() * 70,
            isMoving: true
          }];
        });
      }, 300);
    } else {
      if (rubInterval.current) {
        clearInterval(rubInterval.current);
      }
    }
    
    return () => {
      if (rubInterval.current) clearInterval(rubInterval.current);
    };
  }, [isDragging, balloonPos, sweaterCharges.length]);
  
  // Wall polarization - electrons in wall move away from negative balloon
  useEffect(() => {
    if (!wallVisible) return;
    
    const negativeCharges = balloonCharges.filter(c => c.type === 'negative').length;
    const positiveCharges = balloonCharges.filter(c => c.type === 'positive').length;
    const netCharge = negativeCharges - positiveCharges;
    const distToWall = WALL_POS.x - balloonPos.x;
    
    if (netCharge < -3 && distToWall < 250 && distToWall > 0) {
      // Balloon is negatively charged and near wall
      // Create polarization: negative charges move away (to right)
      // positive charges move closer (to left)
      setWallCharges(prev => {
        return prev.map(charge => {
          if (charge.fixed) return charge; // Don't move fixed positive charges
          
          const yDist = Math.abs(charge.y - balloonPos.y);
          
          if (charge.type === 'negative' && yDist < 120) {
            // Electrons repelled - move right
            return {
              ...charge,
              x: 80 + Math.random() * 30,
              polarized: true
            };
          } else if (charge.type === 'positive' && yDist < 120) {
            // Protons attracted - appear on left edge
            return {
              ...charge,
              x: 10 + Math.random() * 20,
              polarized: true
            };
          }
          
          // Reset to normal position if far from balloon
          if (charge.type === 'negative') {
            return { ...charge, x: 20 + Math.random() * 40, polarized: false };
          } else {
            return { ...charge, x: 70 + Math.random() * 40, polarized: false };
          }
        });
      });
    } else {
      // Reset wall charges to normal distribution
      setWallCharges(prev => {
        return prev.map(charge => {
          if (charge.type === 'negative') {
            return { ...charge, x: 20 + Math.random() * 40, polarized: false };
          } else {
            return { ...charge, x: 70 + Math.random() * 40, polarized: false };
          }
        });
      });
    }
  }, [balloonPos, balloonCharges, wallVisible]);
  
  // Check objectives - 3 scientific experiments
  useEffect(() => {
    if (!gameData?.objectives) return;
    
    const negativeCharges = balloonCharges.filter(c => c.type === 'negative').length;
    const positiveCharges = balloonCharges.filter(c => c.type === 'positive').length;
    const netCharge = negativeCharges - positiveCharges;
    const distToWall = WALL_POS.x - balloonPos.x;
    const polarizedCharges = wallCharges.filter(c => c.polarized).length;
    
    gameData.objectives.forEach(obj => {
      if (completed.includes(obj.id)) return;
      
      let done = false;
      
      // Objective 1: Charge the balloon by rubbing (net charge < -10)
      if (obj.id === 1 && netCharge <= -10) {
        done = true;
      }
      
      // Objective 2: Show polarization in wall (balloon near wall + charges polarized)
      if (obj.id === 2 && polarizedCharges > 10 && distToWall < 200) {
        done = true;
      }
      
      // Objective 3: Stick balloon to wall (very close + strong charge)
      if (obj.id === 3 && netCharge <= -15 && distToWall < 100) {
        done = true;
      }
      
      if (done) {
        setCompleted(prev => [...prev, obj.id]);
        setScore(prev => prev + obj.points);
      }
    });
  }, [balloonCharges, wallCharges, balloonPos, gameData, completed]);
  
  // Mouse handlers
  const handleBalloonMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging || !gameRef.current) return;
    
    const rect = gameRef.current.getBoundingClientRect();
    setBalloonPos({
      x: Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 120)),
      y: Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 140))
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Reset
  const handleReset = () => {
    setBalloonPos(INITIAL_BALLOON_POS);
    setScore(0);
    setCompleted([]);
    
    // Reset balloon to neutral (equal positive and negative)
    const initBalloonCharges = [];
    for (let i = 0; i < 5; i++) {
      initBalloonCharges.push({
        type: 'positive',
        x: 35 + Math.random() * 50,
        y: 35 + Math.random() * 60
      });
    }
    for (let i = 0; i < 5; i++) {
      initBalloonCharges.push({
        type: 'negative',
        x: 35 + Math.random() * 50,
        y: 35 + Math.random() * 60
      });
    }
    setBalloonCharges(initBalloonCharges);
    
    // Reset sweater charges (both positive and negative)
    const initSweaterCharges = [];
    for (let i = 0; i < 30; i++) {
      initSweaterCharges.push({
        type: 'positive',
        x: 60 + Math.random() * 100,
        y: 60 + Math.random() * 180
      });
    }
    for (let i = 0; i < 30; i++) {
      initSweaterCharges.push({
        type: 'negative',
        x: 60 + Math.random() * 100,
        y: 60 + Math.random() * 180
      });
    }
    setSweaterCharges(initSweaterCharges);
    
    // Reset wall charges
    const initWallCharges = [];
    for (let i = 0; i < 40; i++) {
      const y = 50 + (i * 12);
      initWallCharges.push({
        type: 'positive',
        x: 70 + Math.random() * 40,
        y: y + Math.random() * 10,
        fixed: true
      });
      initWallCharges.push({
        type: 'negative',
        x: 20 + Math.random() * 40,
        y: y + Math.random() * 10,
        fixed: false
      });
    }
    setWallCharges(initWallCharges);
  };

  // Hiển thị intro nếu chưa bắt đầu
  if (showIntro) {
    return <GameIntro gameInfo={GAME_INTRO_DATA['lop7-3']} onStart={() => setShowIntro(false)} />;
  }
  
  return (
    <div className="static-electricity-game">
      {/* Controls */}
      <div className="controls">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={wallVisible}
            onChange={(e) => setWallVisible(e.target.checked)}
          />
          <span>Hiển thị tường</span>
        </label>
        
        <button onClick={handleReset} className="btn-reset">
          🔄 Đặt lại bóng
        </button>
        
        <button onClick={handleReset} className="btn-reset-all">
          🔄 Đặt lại tất cả
        </button>
      </div>
      
      {/* Play area */}
      <div 
        ref={gameRef}
        className="play-area"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Sweater 
          charges={sweaterCharges}
          isRubbing={isDragging && isNearSweater()}
        />
        
        <YellowBalloon
          x={balloonPos.x}
          y={balloonPos.y}
          charges={balloonCharges}
          isDragging={isDragging}
          onMouseDown={handleBalloonMouseDown}
        />
        
        <Wall
          charges={wallCharges}
          visible={wallVisible}
        />
      </div>
      
      {/* Objectives */}
      <div className="objectives">
        <h3>🎯 Kiểm thử</h3>
        {gameData?.objectives?.map(obj => (
          <div key={obj.id} className={`objective ${completed.includes(obj.id) ? 'done' : ''}`}>
            <input type="checkbox" checked={completed.includes(obj.id)} readOnly />
            <span>{obj.description}</span>
            {completed.includes(obj.id) && <span className="pts">+{obj.points}</span>}
          </div>
        ))}
        <div className="score">Điểm: {score}</div>
      </div>
    </div>
  );
};

export default StaticElectricity;
