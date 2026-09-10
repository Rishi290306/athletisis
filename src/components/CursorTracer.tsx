'use client';

import React, { useEffect, useRef } from 'react';

export function CursorTracer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Disable on touch devices to avoid interference with mobile touch events
    if (typeof window === 'undefined' || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const themeColors = ['#ffc700', '#ff9100', '#00f0ff', '#ffffff'];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.6) return;

      const color = themeColors[Math.floor(Math.random() * themeColors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.8 + 0.3;

      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.2,
        size: Math.random() * 3 + 2,
        color,
        alpha: 0.85,
      });

      if (particles.length > 25) {
        particles.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.04;
        p.size *= 0.96;

        if (p.alpha <= 0.05 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
    />
  );
}
