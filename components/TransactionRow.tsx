import React from 'react';
import { Record } from '../types';
import { motion } from 'framer-motion';

interface Props {
  record: Record;
  onDelete: (id: string) => void;
  themeColor?: string;
  removeLabel?: string; // Add support for localized label
}

export const TransactionRow: React.FC<Props> = ({ record, onDelete, themeColor = '#7C3AED', removeLabel = 'Remove' }) => {
  const date = new Date(record.timestamp);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group flex items-center justify-between py-5 border-b border-stone-100 hover:bg-stone-50/50 transition-colors px-2"
    >
      <div className="flex items-start gap-4">
        {/* Minimal dot indicator instead of heavy icon */}
        <div className="mt-2.5 w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
        
        <div className="flex flex-col">
          <span className="font-light text-2xl text-stone-900 tracking-tight">
            +{record.amount.toFixed(2)}
          </span>
          <span className="text-xs text-stone-400 uppercase tracking-wider font-medium mt-1">
             {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {record.note || 'General Item'}
          </span>
        </div>
      </div>
      
      <button 
        onClick={() => onDelete(record.id)}
        className="opacity-0 group-hover:opacity-100 text-xs font-bold uppercase tracking-widest text-stone-300 hover:text-red-500 transition-colors px-4 py-2 border border-transparent hover:border-red-100 rounded-full"
      >
        {removeLabel}
      </button>
    </motion.div>
  );
};