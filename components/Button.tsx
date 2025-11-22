import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed tracking-tight";
  
  const variants = {
    // Vercel Primary: White background, Black text
    primary: "bg-white hover:bg-zinc-200 text-black px-4 py-2 focus:ring-white",
    // Vercel Secondary: Dark Gray/Zinc background, White text
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-4 py-2 focus:ring-zinc-500",
    // Icon: Simple hover
    icon: "p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full focus:ring-zinc-500",
    // Ghost: Text only
    ghost: "text-zinc-400 hover:text-white px-3 py-1.5 text-sm focus:ring-zinc-500"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};