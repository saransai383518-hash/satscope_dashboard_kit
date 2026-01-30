
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import DigitalGlobe from './components/DigitalGlobe';
import ProcessingPipeline from './components/ProcessingPipeline';
import IntelligenceCard from './components/IntelligenceCard';
import { generateGlobalInsight } from './services/geminiService';
import { ObservationInsight } from './types';

const MOCK_TIME_DATA = [
  { time: '00:00', yield: 400, risk: 240 },
  { time: '04:00', yield: 450, risk: 220 },
  { time: '08:00', yield: 500, risk: 200 },
  { time: '12:00', yield: 480, risk: 300 },
  { time: '16:00', yield: 520, risk: 280 },
  { time: '20:00', yield: 550, risk: 250 },
  { time: '23:59', yield: 580, risk: 210 },
];

const PRESET_OBSERVATIONS = [
  { label: 'Smart Crop Yields', icon: 'fa-seedling', topic: 'Smart Crop Yields in Ukraine', category: 'Agriculture' },
  { label: 'Precision Irrigation', icon: 'fa-droplet', topic: 'Precision Irrigation in California', category: 'Agriculture' },
  { label: 'Current Disaster Zones', icon: 'fa-burst', topic: 'Current Disaster Zones globally', category: 'Disaster' },
  { label: 'Wildfire Prediction', icon: 'fa-fire', topic: 'Wildfire Prediction in Australia', category: 'Disaster' },
  { label: 'Global Warming Hotspots', icon: 'fa-temperature-high', topic: 'Global Warming Hotspots in Arctic', category: 'Climate' },
  { label: 'Carbon Sequestration', icon: 'fa-leaf', topic: 'Carbon Sequestration in Amazon', category: 'Climate' },
  { label: 'Urban Expansion Rates', icon: 'fa-city', topic: 'Urban Expansion Rates in Lagos', category: 'Urban' },
  { label: 'Traffic Flow AI', icon: 'fa-car', topic: 'Traffic Flow AI in Tokyo', category: 'Urban' }
];

const CATEGORIES = ['All', 'Agriculture', 'Disaster', 'Climate', 'Urban'];

const App: React.FC = () => {
  const [insight, setInsight] = useState<ObservationInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('Global Carbon Monitoring');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [globalStreamRate, setGlobalStreamRate] = useState(4.21);

  const filteredObservations = useMemo(() => {
    return PRESET_OBSERVATIONS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const fetchInsight = async (newTopic: string) => {
    setLoading(true);
    setTopic(newTopic);
    try {
      const data = await generateGlobalInsight(newTopic);
      setInsight(data);
    } catch (err) {
      console.error("Failed to fetch insight", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchInsight(searchQuery);
    }
  };

  useEffect(() => {
    fetchInsight('Global Carbon Monitoring');
    
    const interval = setInterval(() => {
        setGlobalStreamRate(prev => {
            const delta = (Math.random() - 0.5) * 0.1;
            return Math.max(3.8, Math.min(5.2, prev + delta));
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-sky-500/30">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-slate-950 font-bold text-xl">T</div>
        <div className="flex flex-col gap-6 text-slate-500">
          <i className="fa-solid fa-earth-americas text-sky-400 cursor-pointer hover:text-sky-300"></i>
          <i className="fa-solid fa-satellite cursor-pointer hover:text-sky-300"></i>
          <i className="fa-solid fa-chart-line cursor-pointer hover:text-sky-300"></i>
          <i className="fa-solid fa-shield-halved cursor-pointer hover:text-sky-300"></i>
          <i className="fa-solid fa-gear cursor-pointer hover:text-sky-300"></i>
        </div>
      </nav>

      <main className="pl-16 p-8 grid grid-cols-12 gap-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="col-span-12 flex items-center justify-between border-b border-slate-800 pb-6 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              TerraNexus <span className="text-sky-500 font-light">OS v4.2</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Multi-Satellite Uplink Established (Sentinel-2, Landsat-9, ISRO EOS-04)
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => fetchInsight('Real-time Disaster Response Analysis')}
              className="px-4 py-2 glass-card rounded-lg text-xs font-bold uppercase tracking-wider hover:border-sky-500 transition-all"
            >
              Scan Hotspots
            </button>
            <button className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all">
              Export Intelligence
            </button>
          </div>
        </header>

        {/* Left Column: Intelligence & Controls */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-xl flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest">Global Search</h3>
              <form onSubmit={handleCustomSearch} className="relative group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query planetary data..."
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors">
                  <i className="fa-solid fa-magnifying-glass text-xs"></i>
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Filter Domain</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all ${selectedCategory === cat ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
              {filteredObservations.length > 0 ? (
                filteredObservations.map(item => (
                  <button 
                    key={item.label}
                    onClick={() => fetchInsight(item.topic)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${topic === item.topic ? 'bg-sky-500/10 border-sky-500 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <i className={`fa-solid ${item.icon} w-5 text-sky-400/70`}></i>
                      {item.label}
                    </span>
                    <i className="fa-solid fa-chevron-right text-[10px] opacity-30"></i>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-slate-600 text-xs italic">
                  No preset observations match your query.
                </div>
              )}
            </div>
          </div>

          <IntelligenceCard insight={insight} loading={loading} />

          <div className="glass-card p-6 rounded-xl">
             <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-4">Fusion Processing Flow</h3>
             <ProcessingPipeline />
          </div>
        </section>

        {/* Center Column: Global Viz */}
        <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="relative glass-card rounded-3xl h-[600px] overflow-hidden flex flex-col shadow-[0_0_50px_-12px_rgba(14,165,233,0.15)]">
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
              <span className="mono text-[10px] text-sky-400 bg-sky-950/70 px-2 py-1 rounded border border-sky-500/30 backdrop-blur-md">
                PROJECTION: ORTHOGRAPHIC 1.0.4
              </span>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              <DigitalGlobe />
            </div>
          </div>

          {/* Metrics Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Resource Index</h4>
                <span className="text-[10px] text-emerald-400">+12.4% Δ</span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_TIME_DATA}>
                    <defs>
                      <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#0ea5e9', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="yield" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorYield)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Factor Analysis</h4>
                <span className="text-[10px] text-rose-400">-5.2% Δ</span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_TIME_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#f43f5e', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-16 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-6 py-2.5 flex justify-between items-center text-[10px] font-medium tracking-wider text-slate-500 z-40">
        <div className="flex gap-8">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> SENTINEL-2B ONLINE
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> LANDSAT-9 ONLINE
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span> ISRO EOS-04 CALIBRATING
          </span>
        </div>
        <div className="mono uppercase flex items-center gap-6">
          <span>Latency: 42ms</span>
          <span className="text-sky-400 font-bold">Stream Index: {globalStreamRate.toFixed(2)} GB/s</span>
          <span className="flex items-center gap-1">System: <span className="text-emerald-400">Nominal</span></span>
        </div>
      </footer>
    </div>
  );
};

export default App;
