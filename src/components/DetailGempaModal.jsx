import React from 'react';
import { X, ShieldAlert, Share2, MapPin, Layers, Clock, AlertTriangle, Compass, CheckCircle2 } from 'lucide-react';

export default function DetailGempaModal({ quake, onClose }) {
  if (!quake) return null;

  const mag = parseFloat(quake.Magnitude) || 5.0;
  let severityColor = 'bg-warning-amber text-white';
  let badgeColor = 'bg-warning-amber/10 text-warning-amber border-warning-amber/30';
  let pulseClass = 'pulse-ring-amber';

  if (mag >= 6.0) {
    severityColor = 'bg-alert-rose text-white';
    badgeColor = 'bg-alert-rose/10 text-alert-rose border-alert-rose/30';
    pulseClass = 'pulse-ring-rose';
  } else if (mag < 5.0) {
    severityColor = 'bg-safety-emerald text-white';
    badgeColor = 'bg-safety-emerald/10 text-safety-emerald border-safety-emerald/30';
    pulseClass = 'pulse-ring-emerald';
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `NusantaraAlert - Laporan Gempa M ${quake.Magnitude}`,
        text: `Informasi Gempa Bumi M ${quake.Magnitude} di ${quake.Wilayah} pada ${quake.Jam} ${quake.Tanggal}. Kedalaman: ${quake.Kedalaman}. Status: ${quake.Potensi}`,
        url: window.location.href,
      }).catch(err => console.log('Share error:', err));
    } else {
      alert(`Informasi Gempa Berhasil Disalin: M ${quake.Magnitude} - ${quake.Wilayah} (${quake.Potensi})`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-surface-container-lowest rounded-3xl border border-surface-border w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-surface-border flex justify-between items-center bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-alert-rose animate-pulse"></span>
            <h3 className="font-bold text-base text-on-surface">Laporan Rincian Gempa Bumi BMKG</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
            aria-label="Tutup Modal Detail Gempa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Main Hero Card */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-border flex items-center gap-5 relative overflow-hidden">
            <div className={`w-20 h-20 rounded-2xl ${severityColor} flex flex-col items-center justify-center shadow-lg relative ${pulseClass} shrink-0`}>
              <span className="text-xs font-semibold uppercase opacity-90">Mag</span>
              <span className="text-3xl font-extrabold tracking-tight">{quake.Magnitude}</span>
            </div>

            <div>
              <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border mb-1.5 ${badgeColor}`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {quake.Potensi || "Dalam Pemantauan BMKG"}
              </span>
              <h2 className="text-lg font-bold text-on-surface leading-snug">{quake.Wilayah}</h2>
              <div className="text-xs text-text-muted flex items-center gap-1 mt-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {quake.Jam} &bull; {quake.Tanggal}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-surface-border">
              <div className="text-xs text-text-muted flex items-center gap-1 font-medium mb-1">
                <Layers className="w-4 h-4 text-primary" /> Kedalaman Seismik
              </div>
              <div className="text-base font-bold text-on-surface">{quake.Kedalaman}</div>
            </div>

            <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-surface-border">
              <div className="text-xs text-text-muted flex items-center gap-1 font-medium mb-1">
                <Compass className="w-4 h-4 text-primary" /> Koordinat Episentrum
              </div>
              <div className="text-base font-bold text-on-surface">{quake.Coordinates || `${quake.Lintang}, ${quake.Bujur}`}</div>
            </div>

            <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-surface-border col-span-2">
              <div className="text-xs text-text-muted flex items-center gap-1 font-medium mb-1">
                <MapPin className="w-4 h-4 text-warning-amber" /> Wilayah Dirasakan (Skala MMI)
              </div>
              <div className="text-sm font-semibold text-on-surface mt-1 bg-surface-container-low p-2.5 rounded-lg border border-surface-border">
                {quake.Dirasakan || "Tidak ada data rincian MMI"}
              </div>
            </div>
          </div>

          {/* Tsunami Assessment Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            quake.Potensi && quake.Potensi.toLowerCase().includes('tsunami') && !quake.Potensi.toLowerCase().includes('tidak')
              ? 'bg-alert-rose/10 border-alert-rose/40 text-alert-rose'
              : 'bg-safety-emerald/10 border-safety-emerald/30 text-safety-emerald'
          }`}>
            <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Analisis Potensi Tsunami</h4>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                {quake.Potensi || "Tidak berpotensi Tsunami. Masyarakat dihimbau tetap tenang."}
              </p>
            </div>
          </div>

          {/* Panduan Keselamatan Darurat */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-border space-y-2">
            <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Tindakan Keselamatan Diri yang Disarankan:
            </h4>
            <ul className="text-xs text-on-surface-variant space-y-1.5 list-disc list-inside">
              <li>Lakukan prinsip Merunduk, Lindungi Kepala di bawah meja kokoh, dan Berpegangan (Drop, Cover, and Hold On).</li>
              <li>Jauhi cermin, jendela kaca, serta benda-benda tinggi yang berisiko roboh.</li>
              <li>Apabila berada di luar gedung: Hindari tiang listrik, papan reklame, dan bangunan tinggi. Lari menuju area terbuka.</li>
              <li>Pantau terus pembaruan informasi resmi dari saluran BMKG dan BNPB.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-surface-border bg-surface-container-low/50 flex gap-3">
          <button 
            onClick={handleShare}
            className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-surface-border transition-colors"
          >
            <Share2 className="w-4 h-4" /> Bagikan Laporan
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-primary text-white hover:bg-primary/90 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
