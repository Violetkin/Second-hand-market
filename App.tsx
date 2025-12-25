import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Leaf, DollarSign, Activity, Archive, 
  ArrowLeft, Smartphone, Monitor, ArrowRight, Settings, Palette,
  Globe, RotateCcw, List, Languages, Database, BarChart3, CreditCard
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { Record, DashboardStats } from './types';
import { TransactionRow } from './components/TransactionRow';
import { StatCard } from './components/StatCard';
import { BioSwarm } from './components/BioSwarm';
import { NatureElements } from './components/NatureElements'; // New Import
import { AnimatePresence, motion } from 'framer-motion';

type ViewState = 'home' | 'merchant' | 'display' | 'admin';
type Lang = 'en' | 'zh';

// --- Translations ---
const TRANSLATIONS = {
  en: {
    // Home
    titleLine1: "REIMAGINE",
    titleLine2: "LIFECYCLE",
    btnMerchant: "Merchant Entry",
    btnDashboard: "Visual Analytics",
    btnAdmin: "Data Control",
    
    // Common
    back: "Back",
    reset: "Reset Data",
    confirm: "CONFIRM",
    remove: "Remove",

    // Merchant
    newEntry: "New Entry",
    amountLabel: "Amount (CNY)",
    noteLabel: "Note",
    notePlaceholder: "Items, Source, etc...",
    recordBtn: "Record Transaction",
    sessionStats: "Session: {count} entries",

    // Admin
    dataMgmt: "Data Management",
    theme: "Theme",
    hexCode: "HEX Code",
    recordsTitle: "Records",
    empty: "Empty",

    // Dashboard
    trends: "Trends",
    revenue: "Revenue",
    transactions: "Transactions",
    impact: "Impact",
    co2Saved: "CO2 Saved",
    velocity: "Velocity",
    recent: "Recent",
    noData: "No data",
    live: "Live"
  },
  zh: {
    // Home
    titleLine1: "重塑",
    titleLine2: "生命周期",
    btnMerchant: "商户录入",
    btnDashboard: "趋势洞察",
    btnAdmin: "数据管理",

    // Common
    back: "返回",
    reset: "重置数据",
    confirm: "确认",
    remove: "删除",

    // Merchant
    newEntry: "新增录入",
    amountLabel: "金额 (元)",
    noteLabel: "备注",
    notePlaceholder: "物品名称、来源等...",
    recordBtn: "确认记账",
    sessionStats: "本次会话: {count} 笔",

    // Admin
    dataMgmt: "数据管理",
    theme: "主题配色",
    hexCode: "HEX 代码",
    recordsTitle: "交易记录",
    empty: "暂无数据",

    // Dashboard
    trends: "趋势看板",
    revenue: "总营收",
    transactions: "交易笔数",
    impact: "环保贡献",
    co2Saved: "碳减排",
    velocity: "增长速率",
    recent: "最近交易",
    noData: "暂无数据",
    live: "实时"
  }
};

// --- Theme Config ---
const DEFAULT_THEME = '#7C3AED'; // Vivid Purple (Bio-Tech feel)
const SECONDARY_ACCENT = '#10B981'; // Emerald Green (Eco feel)

// --- Admin Row Component ---
interface AdminRowProps {
  record: Record;
  themeColor: string;
  onDelete: (id: string) => void;
  confirmLabel: string;
}

