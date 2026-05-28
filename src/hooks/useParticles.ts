import { useEffect, useRef } from 'react';
import type { Particle, Theme } from '../types';

export function useParticles(theme: Theme) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const celebrate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = {
      purple: ['#a855f7', '#ec4899', '#f43f5e', '#ffffff'],
      cyan: ['#06b6d4', '#10b981', '#3b82f6', '#ffffff'],
      amber: ['#f59e0b', '#ef4444', '#eab308', '#ffffff'],
      aurora: ['#10b981', '#84cc16', '#06b6d4', '#ffffff'],
    }[theme] || ['#a855f7', '#ec4899', '#f43f5e', '#ffffff'];

    const particleCount = 70;
    // Explode over workspace coordinates
    const centerX = canvas.width * 0.75;
    const centerY = canvas.height * 0.40;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        radius: 2.5 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.01 + Math.random() * 0.015,
      });
    }
  };

  return { canvasRef, celebrate };
}
