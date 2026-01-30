
import React from 'react';
import { ProcessingLayer } from '../types';

const LAYERS: ProcessingLayer[] = [
  { id: '1', name: 'Unified Dashboard', description: 'Actionable planetary intelligence UI', active: true, load: 12 },
  { id: '2', name: 'Cloud Compute', description: 'Elastic multi-region processing', active: true, load: 45 },
  { id: '3', name: 'AI/ML Fusion', description: 'Feature extraction & anomaly detection', active: true, load: 88 },
  { id: '4', name: 'Standardization', description: 'Radiometric & geometric correction', active: true, load: 30 },
  { id: '5', name: 'Data Ingestion', description: 'Multi-constellation gateway (S/L/I)', active: true, load: 62 },
];

const ProcessingPipeline: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {LAYERS.map((layer, idx) => (
        <div key={layer.id} className="relative group w-full max-w-2xl">
          {/* Connector Line */}
          {idx < LAYERS.length - 1 && (
            <div className="absolute left-1/2 -bottom-4 w-px h-4 bg-sky-500/30 group-hover:bg-sky-400 transition-colors"></div>
          )}
          
          <div className="glass-card p-4 rounded-lg flex items-center justify-between hover:border-sky-500/50 transition-all cursor-default">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${layer.load > 80 ? 'bg-amber-400 animate-pulse' : 'bg-sky-400'}`}></div>
              <div>
                <h3 className="text-sm font-bold tracking-wider text-sky-100 uppercase">{layer.name}</h3>
                <p className="text-xs text-slate-400">{layer.description}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="mono text-[10px] text-sky-400/70">LOAD {layer.load}%</span>
              <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 transition-all duration-500" 
                  style={{ width: `${layer.load}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessingPipeline;
