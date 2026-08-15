import React, { useState } from 'react';
import { X, Search, ShieldAlert, AlertTriangle, CheckCircle2, MapPin, Activity, Flame, Droplets, Mountain } from 'lucide-react';

const REGENCY_RISK_DATA = [
  {
    name: 'Kab. Cianjur',
    province: 'Jawa Barat',
    quakeRisk: 'Tinggi',
    tsunamiRisk: 'Sedang',
    floodRisk: 'Tinggi',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Rendah',
    overallScore: 88,
    advice: 'Wilayah jalur sesar aktif & rawan pergerakan tanah. Pastikan konstruksi bangunan tahan gempa & hindari lereng curam.'
  },
  {
    name: 'Kab. Sleman',
    province: 'D.I. Yogyakarta',
    quakeRisk: 'Tinggi',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Sedang',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Tinggi (Merapi)',
    overallScore: 84,
    advice: 'Kawasan rawan erupsi Gunung Merapi & gempa Sesar Opak. Pantau jalur evakuasi resmi Pemkab Sleman.'
  },
  {
    name: 'Kota Bandung',
    province: 'Jawa Barat',
    quakeRisk: 'Tinggi (Sesar Lembang)',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Sedang (Tangkuban Perahu)',
    overallScore: 78,
    advice: 'Potensi ancaman gempa Sesar Lembang bagian utara. Disarankan perkuatan struktur rumah & sosialisasi keluarga.'
  },
  {
    name: 'Kota Palu',
    province: 'Sulawesi Tengah',
    quakeRisk: 'Tinggi (Sesar Palu-Koro)',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Sedang',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Rendah',
    overallScore: 92,
    advice: 'Zona merah likuifaksi & tsunami Sesar Palu-Koro. Selalu utamakan evakuasi mandiri menuju area bukit.'
  },
  {
    name: 'DKI Jakarta (Seluruh Wilayah)',
    province: 'DKI Jakarta',
    quakeRisk: 'Sedang',
    tsunamiRisk: 'Sedang (Pesisir Utara)',
    floodRisk: 'Tinggi',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 75,
    advice: 'Risiko utama banjir luapan sungai & penurunan muka tanah. Siapkan pompa air keluarga & dokumen penting.'
  },
  {
    name: 'Kota Surabaya',
    province: 'Jawa Timur',
    quakeRisk: 'Sedang',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Sedang',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 62,
    advice: 'Risiko genangan banjir rob di pesisir. Pantau pembaruan cuaca maritim BMKG Perak.'
  },
  {
    name: 'Kab. Kepulauan Mentawai',
    province: 'Sumatera Barat',
    quakeRisk: 'Tinggi (Megathrust)',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Sedang',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Rendah',
    overallScore: 95,
    advice: 'Zona Megathrust aktif. Jauhi garis pantai segera jika terasa gempa lebih dari 20 detik.'
  }
];

export default function DisasterRiskModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegency, setSelectedRegency] = useState(REGENCY_RISK_DATA[0]);

  if (!isOpen) return null;

  const filteredData = REGENCY_RISK_DATA.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskBadge = (level) => {
    if (level.includes('Tinggi')) return 'bg-alert-rose/15 text-alert-rose border-alert-rose/30';
    if (level.includes('Sedang')) return 'bg-warning-amber/15 text-warning-amber border-warning-amber/30';
    return 'bg-safety-emerald/15 text-safety-emerald border-safety-emerald/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-surface-container-lowest rounded-3xl border border-surface-border w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-surface-border flex justify-between items-center bg-surface-container-low/60">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-extrabold text-base text-on-surface">Indeks Risiko Bencana Per Kabupaten / Kota</h3>
              <p className="text-xs text-text-muted">Kalkulasi Tingkat Kerawanan & Potensi Ancam Geofisika BMKG / BNPB</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
            aria-label="Tutup Modal Risiko Bencana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-surface-border bg-surface-container-lowest">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama Kabupaten atau Kota (contoh: Sleman, Cianjur, Palu, Bandung)..."
              className="w-full bg-surface-container-low border border-surface-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Regency Select Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredData.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRegency(item)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedRegency.name === item.name
                    ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                    : 'bg-surface-container-low border-surface-border text-on-surface hover:border-primary/50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{item.name}</div>
                  <div className="text-[10px] text-text-muted">{item.province}</div>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getRiskBadge(item.quakeRisk)}`}>
                  {item.overallScore}
                </span>
              </button>
            ))}
          </div>

          {/* Detailed Selected Regency Breakdown */}
          {selectedRegency && (
            <div className="bg-surface-container-low p-5 rounded-3xl border border-surface-border space-y-4">
              <div className="flex justify-between items-start border-b border-surface-border pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Kajian Kerawanan Bencana
                  </span>
                  <h2 className="text-xl font-extrabold text-on-surface mt-1">{selectedRegency.name}</h2>
                  <p className="text-xs text-text-muted font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {selectedRegency.province}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-alert-rose">{selectedRegency.overallScore}/100</div>
                  <div className="text-[10px] font-bold text-text-muted">Skor Kerawanan</div>
                </div>
              </div>

              {/* Risk Meters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-alert-rose" /> Gempa Bumi
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.quakeRisk)}`}>
                      {selectedRegency.quakeRisk}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-warning-amber" /> Tsunami
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.tsunamiRisk)}`}>
                      {selectedRegency.tsunamiRisk}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-weather-sky" /> Banjir
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.floodRisk)}`}>
                      {selectedRegency.floodRisk}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5 text-secondary" /> Tanah Longsor
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.landslideRisk)}`}>
                      {selectedRegency.landslideRisk}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border col-span-2 sm:col-span-2">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-600" /> Gunung Berapi
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.volcanoRisk)}`}>
                      {selectedRegency.volcanoRisk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advice Box */}
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-border text-xs">
                <h4 className="font-bold text-on-surface flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-safety-emerald" /> Rekomendasi Kesiapsiagaan Daerah:
                </h4>
                <p className="text-text-muted leading-relaxed">{selectedRegency.advice}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border bg-surface-container-low/50 text-right">
          <button
            onClick={onClose}
            className="bg-primary text-white hover:bg-primary/90 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
