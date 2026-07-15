"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'white' | 'gray' | 'dark' | 'transparent';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'hero';
  style?: React.CSSProperties;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(({ 
  children, 
  className, 
  id, 
  variant = 'white',
  spacing = 'md',
  style
}, ref) => {
  
  const variantStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-gray-950 text-white',
    transparent: 'bg-transparent'
  };

  const spacingStyles = {
    none: 'py-0',
    sm: 'py-4 md:py-8',
    md: 'pt-6 pb-8 md:pt-8 md:pb-12 lg:pt-8 lg:pb-12', // Further tightened for better flow
    lg: 'py-10 md:py-20 lg:py-24',
    hero: 'pb-4 md:pb-6 lg:pb-8' // Very tight bottom spacing for Hero
  };

  return (
    <section 
      ref={ref}
      id={id}
      style={style}
      className={cn(
        variantStyles[variant],
        spacingStyles[spacing],
        'relative w-full overflow-hidden',
        className
      )}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
        {children}
      </div>
    </section>
  );
});

Section.displayName = 'Section';
