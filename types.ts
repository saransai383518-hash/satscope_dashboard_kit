
export interface SatelliteData {
  id: string;
  name: string;
  source: 'Sentinel' | 'Landsat' | 'ISRO';
  status: 'active' | 'calibration' | 'standby';
  lastPing: number;
  dataStreamRate: string;
}

export interface ObservationInsight {
  category: 'Agriculture' | 'Disaster' | 'Climate' | 'Urban';
  region: string;
  confidence: number;
  summary: string;
  threatLevel: 'low' | 'moderate' | 'high' | 'critical';
  details: string;
}

export interface ProcessingLayer {
  id: string;
  name: string;
  description: string;
  active: boolean;
  load: number;
}
