'use client';

import React, { useEffect, useState } from 'react';

interface GlitterSparkle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  type: 'star' | 'dot';
}

export function CursorTracer() {
  const [sparkles, setSparkles] = useState<GlitterSparkle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setIsMobile(true);
      return;
    }

    let animationFrameId: number;
    let sparkleId = 0;

    const themeColors = [
      '#ffc700', // Solar Gold
      '#ff9100', // Fire Amber
      '#00f0ff', // Electric Cyan
      '#ffffff', // Diamond White
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // Subtle spawning: 1 sparkle per move event with 50% probability
      if (Math.random() > 0.5) return;

      const color = themeColors[Math.floor(Math.random() * themeColors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.6 + 0.2;

      const newSparkle: GlitterSparkle = {
        id: sparkleId++,
        x: x + (Math.random() * 8 - 4),
        y: y + (Math.random() * 8 - 4),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.15,
        size: Math.random() * 4 + 3, // Subtle size 3px - 7px
        color,
        alpha: 0.85,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        type: Math.random() > 0.5 ? 'star' : 'dot',
      };

      setSparkles((prev) => [...prev.slice(-20), newSparkle]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const loop = () => {
      setSparkles((prev) =>
        prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            alpha: s.alpha - 0.05, // Faster, graceful fade out
            size: s.size * 0.95,
            rotation: s.rotation + s.rotationSpeed,
          }))
          .filter((s) => s.alpha > 0.05)
      );

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            opacity: s.alpha,
            transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
            filter: `drop-shadow(0 0 3px ${s.color})`,
          }}
        >
          {s.type === 'star' ? (
            /* Subtle 4-Point Star Sparkle */
            <svg
              width={s.size}
              height={s.size}
              viewBox="0 0 24 24"
              fill={s.color}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          ) : (
            /* Subtle Glowing Glitter Dot */
            <div
              className="rounded-full"
              style={{
                width: `${s.size}px`,
                height: `${s.size}px`,
                backgroundColor: s.color,
                boxShadow: `0 0 4px ${s.color}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}



