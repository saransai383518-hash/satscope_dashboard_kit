
import React from 'react';
import { ObservationInsight } from '../types';

interface Props {
  insight: ObservationInsight | null;
  loading: boolean;
}

const IntelligenceCard: React.FC<Props> = ({ insight, loading }) => {
  if (loading) {
    return (
      <div className="glass-card p-6 rounded-xl animate-pulse flex flex-col gap-4">
        <div className="h-4 bg-slate-800 rounded w-1/4"></div>
        <div className="h-8 bg-slate-800 rounded w-3/4"></div>
        <div className="h-20 bg-slate-800 rounded w-full"></div>
      </div>
    );
  }

  if (!insight) return null;

  const threatColors = {
    low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    moderate: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    high: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    critical: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  };

  return (
    <div className="glass-card p-6 rounded-xl border-l-4 border-l-sky-500 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em]">{insight.category} ANALYTICS</span>
          <h2 className="text-2xl font-bold text-white mt-1">{insight.region}</h2>
        </div>
        <div className={`px-2 py-1 rounded border text-[10px] font-bold uppercase ${threatColors[insight.threatLevel]}`}>
          {insight.threatLevel} RISK
        </div>
      </div>

      <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
        <p className="text-sm text-slate-300 leading-relaxed italic">
          "{insight.summary}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Confidence</span>
          <span className="text-lg mono text-white">{(insight.confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Source Sync</span>
          <span className="text-lg mono text-white">ACTIVE</span>
        </div>
      </div>

      <div className="text-xs text-slate-400 border-t border-slate-800 pt-4">
        {insight.details}
      </div>
    </div>
  );
};

export default IntelligenceCard;
