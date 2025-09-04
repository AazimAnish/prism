'use client';

import { useEffect, useRef } from 'react';

export default function PrismBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Prism/Crystal animation
    const particles: Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
      opacity: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // Colors from the palette
    const colors = ['#FFB22C', '#854836', '#FFC759', '#A05A43'];

    // Create particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 20 + 10,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.rotation += particle.rotationSpeed;

        // Bounce off walls
        if (particle.x <= 0 || particle.x >= canvas.width) particle.dx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.dy *= -1;

        // Draw crystal/prism shape
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.opacity;

        // Create gradient
        const gradient = ctx.createLinearGradient(
          -particle.size/2, -particle.size/2,
          particle.size/2, particle.size/2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, particle.color + '40');

        ctx.fillStyle = gradient;
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;

        // Draw diamond/crystal shape
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.lineTo(particle.size/2, -particle.size/3);
        ctx.lineTo(particle.size/2, particle.size/3);
        ctx.lineTo(0, particle.size);
        ctx.lineTo(-particle.size/2, particle.size/3);
        ctx.lineTo(-particle.size/2, -particle.size/3);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();

        // Add internal lines for prism effect
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.lineTo(0, particle.size);
        ctx.moveTo(-particle.size/2, -particle.size/3);
        ctx.lineTo(particle.size/2, particle.size/3);
        ctx.moveTo(particle.size/2, -particle.size/3);
        ctx.lineTo(-particle.size/2, particle.size/3);
        ctx.stroke();

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20"
      style={{ zIndex: -1 }}
    />
  );
}