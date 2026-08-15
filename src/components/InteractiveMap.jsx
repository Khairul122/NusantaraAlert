import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Activity, Shield, HeartPulse, CloudRain } from 'lucide-react';

// Fix leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Hospital & SAR Icon
const hospitalIcon = L.divIcon({
  className: 'custom-hospital-icon',
  html: `<div style="background-color: #10B981; color: white; width: 26px; height: 26px; borderRadius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🏥</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

// Major Indonesian Active Fault Lines (Sesar Aktif)
const FAULT_LINES = [
  {
    name: 'Zona Megathrust Sunda (Sumatera - Jawa)',
    color: '#EF4444',
    weight: 3,
    dashArray: '6, 6',
    coords: [
      [5.5, 93.0], [2.0, 95.5], [-1.5, 97.5], [-4.0, 100.5], [-6.5, 103.5], [-8.5, 107.5], [-9.5, 112.5], [-10.5, 118.5]
    ]
  },
  {
    name: 'Sesar Lembang (Jawa Barat)',
    color: '#F59E0B',
    weight: 4,
    coords: [
      [-6.81, 107.52], [-6.82, 107.60], [-6.83, 107.72]
    ]
  },
  {
    name: 'Sesar Opak (D.I. Yogyakarta)',
    color: '#F59E0B',
    weight: 4,
    coords: [
      [-8.05, 110.30], [-7.95, 110.38], [-7.85, 110.45]
    ]
  },
  {
    name: 'Sesar Palu-Koro (Sulawesi Tengah)',
    color: '#DC2626',
    weight: 4,
    coords: [
      [-0.5, 119.7], [-1.2, 119.9], [-2.0, 120.3], [-2.8, 120.8]
    ]
  },
  {
    name: 'Sesar Sumatra / Semangko',
    color: '#F97316',
    weight: 3,
    coords: [
      [5.2, 95.8], [3.5, 97.0], [1.8, 99.0], [-1.0, 101.2], [-3.5, 103.0], [-5.5, 104.8]
    ]
  },
  {
    name: 'Sesar Sorong (Papua)',
    color: '#F59E0B',
    weight: 3,
    coords: [
      [-0.8, 131.0], [-1.0, 134.0], [-1.5, 137.0]
    ]
  }
];

// Major Emergency Shelters & Hospitals
const EMERGENCY_FACILITIES = [
  { name: 'RSUPN Dr. Cipto Mangunkusumo', city: 'Jakarta Pusat', coords: [-6.197, 106.848], phone: '119' },
  { name: 'RSUP Dr. Hasan Sadikin', city: 'Bandung', coords: [-6.897, 107.598], phone: '(022) 2034953' },
  { name: 'RSUP Dr. Sardjito & Posko SAR Sleman', city: 'Yogyakarta', coords: [-7.768, 110.373], phone: '115' },
  { name: 'RSUD Dr. Soetomo & Posko SAR Surabaya', city: 'Surabaya', coords: [-7.275, 112.758], phone: '115' },
  { name: 'RSUD Undata Palu & Posko SAR Sulteng', city: 'Palu', coords: [-0.887, 119.878], phone: '115' },
  { name: 'RSUP H. Adam Malik', city: 'Medan', coords: [3.523, 98.608], phone: '119' }
];

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 6, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function InteractiveMap({ quakes = [], selectedQuake, onSelectQuake }) {
  const [showFaults, setShowFaults] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRainRadar, setShowRainRadar] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  const parseCoords = (coordStr) => {
    if (!coordStr) return [-2.5489, 118.0149];
    const parts = coordStr.split(',').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts;
    }
    return [-2.5489, 118.0149];
  };

  const activeCenter = selectedQuake 
    ? parseCoords(selectedQuake.Coordinates)
    : [-2.5489, 118.0149];

  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl border border-surface-border bg-surface-container shadow-sm">
      {/* Floating Layer Control Toggle Button */}
      <div className="absolute top-4 right-4 z-30">
        <button 
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className="bg-surface-container-lowest/90 backdrop-blur-md border border-surface-border p-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold text-on-surface hover:bg-surface-container-low transition-all"
          title="Layer Tematik Peta Bencana"
        >
          <Layers className="w-4 h-4 text-primary" />
          <span>Layer Peta</span>
        </button>

        {/* Floating Layer Selection Panel */}
        {showLayerPanel && (
          <div className="absolute right-0 top-12 bg-surface-container-lowest/95 backdrop-blur-md border border-surface-border p-3.5 rounded-2xl shadow-2xl w-60 space-y-2.5 z-30 text-xs">
            <h4 className="font-extrabold text-on-surface border-b border-surface-border pb-1.5 uppercase text-[10px] tracking-wider">
              Layer Tematik Bencana
            </h4>

            <label className="flex items-center gap-2.5 cursor-pointer font-medium text-on-surface hover:text-primary">
              <input 
                type="checkbox" 
                checked={showFaults} 
                onChange={(e) => setShowFaults(e.target.checked)} 
                className="w-4 h-4 accent-alert-rose rounded"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-alert-rose rounded-full"></span>
                Jalur Sesar Aktif (Patahan)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer font-medium text-on-surface hover:text-primary">
              <input 
                type="checkbox" 
                checked={showShelters} 
                onChange={(e) => setShowShelters(e.target.checked)} 
                className="w-4 h-4 accent-safety-emerald rounded"
              />
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-safety-emerald" />
                Posko SAR & Rumah Sakit
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer font-medium text-on-surface hover:text-primary">
              <input 
                type="checkbox" 
                checked={showRainRadar} 
                onChange={(e) => setShowRainRadar(e.target.checked)} 
                className="w-4 h-4 accent-weather-sky rounded"
              />
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-weather-sky" />
                Radar Awan & Hujan Live
              </span>
            </label>
          </div>
        )}
      </div>

      <MapContainer 
        center={activeCenter} 
        zoom={selectedQuake ? 7 : 5} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Rain Radar Weather Tile Overlay */}
        {showRainRadar && (
          <TileLayer
            attribution='Rain Radar BMKG & OpenWeather'
            url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02"
            opacity={0.65}
          />
        )}
        
        <MapController center={activeCenter} />

        {/* Active Fault Line Overlay */}
        {showFaults && FAULT_LINES.map((fault, idx) => (
          <Polyline
            key={`fault-${idx}`}
            positions={fault.coords}
            pathOptions={{
              color: fault.color,
              weight: fault.weight,
              dashArray: fault.dashArray || undefined,
              opacity: 0.85
            }}
          >
            <Popup>
              <div className="p-1 font-sans">
                <span className="text-[10px] font-bold uppercase text-alert-rose">Sesar Aktif Indonesia</span>
                <div className="font-extrabold text-xs text-slate-900 mt-0.5">{fault.name}</div>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Emergency Shelters & Hospitals Markers */}
        {showShelters && EMERGENCY_FACILITIES.map((shelter, idx) => (
          <Marker
            key={`shelter-${idx}`}
            position={shelter.coords}
            icon={hospitalIcon}
          >
            <Popup>
              <div className="p-1 font-sans">
                <span className="text-[10px] font-bold uppercase text-emerald-600">Posko Evakuasi / RS Rujukan</span>
                <div className="font-bold text-xs text-slate-900 mt-0.5">{shelter.name}</div>
                <div className="text-[11px] text-slate-500">{shelter.city} &bull; Hotline: {shelter.phone}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Earthquakes Seismology Markers */}
        {quakes.map((q, idx) => {
          const coords = parseCoords(q.Coordinates);
          const mag = parseFloat(q.Magnitude) || 5.0;
          let color = '#10B981';
          if (mag >= 6.0) color = '#F43F5E';
          else if (mag >= 5.0) color = '#F59E0B';

          const isSelected = selectedQuake && selectedQuake.id === q.id;

          return (
            <React.Fragment key={q.id || idx}>
              <CircleMarker
                center={coords}
                radius={mag * (isSelected ? 6 : 4)}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isSelected ? 0.4 : 0.25,
                  color: color,
                  weight: isSelected ? 3 : 1.5,
                }}
              />

              <CircleMarker
                center={coords}
                radius={Math.max(6, mag * 1.5)}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.9,
                  color: '#ffffff',
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => onSelectQuake && onSelectQuake(q)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 max-w-[200px] font-sans">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="px-2 py-0.5 rounded-full text-white text-xs font-bold"
                        style={{ backgroundColor: color }}
                      >
                        M {q.Magnitude}
                      </span>
                      <span className="text-[11px] text-gray-500 font-semibold">{q.Kedalaman}</span>
                    </div>
                    <div className="font-bold text-xs text-gray-900 leading-tight mb-1">{q.Wilayah}</div>
                    <div className="text-[10px] text-gray-500 font-medium">{q.Jam} &bull; {q.Tanggal}</div>
                    <button 
                      onClick={() => onSelectQuake && onSelectQuake(q)}
                      className="mt-2 w-full bg-emerald-600 text-white text-[11px] font-bold py-1 rounded hover:bg-emerald-700 transition-colors"
                    >
                      Detail Episentrum
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
