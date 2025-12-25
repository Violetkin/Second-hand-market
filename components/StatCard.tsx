import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color?: string;     
  themeColor?: string; 
}

export const StatCard: React.FC<Props> = ({ title, value, icon: Icon, trend, themeColor }) => {
  // Default to a Bio-Purple if no theme provided
  const accentColor = themeColor || '#7C3AED'; 

  return (
    <div className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100 hover:border-stone-200 transition-all duration-500 group relative overflow-hidden">
      {/* Subtle organic background blob on hover */}
      <div 
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10 flex justify-between items-start mb-6">
        <h3 className="text-stone-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
        <div 
          className="p-3 rounded-full bg-white border border-stone-100 shadow-sm text-stone-900 group-hover:scale-110 transition-transform duration-300"
        >
          <Icon size={18} strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-4xl font-light tracking-tighter text-stone-900 mb-2">
          {value}
        </div>
        
        {trend && (
          <div className="flex items-center gap-2">
            <span 
              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border"
              style={{ 
                borderColor: `${accentColor}40`, 
                color: accentColor,
                backgroundColor: `${accentColor}05`
              }}
            >
              Impact
            </span>
            <span className="text-xs text-stone-400 font-medium">
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};