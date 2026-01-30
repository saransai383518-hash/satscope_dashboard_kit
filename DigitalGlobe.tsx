
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface SatelliteDetails {
  id: string;
  name: string;
  source: string;
  instrument: string;
  resolution: string;
  velocity: string;
  altitude: string;
  color: string;
}

const SAT_CATALOG: Record<string, SatelliteDetails> = {
  'S1': {
    id: 'S1',
    name: 'Sentinel-2B',
    source: 'ESA / Copernicus',
    instrument: 'MSI (Multi-Spectral Instrument)',
    resolution: '10m - 60m',
    velocity: '7.5 km/s',
    altitude: '786 km',
    color: '#38bdf8'
  },
  'L8': {
    id: 'L8',
    name: 'Landsat-9',
    source: 'USGS / NASA',
    instrument: 'OLI-2 / TIRS-2',
    resolution: '15m - 100m',
    velocity: '7.5 km/s',
    altitude: '705 km',
    color: '#fbbf24'
  },
  'I2': {
    id: 'I2',
    name: 'ISRO EOS-04',
    source: 'ISRO',
    instrument: 'C-band SAR (Radar)',
    resolution: 'High Res / Wide Swath',
    velocity: '7.4 km/s',
    altitude: '529 km',
    color: '#f472b6'
  }
};