const AdminRow: React.FC<AdminRowProps> = ({ record, themeColor, onDelete, confirmLabel }) => {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (confirming) {
      const timer = setTimeout(() => setConfirming(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [confirming]);

  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-stone-100 text-sm group hover:bg-stone-50 transition-colors px-4 rounded-xl">
      <div className="col-span-3 font-semibold text-stone-900">
        ¥{record.amount.toFixed(2)}
      </div>
      <div className="col-span-4 text-stone-500 font-medium truncate pr-4">
        {record.note || '—'}
      </div>
      <div className="col-span-3 text-stone-400 text-xs uppercase tracking-wide">
        {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </div>
      <div className="col-span-2 text-right flex justify-end">
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (confirming) onDelete(record.id);
            else setConfirming(true);
          }}
          className={`h-8 flex items-center justify-center rounded-full transition-all text-xs font-bold tracking-wider ${
            confirming 
              ? 'bg-red-50 text-red-600 px-4 w-auto' 
              : 'w-8 text-stone-300 hover:text-stone-900'
          }`}
        >
          {confirming ? confirmLabel : <Trash2 size={14} />}
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [lang, setLang] = useState<Lang>('zh'); // Default to Chinese as per request context
  
  // --- STATE ---
  const [records, setRecords] = useState<Record[]>(() => {
    try {
      const saved = localStorage.getItem('wx_ledger_records');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [themeColor, setThemeColor] = useState<string>(() => {
    return localStorage.getItem('wx_ledger_theme') || DEFAULT_THEME;
  });

  const [amountInput, setAmountInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  // Persistence
  useEffect(() => { localStorage.setItem('wx_ledger_records', JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem('wx_ledger_theme', themeColor); }, [themeColor]);

  // Sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wx_ledger_records' && e.newValue) setRecords(JSON.parse(e.newValue));
      if (e.key === 'wx_ledger_theme' && e.newValue) setThemeColor(e.newValue);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Stats
  const totalRevenue = records.reduce((sum, r) => sum + r.amount, 0);
  const stats: DashboardStats = {
    totalRevenue: totalRevenue,
    transactionCount: records.length,
    carbonEmissions: totalRevenue * 5
  };

  // Chart Data
  const chartData = useMemo(() => {
    const sorted = [...records].sort((a, b) => a.timestamp - b.timestamp);
    let runningTotal = 0;
    return sorted.map((record, index) => {
      runningTotal += record.amount;
      return {
        sequence: index + 1,
        total: runningTotal,
        amount: record.amount,
        time: new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
  }, [records]);

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountInput);
    if (!val || val <= 0) return;
    const newRecord: Record = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: val,
      note: noteInput.trim() || 'Quick Sale',
      timestamp: Date.now()
    };
    setRecords(prev => [newRecord, ...prev]);
    setAmountInput('');
    setNoteInput('');
  };

  const handleDelete = (id: string) => setRecords(prev => prev.filter(r => r.id !== id));
  
  const handleReset = () => {
    if (window.confirm('Reset all transaction data?')) setRecords([]);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: 'CNY' }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US').format(val);
  
  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');
  const t = TRANSLATIONS[lang];

  // --- RENDER VIEWS ---

  // 1. HOME VIEW (Minimalist Center + Nature)
  if (view === 'home') {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-50/50 via-[#fdfbf7] to-white text-stone-900">
        
        {/* Language Toggle - Absolute Top Right */}
        <div className="absolute top-6 right-6 z-50">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur border border-stone-100 hover:border-emerald-200 transition-all text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-emerald-800"
          >
            <Languages size={12} />
            {lang === 'en' ? '中文' : 'English'}
          </button>
        </div>

        {/* BioSwarm Background - Keeping particles but on new background */}
        <BioSwarm />
        
        {/* New Nature Elements Layer (Glassy Leaves & Dragonfly) */}
        <NatureElements />

        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center">
          
          {/* Main Title - Clean & Huge & Centered */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="text-7xl md:text-9xl font-bold tracking-tighter leading-[1.1] mb-20 text-stone-900 flex flex-col items-center drop-shadow-sm mix-blend-darken"
          >
            <span>{t.titleLine1}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500">
              {t.titleLine2}
            </span>
          </motion.h1>

          {/* Minimalist 3-Button Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
            
            {/* Button 1: Merchant Entry */}
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => setView('merchant')}
              className="group flex flex-col items-center justify-center gap-4 bg-stone-900 text-white p-8 rounded-[2rem] hover:bg-emerald-900 transition-all shadow-xl shadow-stone-200/50"
            >
              <CreditCard size={28} strokeWidth={1.5} className="text-stone-300 group-hover:text-emerald-200 transition-colors" />
              <span className="text-sm font-medium tracking-widest uppercase">{t.btnMerchant}</span>
            </motion.button>

            {/* Button 2: Visual Analytics */}
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => setView('display')}
              className="group flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm border border-stone-100 text-stone-900 p-8 rounded-[2rem] hover:border-emerald-300 hover:bg-emerald-50/20 transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-100/50"
            >
              <BarChart3 size={28} strokeWidth={1.5} className="text-stone-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-sm font-medium tracking-widest uppercase">{t.btnDashboard}</span>
            </motion.button>

            {/* Button 3: Data Control */}
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => setView('admin')}
              className="group flex flex-col items-center justify-center gap-4 bg-white/40 backdrop-blur-sm border border-stone-100 text-stone-500 p-8 rounded-[2rem] hover:bg-white hover:text-stone-900 hover:shadow-lg transition-all"
            >
              <Database size={28} strokeWidth={1.5} className="text-stone-300 group-hover:text-purple-500 transition-colors" />
              <span className="text-sm font-medium tracking-widest uppercase">{t.btnAdmin}</span>
            </motion.button>

          </div>

        </div>
      </div>
    );
  }

  // 2. MERCHANT VIEW (Clean Input)
  if (view === 'merchant') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#fdfbf7] to-[#eefcf6]">
        <div className="w-full max-w-lg relative z-10">
          <button 
            onClick={() => setView('home')} 
            className="mb-8 flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> {t.back}
          </button>

          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl shadow-stone-200/50 border border-white">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900">{t.newEntry}</h2>
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                  {t.amountLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-light text-stone-300">¥</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    autoFocus
                    placeholder="0.00"
                    className="w-full bg-transparent border-b-2 border-stone-100 text-stone-900 text-6xl font-light py-4 pl-10 focus:outline-none focus:border-emerald-500 transition-all placeholder-stone-200"
                    style={{ caretColor: themeColor }}
                    value={amountInput}
                    onChange={e => setAmountInput(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                  {t.noteLabel}
                </label>
                <input 
                  type="text" 
                  placeholder={t.notePlaceholder}
                  className="w-full bg-stone-50/50 border-none rounded-2xl px-6 py-4 text-stone-900 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-stone-300"
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={!amountInput}
                className="w-full bg-stone-900 text-white text-lg font-medium py-5 rounded-2xl shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                <span>{t.recordBtn}</span>
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-stone-400 font-medium">
                {t.sessionStats.replace('{count}', stats.transactionCount.toString())}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. ADMIN VIEW (Table)
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 bg-gradient-to-br from-[#fdfbf7] to-[#eefcf6]">
        <div className="max-w-5xl mx-auto p-6 md:p-12 relative z-10">
           <header className="flex justify-between items-center mb-12">
             <div>
                <button 
                  onClick={() => setView('home')} 
                  className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-xs font-bold uppercase tracking-widest mb-4"
                >
                  <ArrowLeft size={14} /> {t.back}
                </button>
                <h1 className="text-4xl font-bold tracking-tight">{t.dataMgmt}</h1>
             </div>
             <div className="flex gap-4">
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 text-stone-500 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <RotateCcw size={14} /> {t.reset}
                </button>
             </div>
           </header>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Left Col: Appearance */}
              <div className="md:col-span-1 space-y-8">
                 <section className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                      <Palette size={16} /> {t.theme}
                    </h2>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <input 
                          type="color" 
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="w-12 h-12 rounded-full cursor-pointer bg-transparent border-none p-0 overflow-hidden" 
                        />
                        <div className="flex flex-col">
                          <span className="text-2xl font-mono font-light">{themeColor}</span>
                          <span className="text-xs text-stone-400">{t.hexCode}</span>
                        </div>
                      </div>
                    </div>
                 </section>
              </div>

              {/* Right Col: Data */}
              <div className="md:col-span-2">
                <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                  <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold tracking-tight">{t.recordsTitle}</h2>
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-600 px-2 py-1 rounded">
                      {records.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {records.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-stone-300">
                        <Archive size={48} strokeWidth={1} className="mb-4" />
                        <p>{t.empty}</p>
                      </div>
                    ) : (
                      records.map(r => (
                        <AdminRow 
                          key={r.id} 
                          record={r} 
                          themeColor={themeColor} 
                          onDelete={handleDelete} 
                          confirmLabel={t.confirm}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // 4. DISPLAY VIEW (Dashboard)
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-900 flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-stone-100 px-8 py-6 flex justify-between items-center supports-[backdrop-filter]:bg-white/60">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('home')} 
              className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 hover:bg-stone-900 hover:text-white transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t.trends}</h1>
            </div>
         </div>
         <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-stone-400">{new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}</div>
         </div>
      </div>

      <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title={t.revenue} 
            value={formatCurrency(stats.totalRevenue)} 
            icon={DollarSign}
            themeColor={themeColor}
            trend={t.live}
          />
          <StatCard 
            title={t.transactions} 
            value={stats.transactionCount.toString()} 
            icon={List}
            themeColor={SECONDARY_ACCENT}
          />
          <StatCard 
            title={t.impact} 
            value={`${formatNumber(stats.carbonEmissions)}g`} 
            icon={Leaf}
            themeColor={SECONDARY_ACCENT}
            trend={t.co2Saved}
          />
        </div>

        {/* Charts & List Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[500px]">
          
          {/* Chart Area */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 flex flex-col border border-stone-100 relative overflow-hidden shadow-sm">
             <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                  <h2 className="text-2xl font-light tracking-tight mb-1">{t.velocity}</h2>
                </div>
                <Activity className="text-stone-300" />
             </div>
             
             <div className="flex-1 w-full min-h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={themeColor} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    {/* Add Grid and Axes */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#a8a29e', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#a8a29e', fontSize: 12, fontWeight: 500 }}
                      tickFormatter={(value) => `¥${value}`}
                      dx={-10}
                    />
                    
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        fontFamily: 'Inter'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke={themeColor} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: themeColor }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Recent List */}
          <div className="lg:col-span-1 bg-white/60 backdrop-blur-sm rounded-[2.5rem] border border-stone-200 p-8 flex flex-col shadow-xl shadow-stone-100/50">
             <h2 className="text-lg font-bold tracking-tight mb-6">{t.recent}</h2>
             <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4">
                <AnimatePresence mode='popLayout'>
                  {records.length === 0 ? (
                    <div className="text-center py-12 text-stone-300 text-sm">{t.noData}</div>
                  ) : (
                    records.slice().reverse().map(r => (
                      <TransactionRow 
                        key={r.id} 
                        record={r} 
                        themeColor={themeColor} 
                        onDelete={handleDelete} 
                        removeLabel={t.remove}
                      />
                    ))
                  )}
                </AnimatePresence>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default App;