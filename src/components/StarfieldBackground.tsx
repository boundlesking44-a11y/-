import { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  nightGlow: boolean;
}

export function StarfieldBackground({ nightGlow }: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 110 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (i % 7 === 0 ? 1.8 : 0.7 + Math.random() * 1.1),
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.9,
      gold: i % 5 === 0,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.016;

      for (const s of stars) {
        const alpha = prefersReducedMotion
          ? 0.55
          : 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x % width, s.y % height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(255, 218, 102, ${alpha})`
          : `rgba(226, 232, 255, ${alpha * 0.8})`;
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none transition-colors duration-700 ${
        nightGlow
          ? 'bg-[radial-gradient(ellipse_at_50%_15%,#1a1647_0%,#060816_65%,#02030a_100%)]'
          : 'bg-[radial-gradient(ellipse_at_50%_15%,#272162_0%,#111638_65%,#090c1f_100%)]'
      }`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