const DigitalGlobe: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [rotation, setRotation] = useState(0);
  const [streamRate, setStreamRate] = useState(4.21);
  const [telemetry, setTelemetry] = useState({ lat: '45.5230', lng: '122.6764', alt: '786.1' });
  const [selectedSat, setSelectedSat] = useState<SatelliteDetails | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const projection = d3.geoOrthographic()
      .scale(250)
      .translate([width / 2, height / 2])
      .rotate([rotation, -20]);

    const path = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule();

    // Background Glow
    svg.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", 250)
      .attr("fill", "url(#globe-gradient)")
      .attr("opacity", 0.3);

    // Graticule
    svg.append("path")
      .datum(graticule())
      .attr("class", "graticule")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#334155")
      .attr("stroke-width", 0.5);

    // Satellites
    const sats = [
      { id: 'S1', orbit: 280, speed: 0.5, color: '#38bdf8' },
      { id: 'L8', orbit: 310, speed: 0.3, color: '#fbbf24' },
      { id: 'I2', orbit: 340, speed: 0.8, color: '#f472b6' }
    ];

    sats.forEach(sat => {
      const pingScale = 1 + (streamRate - 4.0) * 0.5;
      const angle = (Date.now() / 1000 * sat.speed) % (Math.PI * 2);
      const x = width / 2 + Math.cos(angle) * sat.orbit;
      const y = height / 2 + Math.sin(angle) * sat.orbit * 0.4;

      // Orbit Path
      svg.append("ellipse")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("rx", sat.orbit)
        .attr("ry", sat.orbit * 0.4)
        .attr("fill", "none")
        .attr("stroke", sat.color)
        .attr("stroke-width", 1)
        .attr("opacity", selectedSat?.id === sat.id ? 0.4 : 0.15)
        .attr("transform", `rotate(15, ${width/2}, ${height/2})`);

      // Interactive Area for Satellite
      const group = svg.append("g")
        .attr("cursor", "pointer")
        .attr("transform", `rotate(15, ${width/2}, ${height/2})`)
        .on("click", () => {
          setSelectedSat(SAT_CATALOG[sat.id]);
        });

      // Satellite Dot
      group.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", selectedSat?.id === sat.id ? 8 : 4 * pingScale)
        .attr("fill", sat.color)
        .attr("class", "glow-blue")
        .attr("stroke", "#fff")
        .attr("stroke-width", selectedSat?.id === sat.id ? 2 : 0);

      // Label (Visible on hover or selection)
      if (selectedSat?.id === sat.id) {
        group.append("text")
          .attr("x", x + 12)
          .attr("y", y + 4)
          .attr("fill", "#fff")
          .attr("font-size", "10px")
          .attr("font-family", "JetBrains Mono")
          .text(SAT_CATALOG[sat.id].name);
      }

      // Data Stream Line
      svg.append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", width / 2)
        .attr("y2", height / 2)
        .attr("stroke", sat.color)
        .attr("stroke-width", selectedSat?.id === sat.id ? 1.5 : 0.5)
        .attr("opacity", selectedSat?.id === sat.id ? 0.6 : 0.1 + (streamRate % 0.5))
        .attr("stroke-dasharray", "4,4")
        .attr("transform", `rotate(15, ${width/2}, ${height/2})`);
    });

    const timer = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
      const curLng = (122.6764 + rotation).toFixed(4);
      setTelemetry(prev => ({ ...prev, lng: curLng }));
      setStreamRate(prev => {
        const delta = (Math.random() - 0.5) * 0.1;
        return Math.max(3.8, Math.min(5.2, prev + delta));
      });
    }, 50);

    return () => clearInterval(timer);
  }, [rotation, streamRate, selectedSat]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <svg ref={svgRef} width="600" height="600" viewBox="0 0 600 600" className="z-0">
        <defs>
          <radialGradient id="globe-gradient">
            <stop offset="70%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Visual Pulse Layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        <div className="w-64 h-64 rounded-full border border-sky-500/20 animate-pulse-slow"></div>
        <div className="w-[32rem] h-[32rem] absolute rounded-full border border-sky-400/10"></div>
      </div>

      {/* Collapsible Telemetry Panel */}
      {selectedSat && (
        <div className="absolute top-6 right-6 w-72 glass-card rounded-xl border-l-4 overflow-hidden shadow-2xl z-30 transition-all duration-300 animate-in fade-in slide-in-from-right-4" style={{ borderLeftColor: selectedSat.color }}>
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Link</span>
              <h4 className="text-white font-bold text-sm uppercase mono tracking-tight">{selectedSat.name}</h4>
            </div>
            <button 
              onClick={() => setSelectedSat(null)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div className="p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Status</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                  NOMINAL
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Source</span>
                <span className="text-[10px] text-white mono truncate">{selectedSat.source}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Instrument</span>
                <span className="text-[10px] text-sky-400 mono">{selectedSat.instrument}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Resolution</span>
                <span className="text-[10px] text-sky-400 mono">{selectedSat.resolution}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Altitude</span>
                <span className="text-[10px] text-white mono">{selectedSat.altitude}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-end">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Signal Strength</span>
                <span className="text-[9px] text-slate-300 mono">98.2%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: '98%' }}></div>
              </div>
            </div>

            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2">
              <i className="fa-solid fa-download text-[8px]"></i>
              Request Raw Data Access
            </button>
          </div>
        </div>
      )}

      {/* Telemetry OSD (On-Screen Display) */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950/80 to-transparent flex justify-between items-end z-10">
        <div className="flex gap-10">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-bold tracking-tighter uppercase">Latitude</span>
            <span className="mono text-sm text-sky-100">{telemetry.lat}° N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-bold tracking-tighter uppercase">Longitude</span>
            <span className="mono text-sm text-sky-100">{telemetry.lng}° W</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-bold tracking-tighter uppercase">Altitude</span>
            <span className="mono text-sm text-sky-100">{telemetry.alt} KM</span>
          </div>
          <div className="flex flex-col border-l border-slate-800 pl-8">
            <span className="text-[9px] text-sky-500 font-bold tracking-tighter uppercase">Aggregated Stream</span>
            <span className="mono text-sm text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></span>
              {streamRate.toFixed(2)} GB/S
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-md bg-slate-900/50 border border-slate-800 flex items-center justify-center text-sky-500 hover:bg-sky-500/10 transition-colors">
            <i className="fa-solid fa-plus text-xs"></i>
          </button>
          <button className="w-10 h-10 rounded-md bg-slate-900/50 border border-slate-800 flex items-center justify-center text-sky-500 hover:bg-sky-500/10 transition-colors">
            <i className="fa-solid fa-minus text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalGlobe;
