'use client';

import { useEffect, useRef, useState } from 'react';

interface SpotlightCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function SpotlightCard({ 
  title, 
  description, 
  icon, 
  className = "", 
  children 
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm
        transition-all duration-300 hover:shadow-xl hover:shadow-primary/20
        ${className}
      `}
      style={{
        background: isHovered
          ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, 
             rgba(255, 178, 44, 0.1), 
             transparent 40%)`
          : 'rgba(255, 255, 255, 0.8)',
      }}
    >
      {/* Spotlight effect overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(255, 178, 44, 0.3), 
              transparent 60%)`,
          }}
        />
      )}

      {/* Card content */}
      <div className="relative p-6 z-10">
        {icon && (
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        
        <h3 className="text-xl font-heading font-bold text-foreground mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {description}
        </p>

        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>

      {/* Subtle border glow on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-xl border-2 border-primary/20 animate-pulse" />
      )}
    </div>
  );
}